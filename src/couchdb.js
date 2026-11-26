const URL_BASE = 'http://127.0.0.1:5984'
const BD = 'imagenes'
const USUARIO = 'admin'
const CLAVE = 'lunaroja19'

export function urlImagen(id) {
  return `${URL_BASE}/${BD}/${id}/foto`
}

export async function subirImagen(archivo) {
  const id = crypto.randomUUID()
  const r = await fetch(`${URL_BASE}/${BD}/${id}/foto`, {
    method: 'PUT',
    headers: {
      'Content-Type': archivo.type || 'application/octet-stream',
      Authorization: 'Basic ' + btoa(admin + ':' + lunaroja19),
    },
    body: archivo,
  })
  if (!r.ok) throw new Error('CouchDB respondió ' + r.status)
  return id
}
