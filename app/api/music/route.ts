import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: 'r8_b2Hxnynuv8KCQDeON8KgHFPm58KvVXn3CuFZM',
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { prompt } = body
    const isPro = await checkSubscription()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!prompt) {
      return new NextResponse('Prompt are required', { status: 400 })
    }

    const freeTrial = await checkApiLimit()

    if (!freeTrial && !isPro) {
      return new NextResponse('Free trial has expired', { status: 403 })
    }

    const response = await replicate.run(
      'riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05',
      {
        input: {
          prompt_a: prompt,
        },
      }
    )

    if (!isPro) await increaseApiLimit()

    return NextResponse.json(response)
  } catch (error: any) {
    console.log('[MUSIC_ERROR]', error.message)

    return new NextResponse('Internal error', { status: 500 })
  }
}
