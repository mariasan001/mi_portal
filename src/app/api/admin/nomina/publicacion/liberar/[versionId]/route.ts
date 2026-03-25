import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { versionId: string } }
) {
  const body = await req.json()

  const res = await fetch(
    `${process.env.API_URL}/api/admin/nomina/releases/versions/${params.versionId}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return new Response(await res.text(), {
    status: res.status,
  })
}