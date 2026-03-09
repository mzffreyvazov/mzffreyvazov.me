import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  // Verify the request is authorized (using a secret token)
  if (authHeader !== `Bearer ${process.env.REVALIDATION_TOKEN}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { paths, tags } = body

    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path)
        console.log(`Revalidated path: ${path}`)
      }
    }

    // Revalidate by tags (useful for related content)
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag)
        console.log(`Revalidated tag: ${tag}`)
      }
    }

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      paths: paths || [],
      tags: tags || []
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json({ 
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}
