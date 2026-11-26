// Base pública de CouchDB local (sin usuario ni contraseña, como indicó el ingeniero)
const URL_BASE = import.meta.env.VITE_COUCH_URL || 'http://localhost:5984'
const BD = 'fpi-imagenes'

export function urlImagen(id) {
  return `${URL_BASE}/${BD}/${encodeURIComponent(id)}/foto`
}

export async function subirImagen(archivo) {
  const id = 'foto:' + crypto.randomUUID()
  const r = await fetch(`${URL_BASE}/${BD}/${encodeURIComponent(id)}/foto`, {
    method: 'PUT',
    headers: { 'Content-Type': archivo.type || 'application/octet-stream' },
    body: archivo,
  })
  if (!r.ok) {
    const detalle = await r.text()
    throw new Error('CouchDB respondió ' + r.status + ': ' + detalle)
  }
  return id
}
