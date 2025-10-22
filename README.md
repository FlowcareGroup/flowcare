# FlowCare

> Portal web de coordinación de citas médicas y teleasistencia para clínicas y centros de salud.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8+-orange.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Descripción

FlowCare es una plataforma web integral que permite a clínicas y centros de salud gestionar de manera eficiente:

- **Citas presenciales y virtuales** con disponibilidad en tiempo real
- **Historiales médicos** con integración FHIR
- **Teleconsultas** con video y chat seguro
- **Recordatorios automáticos** vía correo/SMS
- **Gestión de agendas médicas** para profesionales de la salud

### Sector

**HealthTech** - Solución de gestión clínica y teleasistencia

### Problema que resuelve

Muchos sistemas de salud actuales son fragmentados, generando duplicación de datos, errores de agenda y mala experiencia de usuario. FlowCare centraliza la gestión de citas, historiales y comunicación paciente-médico en una única plataforma segura e interoperable.

---

## � Cambios Recientes (Octubre 2025)

### ✨ Nuevas Funcionalidades

#### 🎯 Edición de Citas

- ✅ **Botón "Editar"** en página de detalles de cita
- ✅ **Modal de edición** con selector de fecha/hora
- ✅ **Validación de slots** disponibles
- ✅ **Auto-refresco** de datos post-guardar

#### 🎨 Mejora de Navegación

- ✅ **Tarjeta clickeable** en calendario de citas
- ✅ **Efectos visuales** mejorados (hover states)
- ✅ **UX optimizada** para acceso a detalles
- ✅ **Separación de acciones** (ver vs cancelar)

### 📚 Documentación Nueva

- `QUICK_REFERENCE_EDIT_CITAS.md` - Guía rápida ⭐ **EMPIEZA AQUÍ**\n- `BEFORE_AFTER_COMPARISON.md` - Comparación visual\n- `IMPLEMENTATION_EDIT_FLOW.md` - Flujo técnico completo\n- `TESTING_APPOINTMENT_EDIT.md` - Guía de testing\n- `IMPLEMENTATION_SUMMARY_EDIT_CITAS.md` - Resumen ejecutivo\n\n### 🔧 Cambios Técnicos\n- Importación de `AppointmentEditModal` en página de detalles\n- Nuevo estado `editingAppointment` para control de modal\n- Integración de `updateAppointmentTime` service\n- Refactor de tarjetas de cita para mejor UX\n\n👉 **Ver `QUICK_REFERENCE_EDIT_CITAS.md` para más detalles**\n\n---\n\n## �🚀 Inicio rápido

### Requisitos previos

- **Node.js** >= 22.0.0
- **pnpm** >= 8.0.0
- **Docker** y Docker Compose
- **Git**

### 1. Instalación de pnpm

Si no tienes pnpm instalado:

```bash
npm install -g pnpm
```

O usando Corepack (recomendado):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### 2. Clonar y configurar el proyecto

```bash
# Clonar el repositorio
git clone <repository-url>
cd FlowCare

# Instalar todas las dependencias
pnpm install

# Levantar la base de datos PostgreSQL
pnpm docker:up

# Generar el cliente de Prisma
pnpm prisma:generate

# Sincronizar el esquema con la base de datos
pnpm prisma:push
```

### 3. Iniciar el proyecto

```bash
# Iniciar backend y frontend simultáneamente
pnpm dev
```

Accede a:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Prisma Studio:** Ejecuta `pnpm prisma:studio`

---

## 📦 Gestión de dependencias

### Instalar dependencias en workspaces específicos

```bash
# Backend
pnpm --filter backend add <paquete>
pnpm --filter backend add -D <paquete-dev>

# Frontend
pnpm --filter frontend add <paquete>
pnpm --filter frontend add -D <paquete-dev>

# Raíz (herramientas compartidas)
pnpm add -D -w <paquete>
```

### Ejemplos

```bash
# Añadir express-validator al backend
pnpm --filter backend add express-validator

# Añadir axios al frontend
pnpm --filter frontend add axios

# Añadir prettier como herramienta global del monorepo
pnpm add -D -w prettier
```

