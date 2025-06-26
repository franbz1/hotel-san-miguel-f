# 🏨 Hotel San Miguel - Sistema de Gestión Hotelera

Sistema integral de gestión hotelera desarrollado con Next.js 15, React 19 y TypeScript. Diseñado específicamente para el Hotel San Miguel, incluye módulos completos de reservas, gestión de huéspedes, sistema de aseo y analíticas avanzadas.

## 📋 Tabla de Contenidos

- [🚀 Características Principales](#-características-principales)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔧 Instalación y Configuración](#-instalación-y-configuración)
- [🎯 Módulos del Sistema](#-módulos-del-sistema)
- [👥 Sistema de Roles y Permisos](#-sistema-de-roles-y-permisos)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📊 Base de Datos](#-base-de-datos)
- [🔐 Seguridad](#-seguridad)
- [📈 Analytics y Reportes](#-analytics-y-reportes)
- [🧪 Testing](#-testing)
- [🚀 Despliegue](#-despliegue)

## 🚀 Características Principales

### ✨ Gestión Integral de Reservas
- **Dashboard administrativo** con vista en tiempo real
- **Sistema de reservas avanzado** con validaciones automáticas
- **Gestión de habitaciones** con estados dinámicos
- **Control de ocupación** y disponibilidad

### 👤 Gestión de Huéspedes
- **Registro digital de huéspedes** con formularios paso a paso
- **Base de datos de clientes** con historial completo
- **Validación de documentos** internacionales
- **Soporte para huéspedes secundarios** y acompañantes

### 🧹 Sistema de Aseo y Mantenimiento
- **Gestión de limpieza de habitaciones** con programación automática
- **Control de zonas comunes** y áreas especiales
- **Rotación programada de colchones** con alertas preventivas
- **Reportes diarios de aseo** con métricas de rendimiento
- **Configuración flexible** de procedimientos y horarios

### 📊 Analíticas y Reportes
- **Dashboard de métricas** en tiempo real
- **Análisis de ingresos** por períodos personalizables
- **Reportes de ocupación** y tendencias
- **Exportación a Excel** de datos detallados
- **Gráficos interactivos** con Recharts

### 🔐 Sistema de Autenticación y Permisos
- **Autenticación basada en JWT** con cookies seguras
- **Control de acceso por roles** (Administrador, Cajero, Aseo)
- **Middleware de protección** de rutas
- **Gestión de sesiones** con expiración automática

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

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local
cp .env.example .env.local
```

Configurar las siguientes variables:
```env
# URL del backend API
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Configuración de cookies
NEXT_PUBLIC_COOKIE_DOMAIN=localhost

# Otras configuraciones necesarias
```

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

### 1. 📊 Dashboard Principal
**Ubicación**: `/dashboard`

- **Vista general** del estado del hotel
- **Gestión de habitaciones** con estados en tiempo real
- **Panel de reservas** con filtros avanzados
- **Acceso rápido** a todas las funcionalidades

### 2. 👥 Gestión de Huéspedes
**Ubicación**: `/dashboard/huespedes`

- **Registro completo** de información personal
- **Validación de documentos** (CC, CE, Pasaporte, PPT, PEP, DNI)
- **Gestión de acompañantes** con datos individuales
- **Historial de reservas** por huésped
- **Exportación de datos** a Excel

### 3. 🏨 Gestión de Reservas
**Ubicación**: `/dashboard/reservas`

- **Estados de reserva**: Reservado, Cancelado, Finalizado, Pendiente
- **Asignación automática** de habitaciones
- **Cálculo de costos** dinámico
- **Gestión de fechas** con validaciones
- **Formularios de registro** con tokens únicos

### 4. 🧹 Sistema de Aseo
**Ubicación**: `/aseo`

#### Características principales:
- **Gestión de habitaciones para aseo**
  - Programación automática según checkout
  - Control de tipos de aseo (Limpieza, Desinfección, Rotación de colchones)
  - Estados específicos (En limpieza, En desinfección)

- **Zonas comunes**
  - Registro de limpieza de áreas públicas
  - Programación de mantenimiento
  - Control de productos utilizados

- **Reportes automatizados**
  - Generación diaria de reportes
  - Métricas de productividad
  - Seguimiento de cumplimiento

- **Configuración flexible**
  - Horarios de aseo personalizables
  - Elementos de trabajo configurables
  - Procedimientos estándar definibles

### 5. 📈 Analíticas Avanzadas
**Ubicación**: `/dashboard/analytics`

- **Análisis de ingresos** por períodos
- **Métricas de ocupación** y rendimiento
- **Gráficos interactivos** de tendencias
- **Exportación completa** de datos
- **Filtros personalizables** de fecha

### 6. 📝 Formulario de Registro
**Ubicación**: `/registro-formulario/[token]`

- **Proceso paso a paso** guiado
- **Validación en tiempo real** con Zod
- **Soporte multiidioma** para documentos
- **Guardado automático** de progreso
- **Interfaz responsive** optimizada

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

## 📊 Base de Datos

### Entidades Principales

#### Huéspedes
- Información personal completa
- Documentos de identificación
- Datos de contacto y residencia
- Historial de reservas

#### Reservas
- Fechas de estadía
- Habitaciones asignadas
- Estados y costos
- Información de facturación

#### Habitaciones
- Números y tipos
- Estados de ocupación
- Historial de aseo
- Configuraciones específicas

#### Aseo
- Registros de limpieza
- Tipos de aseo realizados
- Personal asignado
- Tiempos y productos utilizados

#### Configuraciones
- Parámetros del sistema
- Horarios y frecuencias
- Elementos de trabajo
- Procedimientos estándar

## 🔐 Seguridad

### Autenticación
- **JWT tokens** almacenados en cookies httpOnly
- **Validación automática** en cada solicitud
- **Expiración configurable** de sesiones
- **Refresh token** automático

### Autorización
- **Control granular** por rutas y funciones
- **Middleware de verificación** en tiempo real
- **Roles jerárquicos** con herencia de permisos
- **Protección CSRF** automática

### Validación de Datos
- **Schemas Zod** en frontend y backend
- **Sanitización automática** de inputs
- **Validación de tipos** TypeScript
- **Rate limiting** en endpoints sensibles

## 📈 Analytics y Reportes

### Métricas Disponibles
- **Ingresos totales** por período
- **Ocupación promedio** y picos
- **Análisis de temporadas** altas y bajas
- **Rendimiento por habitación**
- **Eficiencia del personal de aseo**

### Exportación de Datos
- **Excel completo** con datos detallados
- **Filtros personalizables** por fecha
- **Múltiples hojas** organizadas por tipo
- **Formateo automático** de monedas y fechas

### Visualizaciones
- **Gráficos de barras** para ingresos mensuales
- **Líneas de tendencia** para ocupación
- **Métricas KPI** en tiempo real
- **Comparativas** entre períodos

## 🧪 Testing

### Estructura de Testing
```bash
# Ejecutar todos los tests
npm run test

# Tests en modo watch
npm run test:watch

# Coverage de tests
npm run test:coverage
```

### Tipos de Tests
- **Unit tests** para funciones puras
- **Integration tests** para hooks y servicios
- **Component tests** para UI components
- **E2E tests** para flujos completos

## 🚀 Despliegue

### Preparación para Producción
```bash
# Construir la aplicación
npm run build

# Verificar la construcción
npm run start
```

### Variables de Entorno de Producción
```env
# API URL de producción
NEXT_PUBLIC_API_URL=https://api.hotelsanmiguel.com

# Dominio de cookies
NEXT_PUBLIC_COOKIE_DOMAIN=hotelsanmiguel.com

# Configuraciones de seguridad
NEXT_PUBLIC_SECURE_COOKIES=true
```

### Plataformas Recomendadas
- **Vercel** - Despliegue automático optimizado para Next.js
- **Netlify** - Alternativa con excelente CI/CD
- **Railway** - Para aplicaciones full-stack
- **AWS/Azure** - Para infraestructura empresarial

## 📞 Soporte y Contribución

### Contacto
- **Email**: soporte@hotelsanmiguel.com
- **Teléfono**: +57 (XXX) XXX-XXXX

### Contribuir al Proyecto
1. Fork del repositorio
2. Crear una rama para la funcionalidad
3. Implementar cambios con tests
4. Crear Pull Request con descripción detallada

### Reporte de Bugs
Utilizar el sistema de Issues de GitHub con:
- Descripción detallada del problema
- Pasos para reproducir
- Screenshots si es necesario
- Información del navegador/sistema

---

**Desarrollado con ❤️ para Hotel San Miguel**

> Este sistema está diseñado específicamente para optimizar las operaciones hoteleras, mejorar la experiencia del huésped y proporcionar insights valiosos para la toma de decisiones estratégicas.
