import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'
const configuration = new Configuration({
  apiKey: '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',
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { prompt, amount = '1', resolution = '512x512' } = body
    const isPro = await checkSubscription()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!configuration.apiKey) {
      return new NextResponse('OpenAI API Key not configured', { status: 500 })
    }

    if (!prompt) {
      return new NextResponse('Prompt are required', { status: 400 })
    }

    if (!amount) {
      return new NextResponse('Amount are required', { status: 400 })
    }

    if (!resolution) {
      return new NextResponse('Resolution are required', { status: 400 })
    }

    const freeTrial = await checkApiLimit()

    if (!freeTrial && !isPro) {
      return new NextResponse('Free trial has expired', { status: 403 })
    }

    const response = await openai.createImage({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    })

    if (!isPro) await increaseApiLimit()

    return NextResponse.json(response.data.data)
  } catch (error: any) {
    console.log('[CONVERSATION_ERROR]', error.message)

    return new NextResponse('Internal error', { status: 500 })
  }
}
