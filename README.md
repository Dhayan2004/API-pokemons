# ⚽ Futbolista — Aplicación Móvil Informativa y Comparador de Jugadores

**Futbolista** es una aplicación móvil desarrollada en **React Native con Expo**, concebida como un proyecto universitario elegante, estructurado y de alto impacto visual.

Ofrece un catálogo ampliado de futbolistas profesionales, filtros por posición, favoritos persistentes, buscador integrado y comparación objetiva frente a frente consultando la API pública de **TheSportsDB**, con un diseño inspirado en álbumes futboleros de cromos deportivos (`#174D38` verde oscuro, `#F7F8F3` crema cálido y `#E8C75A` amarillo deportivo).

---

## 🎨 Identidad Visual y Estilo

- **Fondo:** Blanco cálido / crema (`#F7F8F3`).
- **Color Principal:** Verde Oscuro (`#174D38`).
- **Superficies Secundarias & Etiquetas:** Verde Suave (`#E4EFE6`).
- **Acentos:** Amarillo Deportivo (`#E8C75A` / `#C9A332`) y Rojo Suave para favoritos (`#E02424`).
- **Texto:** Neutro Oscuro (`#202B25`) y Secundario (`#5A6B62`).
- **Estética:** Cromos de colección deportiva, encuadre fotográfico completo (rostro y torso visibles sin cortes superiores con `resizeMode="contain"` y ~10 pt superior), posiciones cortas en español (*"Portero"*, *"Defensa"*, *"Mediocampista"*, *"Extremo"*, *"Delantero"*), y áreas táctiles cómodas (mínimo 44 × 44 pt).

---

## 🚀 Tecnologías Utilizadas

- **React Native + Expo SDK 57:** Desarrollo multiplataforma compatible con **Expo Go** y **Web**.
- **TypeScript:** Tipado estático riguroso para la API y la capa de datos.
- **Expo Router:** Navegación modular basada en archivos con exactamente 2 pestañas inferiores (**Inicio** y **Comparar**) y pantalla de detalle (`jugador/[id]`).
- **StyleSheet:** Estilos nativos optimizados para móvil y web.
- **Fetch API:** Consultas directas a los endpoints v1 de TheSportsDB.
- **AsyncStorage (`@react-native-async-storage/async-storage`):** Almacenamiento local persistente para los futbolistas favoritos en el dispositivo.
- **React Context:**
  - `ComparisonContext`: Estado en memoria para gestionar la comparación y modo selección entre pantallas.
  - `FavoritesContext`: Persistencia y sincronización inmediata de favoritos entre vistas.
  - `ToastContext`: Sistema nativo de avisos breves no bloqueantes, sustituyendo las alertas del navegador.
- **Caché en Memoria (`Map`) & Respaldo Editorial:** Almacenamiento local temporal y catálogo verificado de respaldo para mitigar límites de peticiones (Cloudflare 1015 / 429).

---

## 📂 Estructura del Proyecto

