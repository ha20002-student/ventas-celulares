const URL_BASE = 'http://127.0.0.1:5984'
const BD = 'imagenes'
const USUARIO = 'admin'
const CLAVE = 'lunaroja19'

export function urlImagen(id) {
  return `${URL_BASE}/${BD}/${encodeURIComponent(id)}/foto`
}

export async function subirImagen(archivo) {
  const id = 'foto:' + crypto.randomUUID()
  const r = await fetch(`${URL_BASE}/${BD}/${encodeURIComponent(id)}/foto`, {
    method: 'PUT',
    headers: {
      'Content-Type': archivo.type || 'application/octet-stream',
      Authorization: 'Basic ' + btoa(USUARIO + ':' + CLAVE),
    },
    body: archivo,
  })
  if (!r.ok) {
    const detalle = await r.text()
    throw new Error('CouchDB respondió ' + r.status + ': ' + detalle)
  }
  return id
}
