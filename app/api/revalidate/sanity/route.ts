import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookPayload = {
  _type?: string
  slug?: string | { current?: string }
}

function getSlug(payload: WebhookPayload) {
  if (typeof payload.slug === 'string') return payload.slug
  return payload.slug?.current
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  if (!secret) {
    return NextResponse.json({ message: 'Missing SANITY_REVALIDATE_SECRET' }, { status: 500 })
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(request, secret)

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    revalidatePath('/thoughts')

    if (body?._type === 'article') {
      const slug = getSlug(body)
      if (slug) {
        revalidatePath(`/thoughts/${slug}`)
      }
    }

    return NextResponse.json({
      revalidated: true,
      documentType: body?._type || null,
      slug: body ? getSlug(body) || null : null,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Error revalidating Sanity content',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}