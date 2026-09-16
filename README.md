# ⚽ Futbolista — Aplicación Móvil Informativa y Comparador de Jugadores

**Futbolista** es una aplicación móvil desarrollada en **React Native con Expo**, concebida como un proyecto universitario elegante, estructurado y de alto impacto visual.

Su objetivo es ofrecer fichas informativas de futbolistas profesionales consultando la API pública de **TheSportsDB**, con un diseño inspirado en álbumes de cromo de futbolistas y videojuegos deportivos modernos.

---

## 🎨 Identidad Visual

- **Fondo:** Blanco cálido (`#F7F8F3`)
- **Color Principal:** Verde Oscuro (`#174D38`)
- **Superficies Secundarias & Etiquetas:** Verde Suave (`#E4EFE6`)
- **Acentos:** Amarillo Deportivo (`#E8C75A`)
- **Texto:** Oscuro Neutro (`#202B25`)
- **Estilo:** Cromos deportivos con bordes redondeados, sombras discretas y detalles de líneas de cancha en cabecera.

---

## 🚀 Tecnologías Utilizadas

- **React Native + Expo SDK (Expo Go):** Desarrollo móvil multiplataforma.
- **TypeScript:** Tipado estático para asegurar robustez en los datos.
- **Expo Router:** Navegación por archivos basada en la carpeta `src/app`.
- **StyleSheet:** Estilos nativos de React Native.
- **Fetch API:** Consultas HTTP directamente desde el dispositivo a TheSportsDB v1.
- **Caché en Memoria (`Map`):** Almacenamiento local temporal para evitar peticiones redundantes.

---

## 📂 Estructura del Proyecto

```
API-futbolitos/
├── src/
│   ├── app/
│   │   ├── _layout.tsx              # Configuración y Stack de navegación principal
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx          # Navegación inferior por pestañas (Tabs)
│   │   │   ├── index.tsx            # Pestaña "Inicio" (Grid 2 columnas con tarjetas)
│   │   │   ├── buscar.tsx           # Ruta "Buscar" (Vista previa para Etapa 2)
│   │   │   └── comparar.tsx         # Ruta "Comparar" (Vista previa para Etapa 3)
│   │   └── jugador/
│   │       └── [id].tsx             # Ficha individual dinámica del futbolista
│   ├── components/
│   │   ├── HeaderBanner.tsx         # Cabecera temática con gráficos de cancha
│   │   ├── PlayerCard.tsx           # Tarjeta tipo cromo para la cuadrícula de 2 columnas
│   │   ├── PositionBadge.tsx        # Etiqueta visual de posición
│   │   ├── EducationalPositionCard.tsx # Explicación educativa de rol táctico en español
│   │   ├── FallbackImage.tsx        # Silueta/icono cuando no hay foto disponible
│   │   ├── LoadingState.tsx         # Indicador de carga estilizado
│   │   └── ErrorState.tsx           # Pantalla de error con botón de reintento
│   ├── services/
│   │   └── footballApi.ts           # Servicio Fetch a TheSportsDB con caché local
│   ├── constants/
│   │   ├── theme.ts                 # Tokens del sistema de diseño (colores, sombras, espaciado)
│   │   └── featuredPlayers.ts       # Identificadores de los 6 futbolistas seleccionados
│   ├── types/
│   │   └── player.ts                # Interfaces TypeScript de datos e API
│   └── utils/
│       └── playerData.ts            # Cálculo de edad, normalización de estaturas/pesos
├── assets/                          # Recursos locales (imágenes, iconos)
├── app.json                         # Configuración del proyecto Expo
├── package.json                     # Dependencias y scripts del proyecto
├── tsconfig.json                    # Configuración de TypeScript
└── README.md                        # Guía del proyecto y roadmap
```

---

## 📌 Estado de la Primera Etapa (Implementado)

En esta primera etapa se ha completado:

1. **Estructura e infraestructura:** Configuración del proyecto con TypeScript y Expo Router.
2. **Sistema de Tema Visual:** Paleta de colores, sombras y tipografías centralizadas en `theme.ts`.
3. **Servicio API & Caché:** Conexión validada con TheSportsDB v1 (`https://www.thesportsdb.com/api/v1/json/123`), reutilización de peticiones en memoria con fallback seguro.
4. **Selección Editorial de 6 Jugadores:**
   - Lionel Messi (`34146370`)
   - Cristiano Ronaldo (`34146304`)
   - Kylian Mbappé (`34162098`)
   - Erling Haaland (`34169116`)
   - Jude Bellingham (`34171882`)
   - Vinícius Júnior (`34161324`)
5. **Pantalla de Inicio (`index.tsx`):**
   - Cabecera con marca "Futbolista" y eslogan.
   - Cuadrícula adaptable de 2 columnas.
   - Tarjetas tipo cromo con fotografía, nombre, número, posición y equipo.
   - Manejo de reintento independiente si una tarjeta individual falla.
6. **Ficha Individual (`jugador/[id].tsx`):**
   - Fotografía de alta resolución / recorte o silueta alternativa en caso de falla.
   - Nombre, nacionalidad, equipo indicado por la API, fecha de nacimiento.
   - **Edad calculada automáticamente** a partir de la fecha de nacimiento.
   - **Estatura normalizada a cm** y **Peso normalizado a kg**.
   - **Explicación Educativa Táctica** en español sobre la posición del futbolista (Portero, Defensa, Centrocampista, Delantero).
   - Reseña biográfica provista por la API (con soporte para español).
   - Manejo de campos inexistentes ("No disponible").

---

## 📲 Instrucciones de Ejecución (Expo Go)

### Requisitos previos
- Tener instalado **Node.js** (v18+) y **npm**.
- Disponer de un dispositivo móvil (iOS o Android) con la aplicación **Expo Go** instalada.

### Pasos para iniciar el proyecto

1. **Instalar las dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo Expo:**
   ```bash
   npx expo start
   ```

3. **Probar en tu dispositivo móvil:**
   - En **Android**: Abre la app **Expo Go** y escanea el código QR que aparece en la terminal.
   - En **iOS**: Abre la app de la **Cámara**, escanea el código QR y presiona en la notificación para abrirlo en Expo Go.
   - En **Navegador Web** (opcional): Presiona la tecla `w` en la terminal.

---

## 🔮 Próximas Etapas (Roadmap)

### 🟢 Etapa 2: Buscador por Nombre (`src/app/(tabs)/buscar.tsx`)
- Campo de búsqueda y botón "Buscar".
- Consulta a `searchplayers.php?p=Nombre`.
- Reutilización de `PlayerCard` y navegación a la ficha individual `[id].tsx`.
- Mensajes informativos de sin resultados y límite de peticiones (30 req/min).

### 🟢 Etapa 3: Comparador Objetivo (`src/app/(tabs)/comparar.tsx`) — *Valor Agregado Principal*
- Selección interactiva de dos futbolistas distintos.
- Tabla comparativa lado a lado (Edad, Estatura en cm, Peso en kg, Posición, Nacionalidad, Equipo).
- **Cálculo de diferencias objetivas:** Ejemplo: *"3 años de diferencia"*, *"8 cm de diferencia"*, *"5 kg de diferencia"*.
- Presentación neutral y respetuosa enfocada en análisis de datos.
