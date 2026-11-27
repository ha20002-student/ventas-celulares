# ventas-celulares

# Tienda CellPhone

Sitio web tipo marketplace para comprar y vender teléfonos nuevos y usados. Funciona en computadora y en celular.

Sitio publicado: Sitio publicado: https://ventas-celulares.web.app

## Funcionalidades

- Listado de teléfonos con filtros por marca, sistema, pantalla, estado (nuevo) y rango de precio.
- Buscador, orden por precio y fecha, y paginación.
- Detalle del anuncio con vendedor, teléfono, descripción, galería de fotos, botón Comprar, contacto por WhatsApp y llamada.
- Carrito de compras y compra finalizada.
- Formulario para publicar anuncios (hasta 4 imágenes). Si la marca no existe en la lista, se puede escribir una nueva.
- Pantalla de estadísticas con gráficos.
- Modo oscuro.
- Diseño adaptable a celular.

## Tecnologías

Vue 3, Vite, Pinia, Vue Router, Bootstrap 5, Chart.js, Firebase (Firestore) y CouchDB.

## Dónde se guarda cada cosa

- **Anuncios:** Firebase Firestore (en la nube).
- **Imágenes:** CouchDB local, en la base `fpi-imagenes`.

Las imágenes de un anuncio solo se ven en la computadora donde corre el CouchDB que las guardó. En otra computadora, el anuncio aparece con un recuadro sin foto.

## Instalación

Requisitos: Node 24 y CouchDB.

1. Instalar dependencias:

   ```sh
   npm install
   ```

2. Crear un archivo `.env.local` en la raíz con los datos de Firebase:

   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```

3. Configurar CouchDB (`http://localhost:5984/_utils`):
   - Crear la base de datos `fpi-imagenes` (no particionada).
   - En Permisos de esa base, quitar `admin` de Members y de Admins para que sea pública.
   - En Configuración → CORS, habilitar CORS para todos los dominios.

4. Iniciar el sitio:

   ```sh
   npm run dev
   ```

   Se abre en `http://localhost:5173`.

## Producción

Para generar la versión de producción:

```sh
npm run build
```

Esto crea la carpeta `dist`, que contiene el sitio compilado y optimizado. Para verla antes de publicar:

```sh
npm run preview
```

El sitio está publicado con Firebase Hosting:

```sh
firebase deploy --only hosting
```

Las variables `VITE_FIREBASE_...` del archivo `.env.local` se incluyen al compilar, por eso hay que tenerlo presente antes de correr `npm run build`.

Para ver imágenes desde el sitio publicado (https) con un CouchDB local (http), el navegador debe permitir contenido inseguro para el sitio.

## Autor

Paola Melissa Hernández Alvarado, carnet: HA20002 — materia: FPI
