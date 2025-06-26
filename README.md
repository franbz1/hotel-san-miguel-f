# 🏨 Hotel San Miguel - Frontend del Sistema de Gestión Hotelera

**🚧 Proyecto en desarrollo activo 🚧**

Aplicación frontend desarrollada con Next.js 15, React 19 y TypeScript para la gestión integral de hoteles. El objetivo principal es permitir la administración completa de un hotel desde un solo vistazo: habitaciones, reservas, generación de formularios únicos, manejo de analíticas, gestión de huéspedes y control de aseo según normativas hoteleras.

Este proyecto es únicamente el **frontend** que consume la API del backend disponible en: [hotel-san-miguel](https://github.com/franbz1/hotel-san-miguel)

## 📋 Tabla de Contenidos

- [🚀 Características Principales](#-características-principales)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔧 Instalación y Configuración](#-instalación-y-configuración)
- [🎯 Módulos del Sistema](#-módulos-del-sistema)
- [👥 Sistema de Roles y Permisos](#-sistema-de-roles-y-permisos)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)


## 🚀 Características Principales

### ✨ Vista Unificada de Gestión Hotelera
Permite administrar todo el hotel desde una sola interfaz: visualizar habitaciones en tiempo real, gestionar reservas activas, controlar el estado del aseo y monitorear analíticas de rendimiento.

### 🏨 Gestión de Habitaciones y Reservas
Control completo del estado de habitaciones con sistemas de reservas que incluyen validaciones automáticas, asignación inteligente y seguimiento de ocupación.

### 👥 Administración de Huéspedes
Registro digital completo con formularios únicos generados por token, validación de documentos internacionales y gestión de acompañantes.

### 🧹 Control de Aseo según Normativas
Sistema especializado para cumplir con normativas hoteleras de limpieza, incluyendo programación automática, rotación de colchones y reportes de cumplimiento.

### 📊 Analíticas de Rendimiento
Dashboard con métricas clave del hotel, análisis de ingresos, reportes de ocupación y exportación de datos para toma de decisiones.

### 🔐 Sistema de Roles y Seguridad
Autenticación segura con diferentes niveles de acceso según el rol del usuario, protegiendo la información sensible del hotel.

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura moderna basada en:

- **Frontend**: Next.js 15 con App Router
- **Estado Global**: React Context + TanStack Query
- **Validación**: Zod schemas con React Hook Form  
- **Estilos**: Tailwind CSS + Radix UI
- **Gestión de Datos**: TanStack Query para cache y sincronización
- **Routing**: Next.js App Router con middleware de autenticación

## 📁 Estructura del Proyecto

```
hot-san-miguel-f/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── dashboard/                # Dashboard principal
│   │   │   ├── analytics/           # Módulo de analíticas
│   │   │   ├── huespedes/          # Gestión de huéspedes
│   │   │   ├── reservas/           # Gestión de reservas
│   │   │   └── configuraciones/    # Configuraciones del sistema
│   │   ├── aseo/                    # Módulo de aseo y limpieza
│   │   │   ├── habitaciones/       # Aseo de habitaciones
│   │   │   ├── zonas-comunes/      # Aseo de zonas comunes
│   │   │   └── reportes/          # Reportes de aseo
│   │   ├── login/                   # Autenticación
│   │   └── registro-formulario/     # Registro de huéspedes
│   ├── components/                  # Componentes reutilizables
│   │   ├── ui/                      # Componentes base (Radix UI)
│   │   ├── auth/                    # Componentes de autenticación
│   │   ├── dashboard/               # Componentes del dashboard
│   │   ├── aseo/                    # Componentes del módulo de aseo
│   │   ├── formulario/              # Formulario de registro
│   │   └── analytics/               # Componentes de analíticas
│   ├── hooks/                       # Custom hooks
│   │   ├── aseo/                    # Hooks del módulo de aseo
│   │   └── formulario/              # Hooks del formulario
│   ├── lib/                         # Servicios y utilidades
│   │   ├── aseo/                    # Servicios del módulo de aseo
│   │   ├── auth/                    # Servicios de autenticación
│   │   ├── analytics/               # Servicios de analíticas
│   │   └── common/                  # Utilidades comunes
│   ├── Types/                       # Definiciones de tipos TypeScript
│   │   ├── aseo/                    # Tipos del módulo de aseo
│   │   └── enums/                   # Enumeraciones del sistema
│   ├── contexts/                    # Contextos de React
│   └── middleware.ts                # Middleware de Next.js
├── docs/                            # Documentación del proyecto
├── public/                          # Archivos estáticos
└── components.json                  # Configuración de shadcn/ui
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- **Node.js** 18.x o superior
- **npm**, **yarn**, **pnpm** o **bun**
- **Base de datos** (PostgreSQL, MySQL o compatible)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/hot-san-miguel-f.git
cd hot-san-miguel-f
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

3. **Configurar la URL del backend**
```bash
# Crear archivo .env.local
cp .env.example .env.local
```

Configurar la URL del backend en el archivo `.env.local`:
```env
# URL del backend API (ajustar según tu configuración)
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Nota**: Asegúrate de tener el backend ejecutándose desde [hotel-san-miguel](https://github.com/franbz1/hotel-san-miguel)

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

### Scripts Disponibles

```bash
# Desarrollo con Turbopack
npm run dev

# Construcción para producción
npm run build

# Ejecutar versión de producción
npm run start

# Linting del código
npm run lint
```

## 🎯 Módulos del Sistema

### 📊 Dashboard Principal (`/dashboard`)
Centro de control unificado que ofrece una vista completa del estado del hotel. Permite acceder rápidamente a la gestión de habitaciones, reservas activas y métricas principales del negocio.

### 👥 Gestión de Huéspedes (`/dashboard/huespedes`)
Administración completa de la base de datos de clientes con funcionalidades de registro, validación de documentos internacionales, gestión de acompañantes y exportación de información.

### 🏨 Gestión de Reservas (`/dashboard/reservas`)
Control integral del ciclo de vida de las reservas, desde la creación hasta la finalización, incluyendo asignación de habitaciones, cálculo de costos y generación de formularios únicos por token.

### 🧹 Sistema de Aseo (`/aseo`)
Módulo especializado para cumplir con normativas hoteleras de limpieza que incluye:
- Programación automática de tareas de aseo
- Control de limpieza de habitaciones y zonas comunes
- Rotación programada de colchones
- Generación de reportes de cumplimiento
- Configuración de procedimientos y horarios

### 📈 Analíticas (`/dashboard/analytics`)
Dashboard de métricas de negocio con análisis de ingresos, reportes de ocupación, gráficos de tendencias y capacidad de exportación de datos para la toma de decisiones estratégicas.

### 📝 Formularios de Registro (`/registro-formulario/[token]`)
Interfaz especializada para el registro de huéspedes con proceso guiado paso a paso, validación en tiempo real y formularios únicos generados por token de reserva.

## 👥 Sistema de Roles y Permisos

### Roles Disponibles

#### 🔐 ADMINISTRADOR
- **Acceso completo** a todos los módulos
- **Gestión de configuraciones** del sistema
- **Analíticas avanzadas** y reportes
- **Gestión de usuarios** y permisos

#### 💼 CAJERO
- **Dashboard principal** con reservas y habitaciones
- **Gestión de huéspedes** y check-in/out
- **Acceso de solo lectura** a analíticas básicas
- **Sin acceso** al módulo de aseo

#### 🧹 ASEO
- **Módulo de aseo completo** con todas las funciones
- **Dashboard específico** de tareas de limpieza
- **Registro de actividades** y reportes
- **Sin acceso** a módulos administrativos

#### 📋 REGISTRO_FORMULARIO
- **Acceso limitado** solo a formularios de registro
- **Funcionalidad específica** para completar datos de reserva

### Protección de Rutas
- **Middleware automático** que valida permisos
- **Redirección inteligente** según rol del usuario
- **Tokens JWT seguros** con expiración automática

## 🛠️ Tecnologías Utilizadas

### Frontend Core
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript 5** - Tipado estático y seguridad

### Gestión de Estado
- **TanStack Query** - Cache y sincronización de datos
- **React Context** - Estado global de autenticación
- **React Hook Form** - Gestión de formularios

### UI y Estilos
- **Tailwind CSS 4** - Framework de utilidades CSS
- **Radix UI** - Componentes accesibles y primitivos
- **Lucide React** - Iconografía moderna
- **Recharts** - Gráficos y visualizaciones

### Validación y Tipos
- **Zod** - Validación de esquemas TypeScript
- **@hookform/resolvers** - Integración con React Hook Form

### Utilidades
- **date-fns** - Manipulación de fechas
- **js-cookie** - Gestión de cookies
- **xlsx** - Exportación a Excel
- **clsx + tailwind-merge** - Gestión de clases CSS

### Desarrollo
- **ESLint** - Linting de código
- **TypeScript** - Verificación de tipos
- **PostCSS** - Procesamiento de CSS

---

> Este sistema está diseñado específicamente para optimizar las operaciones hoteleras, mejorar la experiencia del huésped y proporcionar insights valiosos para la toma de decisiones estratégicas.
