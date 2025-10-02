# Agent Instructions - FlowCare

> Contexto del proyecto para asistentes de IA y herramientas de desarrollo automatizado.

## 🎯 Propósito del proyecto

FlowCare es un **portal web de coordinación de citas médicas y teleasistencia** para clínicas y centros de salud.

**Sector:** HealthTech  
**Tipo:** Monorepo web app (Backend + Frontend)

### Problema que resuelve
Sistemas de salud fragmentados que generan duplicación de datos, errores de agenda y mala experiencia de usuario.

### Funcionalidades clave
- Gestión de citas presenciales y virtuales con disponibilidad en tiempo real
- Historiales médicos con integración FHIR
- Teleconsultas con video y chat seguro
- Recordatorios automáticos (email/SMS)
- Panel de administración para médicos

---

## 🏗️ Arquitectura del proyecto

### Stack tecnológico

**Backend:**
- Node.js 22+ con Express 5
- Prisma 5 como ORM
- PostgreSQL 16 en Docker
- Autenticación JWT (a implementar)

**Frontend:**
- Next.js 15 (App Router)
- React 19 con TypeScript 5
- TailwindCSS 4 para estilos
- ESLint 9 para linting

**Monorepo:**
- pnpm workspaces
- Estructura: `/backend` y `/frontend`

### Estructura de directorios

```
FlowCare/
├── backend/
│   ├── prisma/schema.prisma    # Modelos de base de datos
│   ├── generated/prisma/       # Cliente Prisma (generado)
│   ├── index.js                # Entry point
│   └── package.json
├── frontend/
│   ├── src/app/                # App Router de Next.js
│   ├── src/components/         # Componentes React
│   ├── src/lib/                # Utilidades
│   └── package.json
├── .env                        # Variables de entorno
├── docker-compose.yml          # PostgreSQL
├── pnpm-workspace.yaml         # Configuración de workspaces
└── package.json                # Scripts del monorepo
```

---

## 📝 Convenciones de código

### Commits (Conventional Commits)

**Formato:** `<tipo>(<scope>): <descripción>`

**Tipos:**
- `feat` - Nueva funcionalidad
- `fix` - Corrección de bug
- `docs` - Documentación
- `refactor` - Refactorización
- `perf` - Mejora de rendimiento
- `test` - Tests
- `chore` - Mantenimiento

**Scopes comunes:**
- `appointments` - Sistema de citas
- `auth` - Autenticación
- `patients` - Gestión de pacientes
- `doctors` - Gestión de médicos
- `telehealth` - Teleconsultas
- `notifications` - Notificaciones
- `ehr` - Integración EHR
- `api` - Backend general
- `ui` - Frontend general
- `db` - Base de datos

**Ejemplos:**
```
feat(appointments): add real-time availability calendar
fix(auth): resolve token expiration issue
docs(readme): update installation steps
refactor(api): simplify user service logic
```

### Ramas

**Estructura:**
```
main                    # Producción
├── develop             # Desarrollo
│   ├── feature/*       # Nuevas funcionalidades
│   ├── fix/*           # Correcciones
│   └── refactor/*      # Refactorización
└── hotfix/*            # Correcciones urgentes
```

**Nomenclatura:**
- `feature/patient-registration`
- `fix/appointment-timezone-bug`
- `refactor/auth-middleware`
- `hotfix/database-connection`

### Estilo de código

**Backend (JavaScript/Node.js):**
- Usar `const` por defecto, `let` solo si es necesario
- Funciones async/await en lugar de callbacks
- Manejo de errores con try/catch
- Nombres descriptivos en camelCase

**Frontend (TypeScript/React):**
- Componentes funcionales con hooks
- Props tipadas con TypeScript
- Nombres de componentes en PascalCase
- Archivos de componentes: `ComponentName.tsx`
- Preferir TailwindCSS para estilos

---

## 🔧 Comandos importantes