### Actualizar dependencias

```bash
# Ver dependencias desactualizadas
pnpm outdated

# Actualizar todas las dependencias
pnpm update

# Actualizar dependencias de un workspace específico
pnpm --filter backend update
```

---

## 🛠️ Scripts disponibles

### Desarrollo

| Script              | Descripción                                  |
| ------------------- | -------------------------------------------- |
| `pnpm dev`          | Inicia backend y frontend simultáneamente    |
| `pnpm dev:backend`  | Solo backend (Express en puerto 4000)        |
| `pnpm dev:frontend` | Solo frontend (Next.js en puerto 3000)       |
| `pnpm build`        | Construye backend y frontend para producción |

### Base de datos

| Script                 | Descripción                                |
| ---------------------- | ------------------------------------------ |
| `pnpm prisma:generate` | Genera el cliente de Prisma                |
| `pnpm prisma:push`     | Sincroniza el esquema con la base de datos |
| `pnpm prisma:studio`   | Abre Prisma Studio (GUI para la BD)        |

### Docker

| Script             | Descripción                  |
| ------------------ | ---------------------------- |
| `pnpm docker:up`   | Levanta PostgreSQL en Docker |
| `pnpm docker:down` | Detiene los contenedores     |

### Utilidades

| Script             | Descripción                      |
| ------------------ | -------------------------------- |
| `pnpm clean`       | Elimina todos los node_modules   |
| `pnpm install:all` | Reinstala todas las dependencias |

---

## 📁 Estructura del proyecto

```
FlowCare/
├── backend/                    # API REST con Express + Prisma
│   ├── prisma/
│   │   └── schema.prisma      # Esquema de base de datos
│   ├── generated/             # Cliente Prisma generado
│   ├── index.js               # Punto de entrada del servidor
│   ├── package.json
│   └── README.md
│
├── frontend/                   # Aplicación Next.js con React 19
│   ├── src/
│   │   ├── app/               # App Router de Next.js
│   │   ├── components/        # Componentes reutilizables
│   │   └── lib/               # Utilidades y configuración
│   ├── public/                # Archivos estáticos
│   ├── package.json
│   └── README.md
│
├── .env                        # Variables de entorno (no commitear)
├── .gitignore
├── .npmrc                      # Configuración de pnpm
├── docker-compose.yml          # Configuración de PostgreSQL
├── pnpm-workspace.yaml         # Definición de workspaces
├── package.json                # Scripts del monorepo
└── README.md
```

---

## 🌿 Convenciones de Git

### Sistema de ramas

```
main              # Producción - código estable
├── develop       # Desarrollo - integración continua
│   ├── feature/* # Nuevas funcionalidades
│   ├── fix/*     # Correcciones de bugs
│   └── refactor/*# Refactorización de código
└── hotfix/*      # Correcciones urgentes en producción
```

### Nomenclatura de ramas

```bash
feature/nombre-descriptivo    # Nueva funcionalidad
fix/descripcion-del-bug       # Corrección de bug
refactor/area-refactorizada   # Refactorización
hotfix/problema-critico       # Corrección urgente
```

**Ejemplos:**

```bash
feature/patient-registration
fix/appointment-timezone-bug
refactor/auth-middleware
hotfix/database-connection-pool
```

### Mensajes de commit (Conventional Commits)

Seguimos el estándar [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<scope>): <descripción corta>

[cuerpo opcional]

