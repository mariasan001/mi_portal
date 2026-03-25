import { useState } from 'react'
import { generarRecibos, generarSnapshots, liberarVersion, syncCore } from '../services/nomina-publicacion.service'

export function usePublicacion() {

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleLiberar(versionId: number) {
    setLoading(true)

    const res = await liberarVersion(versionId, {
      releasedByUserId: 1,
      comments: 'release',
    })

    setResult(res)
    setLoading(false)
  }

  async function handleSnapshots(versionId: number) {
    setLoading(true)
    const res = await generarSnapshots(versionId)
    setResult(res)
    setLoading(false)
  }

  async function handleRecibos(versionId: number) {
    setLoading(true)
    const res = await generarRecibos(versionId)
    setResult(res)
    setLoading(false)
  }

  async function handleSync(versionId: number) {
    setLoading(true)
    const res = await syncCore(versionId)
    setResult(res)
    setLoading(false)
  }

  return {
    loading,
    result,
    handleLiberar,
    handleSnapshots,
    handleRecibos,
    handleSync,
  }
}