```
API-futbolitos/
├── src/
│   ├── app/
│   │   ├── _layout.tsx              # Stack raíz con ToastProvider, FavoritesProvider y ComparisonProvider
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx          # Barra inferior con 2 pestañas (Inicio y Comparar) con altura y paddings corregidos
│   │   │   ├── index.tsx            # Pestaña "Inicio": Catálogo/Favoritos, Filtros de posición, Buscador y bloques 6 en 6
│   │   │   ├── comparar.tsx         # Pestaña "Comparar": Comparador funcional frente a frente con avisos toast
│   │   │   └── buscar.tsx           # Redirección automática a Inicio (compatibilidad de rutas)
│   │   └── jugador/
│   │       └── [id].tsx             # Ficha individual dinámica con botón de favorito y acción Comparar
│   ├── components/
│   │   ├── AppToast.tsx             # Notificación flotante in-app con auto-cierre y diseño acorde al tema
│   │   ├── HeaderBanner.tsx         # Cabecera con marca "Futbolista", líneas de cancha y "Álbum futbolero"
│   │   ├── PlayerCard.tsx           # Tarjeta cromo con PlayerImage, botón de corazón táctil y botón Comparar
│   │   ├── PlayerImage.tsx          # Componente compartido con contain y margen superior de 10 pt
│   │   ├── PositionBadge.tsx        # Etiqueta visual de posición corta en español
│   │   ├── EducationalPositionCard.tsx # Explicación táctica del rol en el campo
│   │   ├── FallbackImage.tsx        # Silueta e iniciales ante ausencia de fotografía
│   │   ├── LoadingState.tsx         # Indicador de carga estilizado
│   │   └── ErrorState.tsx           # Estado de error con botón de reintento
│   ├── context/
│   │   ├── ComparisonContext.tsx    # Gestión de comparación, selección de slots y control de duplicados
│   │   ├── FavoritesContext.tsx     # Gestión y guardado persistente de favoritos con AsyncStorage
│   │   └── ToastContext.tsx         # Emisión de avisos breves flotantes (éxito, aviso, error)
│   ├── constants/
│   │   ├── theme.ts                 # Tokens del sistema de diseño (colores, sombras, espaciado)
│   │   └── featuredPlayers.ts       # Catálogo de 24 futbolistas verificados y datos editoriales de respaldo
│   ├── services/
│   │   └── footballApi.ts           # Cliente HTTP, consultas por bloques, caché y búsqueda
│   ├── types/
│   │   ├── player.ts                # Interfaces TypeScript de datos e API (Player, TheSportsDBPlayer)
│   │   └── declarations.d.ts        # Declaraciones de tipos auxiliares
│   └── utils/
│       └── playerData.ts            # Cálculo de edad exacta, normalizaciones estrictas y diferencias
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🏆 Catálogo Oficial de 24 Jugadores

El catálogo está compuesto por 24 futbolistas internacionales verificados con la API de TheSportsDB. Al entrar a Inicio sin filtros, los 6 destacados iniciales aparecen primero:

1. **Delanteros (6):**
   - Lionel Messi (`34146370`) *(Grupo inicial)*
   - Cristiano Ronaldo (`34146304`) *(Grupo inicial)*
   - Kylian Mbappé (`34162098`) *(Grupo inicial)*
   - Erling Haaland (`34169116`) *(Grupo inicial)*
   - Vinícius Júnior (`34161324`) *(Grupo inicial)*
   - Mohamed Salah (`34145506`)
2. **Porteros (6):**
   - Thibaut Courtois (`34145514`)
   - Alisson Becker (`34163551`)
   - Ederson Moraes (`34146911`)
   - Jan Oblak (`34159222`)
   - Emiliano Martínez (`34145423`)
   - Gianluigi Donnarumma (`34162303`)
3. **Defensas (6):**
   - Virgil van Dijk (`34147021`)
   - Rúben Dias (`34162490`)
   - Achraf Hakimi (`34161947`)
   - Trent Alexander-Arnold (`34161593`)
   - William Saliba (`34172293`)
   - Marquinhos (`34152561`)
4. **Mediocampistas (6):**
   - Jude Bellingham (`34171882`) *(Grupo inicial)*
   - Rodri (`34163415` - Rodrigo Hernández Cascante)
   - Kevin De Bruyne (`34155057`)
   - Federico Valverde (`34164200`)
   - Pedri (`34172243` - Pedro González López)
   - Bruno Fernandes (`34163007`)

---

## 📌 Funcionalidades Principales

### 1. Carga por Bloques de 6 en 6
- Al abrir Inicio se muestran los primeros 6 futbolistas.
- Al final de la lista, el botón **"Ver más futbolistas"** carga los siguientes 6 manteniendo los anteriores (progresión: 6 -> 12 -> 18 -> 24).
- Indicador visual claro: *"Mostrando 12 de 24"*.
- El botón se deshabilita y muestra un spinner pequeño durante la carga, y se oculta automáticamente al completar el grupo.

### 2. Filtros por Posición
- Botones de selección rápida bajo el buscador: `Todos · Porteros · Defensas · Mediocampistas · Delanteros`.
- El filtro activo se resalta con el verde principal (`#174D38`) y texto blanco.
- Aplica sobre el catálogo completo de 24 (o sobre los favoritos guardados).
- Al cambiar de filtro, se reinicia la vista mostrando los primeros 6 del grupo con su contador adaptado.