[footer opcional]
```

#### Tipos de commit

| Tipo       | Descripción                     | Ejemplo                                          |
| ---------- | ------------------------------- | ------------------------------------------------ |
| `feat`     | Nueva funcionalidad             | `feat(appointments): add video call integration` |
| `fix`      | Corrección de bug               | `fix(auth): resolve token expiration issue`      |
| `docs`     | Documentación                   | `docs(readme): update installation steps`        |
| `style`    | Formato (sin cambios de código) | `style(frontend): apply prettier formatting`     |
| `refactor` | Refactorización                 | `refactor(api): simplify user service logic`     |
| `perf`     | Mejora de rendimiento           | `perf(db): add index to appointments table`      |
| `test`     | Tests                           | `test(auth): add unit tests for login`           |
| `chore`    | Mantenimiento                   | `chore(deps): update prisma to v5.1.0`           |
| `ci`       | Integración continua            | `ci(github): add automated testing workflow`     |

#### Scopes comunes

- `appointments` - Sistema de citas
- `auth` - Autenticación y autorización
- `patients` - Gestión de pacientes
- `doctors` - Gestión de médicos
- `telehealth` - Teleconsultas
- `notifications` - Recordatorios y notificaciones
- `ehr` - Integración con historiales clínicos
- `api` - Backend general
- `ui` - Frontend general
- `db` - Base de datos

#### Ejemplos de commits

```bash
feat(appointments): implement real-time availability calendar
fix(telehealth): resolve WebRTC connection timeout
docs(api): add swagger documentation for endpoints
refactor(auth): migrate to JWT-based authentication
perf(db): optimize query for patient search
test(notifications): add integration tests for SMS service
chore(deps): update Next.js to v15.5.4
```

### Flujo de trabajo Git

```bash
# 1. Crear una nueva rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/patient-dashboard

# 2. Hacer commits siguiendo las convenciones
git add .
git commit -m "feat(patients): add dashboard with appointment history"

# 3. Push y crear Pull Request
git push origin feature/patient-dashboard

# 4. Después de aprobación, merge a develop
# (Se hace desde la interfaz de GitHub/GitLab)
```

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://developer:password123@localhost:5432/flowcare_dev"

# Backend
NODE_ENV=development
PORT=4000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# (Añadir más según sea necesario)
# JWT_SECRET=tu-secreto-jwt
# SMTP_HOST=smtp.gmail.com
# TWILIO_ACCOUNT_SID=tu-sid
```

⚠️ **Nunca commitees el archivo `.env`** - Usa `.env.example` como plantilla.

---

## 🧪 Testing

```bash
# Ejecutar tests del backend
pnpm --filter backend test

# Ejecutar tests del frontend
pnpm --filter frontend test

# Tests con coverage
pnpm --filter backend test:coverage
```

---

## 🏗️ Stack tecnológico

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express 5
- **ORM:** Prisma 5
- **Base de datos:** PostgreSQL 16
- **Autenticación:** JWT (a implementar)

### Frontend

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Lenguaje:** TypeScript 5
- **Estilos:** TailwindCSS 4
- **Linting:** ESLint 9

### DevOps

- **Monorepo:** pnpm workspaces
- **Containerización:** Docker & Docker Compose
- **Control de versiones:** Git

---

## 🎯 Funcionalidades planificadas

### Must-have (MVP)

- ✅ Configuración del monorepo
- ✅ Base de datos PostgreSQL
- ✅ Esquema inicial de Prisma
- ⬜ Registro y autenticación de pacientes
- ⬜ Gestión de citas con disponibilidad en tiempo real
- ⬜ Recordatorios automáticos vía correo/SMS
- ⬜ Teleconsulta con video y chat seguro
- ⬜ Integración con sistemas EHR (FHIR)

### Nice-to-have (Futuro)

- ⬜ Algoritmo de asignación de citas según prioridad médica
- ⬜ Módulo de facturación automática
- ⬜ Panel de gestión de listas de espera
- ⬜ Análisis predictivo de cancelaciones

---

## 🐛 Troubleshooting

### Error: "pnpm: command not found"

```bash
npm install -g pnpm
```

### Error al conectar con PostgreSQL

```bash
# Verificar que Docker esté corriendo
docker ps

# Reiniciar contenedor
pnpm docker:down
pnpm docker:up
```

### Prisma no genera el cliente

```bash
# Desde la raíz del proyecto
pnpm prisma:generate
```

### Puerto 3000 o 4000 ya en uso

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios siguiendo las convenciones (`git commit -m 'feat(scope): descripción'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📞 Contacto

Para preguntas o sugerencias, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para mejorar la gestión de salud**
