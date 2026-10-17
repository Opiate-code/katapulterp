# KATAPULT ERP — Estado del Proyecto & Ficha de Traspaso (Handover)

**Fecha de actualización:** 17 de Octubre de 2026  
**Ubicación local:** `C:\Users\catho\Proyectos\KATAPULTERP`  
**Repositorio GitHub:** `https://github.com/Opiate-code/katapulterp.git` (rama `main`)  
**Puerto local de desarrollo:** `http://localhost:5173/` (`npm run dev`)

---

## 1. Resumen Ejecutivo del Proyecto
KATAPULT ERP es una plataforma de gestión empresarial 360° diseñada con React 19, TypeScript, Vite y Tailwind CSS. Implementa un sistema de navegación modular con interfaz moderna en paleta Rose/Dark Navy (`#E11D48`, `#0A1128`).

---

## 2. Módulos Implementados y Funcionamiento

### A. Módulo de Cuentas (`src/components/AccountsModule.tsx` & `src/data/accountsData.ts`)
- **Directorio de Cuentas B2B / B2C:** Búsqueda en vivo (por nombre, ciudad, RFC), filtros por tipo, industria y estado (activo, potencial, inactivo).
- **KPIs en tiempo real:** Cuentas activas, potenciales, inactivas, valor de cartera e ingresos LTV.
- **Acceso rápido en cabecera de cuenta:**
  - Botón directo `[ 📁 Expediente ]` para saltar a la bóveda documental.
  - Llamadas telefónicas (`tel:`) y WhatsApp directo (`wa.me`).
  - Correo y vinculación de contactos.
- **Pestañas internas de la cuenta:**
  1. *Información:* Datos fiscales (RFC), responsable comercial, notas estratégicas, tarjeta de vista rápida del expediente documental.
  2. *Contactos:* Puntos focales vinculados con rol y designación de contacto principal.
  3. *Servicios:* Software, Consultoría, SLA, planes y fechas de renovación.
  4. *Actividades:* Línea de tiempo cronológica con autor.
  5. *Expediente / Docs (Repositorio Documental):*
     - Buscador de archivos y chips de filtrado por categoría (`Contrato`, `Fiscal / SAT`, `Cotización`, `Legal`, `Otro`).
     - **Restricción estricta de formatos:** Solo admite **PDF, JPEG, PNG, Microsoft Word (.doc, .docx) y Excel (.xls, .xlsx)**.
     - Detección automática de tipo, peso real (KB/MB) y miniatura de imagen.
     - Acciones: Previsualización (`Eye`), Descarga (`Download`) y Eliminación con confirmación (`Trash2`).
  6. *Finanzas:* Oportunidades comerciales y pipeline value.

### B. Módulo de Contactos (`src/components/ContactsModule.tsx`)
- Directorio de personas con filtros por cuenta, tipo y etiquetas.
- Botones de acción dual: Llamada nativa telefónica (`tel:`) y WhatsApp directo con mensaje preconfigurado.
- Tarjeta de detalle con historial de interacciones y oportunidades vinculadas.

### C. Módulo de Actividades & Agenda (`src/components/ActivitiesModule.tsx`)
- Integración automática con calendarios (Google Calendar y Outlook).
- Generación automática de enlace único para **Google Meet** en cada sincronización.
- Lógica de negocio depurada: Las actividades ya cumplidas no muestran opciones de reagendamiento redundantes.

### D. Panel de Inicio / Dashboard (`src/components/DashboardOverview.tsx`)
- Tarjetas de métricas sin flechas falsas de enlace.
- Próximas actividades con navegación directa al detalle.
- Pipeline de oportunidades comerciales con vista ampliable.

---

## 3. Comandos Útiles

```bash
# Iniciar servidor local
npm run dev

# Compilar para producción (Zero TypeScript errors)
npm run build

# Sincronizar cambios con GitHub
git status
git add .
git commit -m "feat: ..."
git push origin main
```
