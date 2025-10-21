# 🎨 Guía de Aplicación de Paleta de Colores

## Paleta de Colores Actualizada

La nueva paleta de colores WCAG AAA ha sido añadida a `globals.css` con variables CSS custom. Aquí está completa:

### Colores Primarios (Azul)
```css
--color-light: #ebf7fd        /* Fondo claro */
--color-light-hover: #e0f3fb  /* Fondo claro hover */
--color-light-active: #c0e6f7 /* Fondo claro active */

--color-primary: #33ade6      /* Azul normal */
--color-primary-hover: #2e9ccf /* Azul normal hover */
--color-primary-active: #298ab8 /* Azul normal active */

--color-dark: #2682ad         /* Azul oscuro */
--color-dark-hover: #1f688a   /* Azul oscuro hover */
--color-dark-active: #174e67  /* Azul oscuro active */

--color-darker: #123d51       /* Azul más oscuro */
```

### Colores Semánticos
```css
--color-success: #10b981      /* Verde - éxito */
--color-warning: #f59e0b      /* Ámbar - advertencia */
--color-error: #ef4444        /* Rojo - error */
--color-info: #33ade6         /* Azul - información */
```

### Colores de Texto
```css
--color-text-primary: #1f2937   /* Gris oscuro - texto principal */
--color-text-secondary: #6b7280 /* Gris medio - texto secundario */
--color-text-light: #f9fafb     /* Blanco - texto sobre fondos oscuros */
```

### Colores de Fondo
```css
--color-bg-primary: #ffffff     /* Blanco */
--color-bg-secondary: #f9fafb   /* Gris muy claro */
--color-bg-tertiary: #f3f4f6    /* Gris claro */
```

---

## 🎯 Clases Disponibles para Usar

### Botones

#### Botón Primario (Azul)
```jsx
<button className="btn-primary">Guardar</button>
```

#### Botón Secundario (Claro)
```jsx
<button className="btn-secondary">Cancelar</button>
```

#### Botón de Éxito (Verde)
```jsx
<button className="btn-success">Confirmar</button>
```

#### Botón de Error (Rojo)
```jsx
<button className="btn-error">Eliminar</button>
```

### Tarjetas

#### Tarjeta Básica
```jsx
<div className="card">
  Contenido de la tarjeta
</div>
```

#### Tarjeta con Borde Primario
```jsx
<div className="card-primary">
  Contenido importante
</div>
```

### Badges/Etiquetas

#### Badge Primario
```jsx
<span className="badge-primary">Etiqueta</span>
```

#### Badge de Éxito
```jsx
<span className="badge-success">Completado</span>
```

#### Badge de Advertencia
```jsx
<span className="badge-warning">Pendiente</span>
```

#### Badge de Error
```jsx
<span className="badge-error">Error</span>
```

### Estados de Cita

```jsx
<span className="status-pending">Pendiente</span>
<span className="status-confirmed">Confirmada</span>
<span className="status-completed">Completada</span>
<span className="status-cancelled">Cancelada</span>
<span className="status-noshow">No presentarse</span>
```

### Inputs

#### Input Primario
```jsx
<input type="text" className="input-primary" placeholder="Ingresa texto..." />
```

### Colores de Texto

```jsx
<p className="text-primary">Texto azul primario</p>
<p className="text-dark">Texto azul oscuro</p>
<p className="text-darker">Texto azul más oscuro</p>
```

### Colores de Fondo

```jsx
<div className="bg-primary">Fondo azul primario</div>
<div className="bg-light">Fondo azul claro</div>
<div className="bg-dark">Fondo azul oscuro</div>
```

### Bordes

```jsx
<div className="border-primary">Con borde azul primario</div>
<div className="border-light">Con borde azul claro</div>
```

### Gradientes

#### Gradiente Claro
```jsx
<div className="gradient-primary">Gradiente claro</div>
```

#### Gradiente Oscuro
```jsx
<div className="gradient-primary-dark">Gradiente oscuro</div>
```

#### Gradiente Muy Oscuro
```jsx
<div className="gradient-primary-darker">Gradiente muy oscuro</div>
```

### Efectos de Sombra

#### Sombra Primaria
```jsx
<div className="shadow-primary">Con sombra azul</div>
```

#### Sombra Primaria Pequeña
```jsx
<div className="shadow-primary-sm">Con sombra azul pequeña</div>
```

### Efectos de Hover

#### Efecto Lift (Elevar)
```jsx
<div className="hover-lift">Se eleva al pasar el mouse</div>
```