### Instalación y configuración inicial
```bash
pnpm install                # Instalar dependencias
pnpm docker:up              # Levantar PostgreSQL
pnpm prisma:generate        # Generar cliente Prisma
pnpm prisma:push            # Sincronizar esquema con BD
```

### Desarrollo
```bash
pnpm dev                    # Backend + Frontend
pnpm dev:backend            # Solo backend (puerto 4000)
pnpm dev:frontend           # Solo frontend (puerto 3000)
```

### Base de datos
```bash
pnpm prisma:studio          # GUI para la base de datos
pnpm prisma:generate        # Regenerar cliente después de cambios
pnpm prisma:push            # Aplicar cambios al esquema
```

### Gestión de dependencias
```bash
# Backend
pnpm --filter backend add <paquete>

# Frontend
pnpm --filter frontend add <paquete>

# Global (monorepo)
pnpm add -D -w <paquete>
```

---

## 🎯 Prioridades de desarrollo (MVP)

### ✅ Completado
- [x] Configuración del monorepo con pnpm
- [x] Base de datos PostgreSQL en Docker
- [x] Esquema inicial de Prisma

### ⬜ Pendiente (Must-have)
- [ ] Sistema de autenticación (JWT + bcrypt)
- [ ] CRUD de pacientes
- [ ] CRUD de médicos
- [ ] Sistema de citas con disponibilidad
- [ ] Recordatorios automáticos (email/SMS)
- [ ] Teleconsulta (WebRTC o integración Zoom)
- [ ] Integración FHIR para historiales

### 🔮 Futuro (Nice-to-have)
- [ ] Algoritmo de asignación de citas por prioridad
- [ ] Módulo de facturación
- [ ] Gestión de listas de espera
- [ ] Análisis predictivo de cancelaciones

---

## 🚨 Reglas importantes para agentes de IA

### Al generar código:

1. **Siempre usar pnpm**, nunca npm o yarn
2. **Instalar dependencias desde la raíz** del monorepo
3. **Usar `--filter`** para comandos específicos de workspace
4. **Regenerar Prisma** después de cambios en `schema.prisma`
5. **Seguir Conventional Commits** en todos los mensajes
6. **TypeScript en frontend**, JavaScript en backend (por ahora)
7. **Validar entrada** en todos los endpoints de la API
8. **Manejo de errores** consistente con try/catch
9. **No hardcodear** credenciales o secrets
10. **Documentar** funciones complejas con JSDoc

### Al modificar la base de datos:

1. Editar `backend/prisma/schema.prisma`
2. Ejecutar `pnpm prisma:generate`
3. Ejecutar `pnpm prisma:push` (dev) o crear migración (prod)
4. Verificar cambios en Prisma Studio

### Al añadir rutas de API:

1. Crear en `backend/src/routes/`
2. Importar en `index.js`
3. Usar middlewares de validación
4. Documentar endpoint (método, ruta, body, respuesta)

### Al crear componentes de UI:

1. Crear en `frontend/src/components/`
2. Usar TypeScript con props tipadas
3. Aplicar TailwindCSS para estilos
4. Componentes pequeños y reutilizables
5. Nombres descriptivos en PascalCase

---

## 🔐 Variables de entorno

### Backend (.env)
```env
DATABASE_URL="postgresql://developer:password123@localhost:5432/flowcare_dev"
NODE_ENV=development
PORT=4000
JWT_SECRET=tu-secreto-jwt-seguro
JWT_EXPIRES_IN=7d
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## ✅ Checklist antes de hacer commit

- [ ] El código compila sin errores
- [ ] Seguí las convenciones de código
- [ ] Añadí validación de entrada (si aplica)
- [ ] Manejé errores apropiadamente
- [ ] Actualicé documentación (si aplica)
- [ ] El mensaje de commit sigue Conventional Commits
- [ ] No incluí credenciales o secrets
- [ ] Probé localmente la funcionalidad

---

**Última actualización:** 2025-10-02  
**Versión del proyecto:** 1.0.0 (MVP en desarrollo)
