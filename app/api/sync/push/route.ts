import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  try {
    const { base64 } = await req.json()
    if (!base64) return NextResponse.json({ error: 'Missing base64' }, { status: 400 })

    const buffer = Buffer.from(base64, 'base64')
    const result = await put('db/tasks.sqlite', buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/x-sqlite3',
    })
    return NextResponse.json({ ok: true, url: result.url })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
