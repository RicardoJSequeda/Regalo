# DetalleParaTi - Amor App

Una aplicación especial para guardar recuerdos con tu pareja, construida con React, Next.js y shadcn/ui.

## 🚀 Características

- **Interfaz moderna**: Diseño elegante usando componentes de shadcn/ui
- **Modo oscuro**: Cambio entre tema claro y oscuro
- **Responsive**: Funciona perfectamente en móviles y desktop
- **Animaciones**: Corazones flotantes y transiciones suaves
- **Secciones especiales**:
  - Inicio con vista general
  - Nuestros Recuerdos (fotos y momentos especiales)
  - Mensajes Especiales (palabras de amor)
  - Nuestra Música (canciones favoritas)
  - Sorpresa (mensaje especial)

## 🛠️ Tecnologías

- **React 18** con TypeScript
- **Next.js 14** con App Router
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes
- **Lucide React** para iconos

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura modular y escalable:

### 📁 Estructura de Carpetas

- **`src/features/`**: Módulos de funcionalidad (auth, dashboard)
- **`src/components/`**: Componentes reutilizables
  - **`ui/`**: Componentes de interfaz (shadcn/ui)
  - **`sections/`**: Secciones completas del dashboard
- **`src/hooks/`**: Hooks personalizados (useAuth, useDarkMode, etc.)
- **`src/types/`**: Definiciones de tipos TypeScript
- **`src/lib/`**: Funciones auxiliares con dependencias externas
- **`src/utils/`**: Funciones puras y constantes
- **`src/styles/`**: Estilos globales

### 🔧 Características de la Arquitectura

- **Feature-based**: Organización por funcionalidades
- **Hooks personalizados**: Lógica reutilizable
- **Tipos centralizados**: TypeScript bien tipado
- **Componentes modulares**: Fácil mantenimiento
- **Separación de responsabilidades**: UI, lógica y datos separados

## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## ⚙️ Configuración

### Cambiar la fecha de aniversario

En el archivo `src/utils/constants.ts`, línea 2, cambia la fecha:

```typescript
export const CORRECT_ANNIVERSARY_DATE = '2023-02-03' // Cambia esta fecha por tu fecha de aniversario
```

### Personalizar contenido

Puedes personalizar:
- **Recuerdos**: Edita el array `MEMORIES_DATA` en `src/utils/constants.ts`
- **Mensajes**: Modifica el array `LOVE_MESSAGES` en `src/utils/constants.ts`
- **Música**: Actualiza el array `SONGS_DATA` en `src/utils/constants.ts`
- **Sorpresa**: Cambia el contenido en `src/components/sections/SorpresaSection.tsx`

## 🎨 Personalización de colores

Los colores se pueden personalizar en `src/styles/globals.css` modificando las variables CSS:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Color principal */
  --secondary: 210 40% 96%; /* Color secundario */
  /* ... más variables */
}
```

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- **Móviles**: Sidebar colapsable con botón hamburguesa
- **Tablets**: Diseño adaptativo
- **Desktop**: Sidebar fijo y layout completo

## 🔧 Scripts disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Verificar código

## 📄 Licencia

Este proyecto es de uso personal. Hecho con ❤️ para expresar amor.

## 👨‍💻 Autor

**LuisKinnDC**
- GitHub: [https://github.com/LuisKinnDC](https://github.com/LuisKinnDC)
- Fecha: 26 de Febrero, 2024
- Versión: 1.0

---

💕 **DetalleParaTi** - Porque cada detalle cuenta cuando se trata de amor.
