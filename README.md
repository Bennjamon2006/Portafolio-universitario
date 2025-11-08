# Vite + React SSR/SSG

Este proyecto está construido sobre un micro-framework que utiliza [Vite](https://vite.dev/) y [React](https://react.dev/) para **Server-Side Rendering (SSR)** y **Static Site Generation (SSG)**.

## Características

### Estructura modular

Para mantener la consistencia y mantenibilidad del proyecto, el código fuente (ubicado en la carpeta `src/`) se divide en los siguientes módulos:

- **`shared/`**: Contiene código utilitario y constantes transversales, como la configuración de entorno o funciones de uso común.
- **`core/`**: Define toda la lógica interna de la aplicación, incluyendo el enrutamiento, el cargado de props y la composición de componentes.
- **`app/`**: Aloja el código de la aplicación, incluyendo las páginas, componentes y definición de rutas.
- **`server/`**: Implementa el servidor de desarrollo, que engloba la lógica de enrutado dinámico, **SSR** y **Hot Module Replacement (HMR)**.

### Server-Side Rendering + Hot Module Replacement

Mediante el comando:

```sh
npm run dev
```

se levanta el servidor de desarrollo, que ofrece renderizado del lado del servidor y recarga instantánea mediante **HMR**, logrando una experiencia fluida.

### Generación de props en el servidor

Cada página puede exportar una función `getServerProps`, que se ejecuta en el servidor para generar las props que recibirá el componente de página.
En rutas dinámicas, esta función recibe los parámetros de la URL.

### Generación de parámetros estáticos

Las páginas con rutas dinámicas pueden exportar una función `generateStaticParams`, encargada de generar todas las combinaciones de parámetros posibles.

### Static Site Generation (Build)

La build puede generarse con:

```sh
npm run build
```

Esto crea la carpeta `dist/`, que contiene la aplicación estática lista para ser servida.

### Cacheado versionado de props

Durante la build se genera un archivo `dist/pages.json` que almacena las props de cada ruta, permitiendo solicitarlas todas en una sola request.
Además, para reducir peticiones, las props globales se guardan en `localStorage` y se reutilizan hasta que se detecta un cambio de versión en el `package.json`.

## Filosofía de diseño

### Pureza del core

El módulo está diseñado para ser puro, reutilizable y agnóstico al entorno.
Esto permite que tanto el servidor, el cliente o el entorno de build usen los mismos componentes y funcionalidades sin modificaciones.

### Control total antes que magia pesada

El proyecto evita frameworks monolíticos: prioriza **control total y optimización** sobre soluciones “mágicas” que abstraen, pero también restringen.

## Flujp de publicación

Los cambios se publican mediante el comando:

```sh
npm run publish
```

Lo que autonatiza procesos de build, versionado, publicación de cambios en Git y despliegue a producción.
