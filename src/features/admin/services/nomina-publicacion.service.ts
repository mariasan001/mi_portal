import { API_RUTAS } from "@/lib/api/api.rutas"

export async function liberarVersion(
  versionId: number,
  body: any
) {
  const res = await fetch(
    API_RUTAS.nomina.liberarVersion(versionId),
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return res.json()
}

export async function generarSnapshots(versionId: number) {
  const res = await fetch(
    API_RUTAS.nomina.generarSnapshots(versionId),
    { method: 'POST' }
  )

  return res.json()
}

export async function generarRecibos(versionId: number) {
  const res = await fetch(
    API_RUTAS.nomina.generarRecibos(versionId),
    { method: 'POST' }
  )

  return res.json()
}

export async function syncCore(versionId: number) {
  const res = await fetch(
    API_RUTAS.nomina.syncVersionCore(versionId),
    { method: 'POST' }
  )

  return res.json()
}