### 3. Favoritos Locales con AsyncStorage
- Selector compacto `Catálogo (24) | Favoritos (X)` integrado en Inicio (sin añadir pestañas adicionales).
- Icono de corazón interactivo en tarjetas y en la ficha de detalle (área táctil >= 44x44 pt).
- Guarda de manera persistente en el dispositivo; los favoritos permanecen al cerrar la app o recargar la página en web.
- Si no hay favoritos, muestra una pantalla orientativa con invitación a guardar.
- Los filtros por posición también aplican a los favoritos guardados.

### 4. Avisos Integrados en lugar de Alertas del Navegador
- Se eliminaron todos los `window.alert` y `Alert.alert` molestos.
- Avisos elegantes tipo Toast flotantes con fondo blanco o verde claro, bordes redondeados, sombra, icono representativo y botón de cierre (X).
- Desaparición automática tras 3.2 segundos.
- Ejemplos: *"Lionel Messi guardado en favoritos"*, *"Sergio Busquets añadido como Jugador 2"*, etc.

### 5. Correcciones Visuales
- **Buscador en Web:** Se eliminó el marco rectangular naranja predeterminado del navegador mediante `outlineStyle: 'none'`. Al enfocar, el contenedor redondeado completo muestra un sutil borde verde y sombra suave sin alterar dimensiones.
- **Barra de Navegación Inferior:** Se ajustó la altura (62 pt + safe area) y padding inferior para que los iconos y textos de *Inicio* y *Comparar* se vean completos, sin recortes inferiores en ningún dispositivo.
- **Desplazamiento Completo:** Margen inferior de 120 pt en el contenido para que la última fila de tarjetas y el botón "Ver más" se desplacen completamente por encima de la barra.

---

## 📋 Pasos para Demostrar las Nuevas Funciones

1. **Carga Progresiva (6 en 6):**
   - Entrar a Inicio: verificar que se muestran 6 tarjetas encabezadas por Messi, Cristiano, Mbappé, Haaland, Bellingham y Vinícius.
   - Pulsar *"Ver más futbolistas"*: se suman los siguientes 6 (12 de 24).
   - Pulsar dos veces más hasta completar los 24 (el botón se oculta).
2. **Filtros por Posición:**
   - Pulsar *"Porteros"*: se muestran los 6 arqueros (Courtois, Alisson, Ederson, Oblak, Dibu Martínez, Donnarumma).
   - Pulsar *"Defensas"*, *"Mediocampistas"* o *"Delanteros"*: verificar que cada categoría muestra sus 6 integrantes correspondientes.
3. **Favoritos Persistentes:**
   - Tocar el corazón de un par de futbolistas en las tarjetas: se muestra el aviso *"X guardado en favoritos"* y el corazón se tiñe de rojo.
   - Cambiar a la pestaña *"Favoritos"* en el selector: verificar que aparecen únicamente los futbolistas guardados.
   - Recargar la página web o reabrir la app: comprobar que los favoritos siguen intactos.
4. **Buscador Global:**
   - Escribir *"Luka Modric"* en el buscador y pulsar la lupa. Comprobar que los filtros se ocultan temporalmente y se muestra la tarjeta encontrada.
   - Guardar a Modric en favoritos con el corazón.
   - Limpiar la búsqueda y comprobar que en Favoritos aparece Modric junto con los demás guardados.
5. **Comparador Objetivo:**
   - En la pestaña Comparar, elegir a 2 jugadores y observar la tabla y el resumen de diferencias calculadas.

---

## 📲 Instrucciones de Ejecución

### Requisitos previos
- **Node.js** (versión 18 o superior) y **npm**.
- Terminal en el directorio del proyecto.

### 1. Iniciar en Dispositivo Móvil con Expo Go
```bash
npx expo start --go
```
- En **Android**: Abre la app **Expo Go** y escanea el código QR que se imprime en la terminal.
- En **iOS**: Abre la app de la **Cámara**, escanea el código QR y pulsa la notificación para abrirlo en Expo Go.

### 2. Iniciar y Probar en el Navegador Web
```bash
npx expo start --web
```
- Abre automáticamente `http://localhost:8081` en tu navegador predeterminado para probar los flujos directamente en pantalla.
