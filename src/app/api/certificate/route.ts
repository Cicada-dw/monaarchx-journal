import { NextRequest, NextResponse } from 'next/server'
import { getCertificate, setCertificate } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const download = searchParams.get('download') === '1'

  const cert = getCertificate()
  if (!cert || !cert.fileBase64) {
    if (download) {
      return NextResponse.json({ error: 'No certificate uploaded' }, { status: 404 })
    }
    return NextResponse.json({ certificate: null })
  }

  const base64 = cert.fileBase64.replace(/^data:[^;]+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')

  if (download) {
    const ext = cert.name.split('.').pop() || 'bin'
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="Monaarchx_${cert.name}"`,
      },
    })
  }

  return NextResponse.json({ certificate: cert })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, link, fileBase64 } = body

    if (!name || !fileBase64) {
      return NextResponse.json({ error: 'Name and fileBase64 are required' }, { status: 400 })
    }

    const cert = setCertificate({
      name: name.trim(),
      link: link?.trim() || '',
      fileBase64: fileBase64,
      uploadedAt: new Date().toISOString(),
    })

    return NextResponse.json({ certificate: cert }, { status: 201 })
  } catch (err) {
    console.error('POST /api/certificate error:', err)
    return NextResponse.json({ error: 'Failed to upload certificate' }, { status: 500 })
  }
}
