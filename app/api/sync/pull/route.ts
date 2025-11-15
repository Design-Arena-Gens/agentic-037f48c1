import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export async function GET() {
  try {
    const blobs = await list({ prefix: 'db/' })
    const match = blobs.blobs.find(b => b.pathname === 'db/tasks.sqlite')
    if (!match) return NextResponse.json({ exists: false })
    const res = await fetch(match.url, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ exists: false })
    const arrayBuffer = await res.arrayBuffer()
    const base64 = Buffer.from(new Uint8Array(arrayBuffer)).toString('base64')
    return NextResponse.json({ exists: true, base64 })
  } catch {
    return NextResponse.json({ exists: false })
  }
}
