import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'
const configuration = new Configuration({
  apiKey: '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',
})

const openai = new OpenAIApi(configuration)

const instructionMessage: ChatCompletionRequestMessage = {
  role: 'system',
  content:
    'You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.',
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { messages } = body
    const isPro = await checkSubscription()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!configuration.apiKey) {
      return new NextResponse('OpenAI API Key not configured', { status: 500 })
    }

    if (!messages) {
      return new NextResponse('Messages are required', { status: 400 })
    }

    const freeTrial = await checkApiLimit()

    if (!freeTrial && !isPro) {
      return new NextResponse('Free trial has expired', { status: 403 })
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [instructionMessage, ...messages],
    })

    if (!isPro) await increaseApiLimit()

    return NextResponse.json(response.data.choices[0].message)
  } catch (error: any) {
    console.log('[CODE_ERROR]', error.message)

    return new NextResponse('Internal error', { status: 500 })
  }
}