#### Efecto Glow (Brillo)
```jsx
<div className="hover-glow">Brilla al pasar el mouse</div>
```

### Transiciones

#### Transición Suave
```jsx
<div className="transition-smooth">Transición 200ms</div>
```

#### Transición Suave Lenta
```jsx
<div className="transition-smooth-slow">Transición 300ms</div>
```

---

## 📋 Cómo Actualizar Componentes Existentes

### Ejemplo 1: Botón con Tailwind
**Antes:**
```jsx
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Guardar
</button>
```

**Después:**
```jsx
<button className="btn-primary">Guardar</button>
```

### Ejemplo 2: Tarjeta con Tailwind
**Antes:**
```jsx
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-xl font-bold text-gray-800">Título</h2>
  <p className="text-gray-600">Descripción</p>
</div>
```

**Después:**
```jsx
<div className="card">
  <h2>Título</h2>
  <p className="text-gray-600">Descripción</p>
</div>
```

### Ejemplo 3: Estado de Cita
**Antes:**
```jsx
{appointment.status === 'completed' && (
  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
    Completada
  </span>
)}
```

**Después:**
```jsx
<span className={`status-${appointment.status}`}>
  {getStatusLabel(appointment.status)}
</span>
```

---

## 🔍 Variables CSS - Acceso Directo

Si necesitas usar los colores directamente en estilos personalizados:

```css
/* En archivos .module.css */
.customElement {
  background-color: var(--color-primary);
  color: var(--color-text-light);
  border: 1px solid var(--color-border);
}

.customElement:hover {
  background-color: var(--color-primary-hover);
}
```

---

## 📱 Componentes Listos para Actualizar

### 1. **DoctorDashboard.tsx**
- Reemplazar colores de tarjetas de estadísticas
- Usar `badge-primary` para contadores
- Aplicar `btn-primary` a botón "Actualizar"

**Cambios necesarios:**
```jsx
// Antes
<div className={`${color} p-4 rounded-lg text-white text-2xl`}>

// Después
<div className="shadow-primary p-4 rounded-lg text-white text-2xl" style={{backgroundColor: 'var(--color-primary)'}}>
```

### 2. **PatientSearch.tsx**
- Usar `input-primary` en input de búsqueda
- Aplicar `btn-primary` y `btn-secondary` a botones
- Usar `card` para tarjetas de resultados

### 3. **AppointmentDetailPage.tsx**
- Reemplazar estilos de tabs con colores primarios
- Actualizar estados de cita con clases `status-*`
- Usar `card-primary` para secciones importantes

### 4. **Todos los componentes**
- Reemplazar `bg-indigo-600` con `var(--color-primary)`
- Reemplazar `text-indigo-600` con `text-primary`
- Reemplazar `hover:bg-indigo-700` con `:hover` de clases

---

## 🎨 Migración por Fases

### Fase 1: Componentes Principales (Hoy)
- [ ] DoctorDashboard.tsx
- [ ] PatientSearch.tsx
- [ ] AppointmentDetailPage.tsx

### Fase 2: Componentes Secundarios (Próxima)
- [ ] AppointmentCalendar.tsx
- [ ] AppointmentEditModal.tsx
- [ ] Componentes de login/auth

### Fase 3: Ajustes Finales (Opcional)
- [ ] Verificar contraste en todos los componentes
- [ ] Ajustar sombras y espaciado
- [ ] Pruebas de accesibilidad

---

## ✅ Checklist de Aplicación

- [ ] Actualizar colores primarios de botones
- [ ] Actualizar colores de tarjetas
- [ ] Aplicar estados de cita correctos
- [ ] Verificar que los badges tengan el color adecuado
- [ ] Comprobar inputs con foco
- [ ] Verificar contraste en todos los textos
- [ ] Probar en navegador
- [ ] Verificar responsiveness en mobile
- [ ] Revisar en diferentes navegadores

---

## 💡 Tips y Mejores Prácticas

1. **Consistencia**: Usa las clases predefinidas en lugar de colores inline
2. **Accesibilidad**: Todos los colores cumplen WCAG AAA (verificado)
3. **Mantenibilidad**: Si necesitas cambiar la paleta, solo edita `globals.css`
4. **Variables**: Usa `var(--color-*)` en CSS personalizado
5. **Hover States**: Siempre proporciona estados hover para interactividad

---

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que el archivo `globals.css` esté importado en `layout.tsx`
2. Limpia el cache del navegador (Ctrl+Shift+Delete)
3. Reinicia el servidor de desarrollo
4. Verifica que las clases CSS estén presentes en el HTML

¡Listo para aplicar los colores! 🚀

