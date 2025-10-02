# FlowCare Backend

> API REST para la gestión de citas médicas, historiales clínicos y teleasistencia.

## 📋 Descripción

Backend del sistema FlowCare construido con Express y Prisma. Proporciona endpoints para:

- **Autenticación y autorización** de pacientes y profesionales médicos
- **Gestión de citas** con disponibilidad en tiempo real
- **Historiales médicos** con integración FHIR
- **Teleconsultas** (WebRTC/Zoom)
- **Notificaciones** (email/SMS)
- **Integración con sistemas EHR**

---

## 🚀 Inicio rápido

### Desde la raíz del monorepo (recomendado)

```bash
# Instalar dependencias
pnpm install

# Levantar PostgreSQL
pnpm docker:up

# Generar cliente Prisma
pnpm prisma:generate

# Sincronizar esquema
pnpm prisma:push

# Iniciar backend
pnpm dev:backend
```

### Desarrollo solo del backend

```bash
# Desde la raíz
pnpm --filter backend dev

# O desde /backend (solo si ya instalaste desde la raíz)
cd backend
pnpm dev
```

El servidor estará disponible en: **http://localhost:4000**

---

## 📁 Estructura del proyecto

```
backend/
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── generated/
│   └── prisma/                # Cliente Prisma generado
├── src/                       # (A crear)
│   ├── routes/                # Rutas de la API
│   ├── controllers/           # Lógica de negocio
│   ├── middleware/            # Middlewares (auth, validación)
│   ├── services/              # Servicios (email, SMS, EHR)
│   ├── utils/                 # Utilidades
│   └── config/                # Configuración
├── index.js                   # Punto de entrada
├── .env                       # Variables de entorno (no commitear)
├── package.json
└── README.md
```

---

## 🗄️ Base