# TaskFlow - Gestor de Tareas Profesional

Aplicación web moderna para gestionar tareas. Funciona 100% en el navegador, sin backend. Los datos se guardan automáticamente en localStorage.

---

## Características

- **Interfaz profesional** con layout de dos paneles (sidebar + lista).
- **Barra de búsqueda** para filtrar tareas por texto, categoría o prioridad.
- **Prioridad por tarea**: Baja, Media, Alta (con badges de colores).
- **Categoría por tarea**: Personal, Trabajo, Estudio, Otra.
- **Ordenación** por fecha o por prioridad (ascendente/descendente).
- **Filtros rápidos**: Todas, Pendientes, Completadas (pills redondeadas).
- **Edición inline** haciendo clic en "Editar" (sin popups).
- **Animaciones suaves** al agregar y eliminar tareas.
- **Barra de progreso** visual con porcentaje completado.
- **Panel de estadísticas**: Total, Pendientes, Completadas.
- **Confirmación** antes de eliminar tareas completadas.
- **Modo claro / oscuro** con detección automática del sistema.
- **Diseño responsive** optimizado para móvil, tablet y escritorio.
- **Persistencia completa** en localStorage.
- **Tipografía Inter** de Google Fonts.
- **Accesibilidad**: checkboxes personalizados, labels, aria attributes.

---

## Archivos

| Archivo       | Descripción                                        |
|---------------|----------------------------------------------------|
| `index.html`  | Estructura HTML con layout profesional             |
| `style.css`   | Estilos, variables CSS, animaciones, responsive    |
| `script.js`   | Lógica SPA completa con todas las funcionalidades  |
| `README.md`   | Documentación del proyecto                         |

---

## Uso

1. Abre `index.html` en tu navegador.
2. Escribe una tarea, selecciona prioridad y categoría, y presiona **Agregar tarea**.
3. Usa la **barra de búsqueda** para filtrar en tiempo real.
4. Usa los botones **Fecha** y **Prioridad** para ordenar.
5. Filtra por estado con las pills: **Todas**, **Pendientes**, **Completadas**.
6. Haz clic en **Editar** para modificar una tarea directamente en la lista.
7. Elimina tareas individualmente o todas las completadas.
8. Cambia entre tema claro y oscuro con el botón del header.
9. Cierra y vuelve a abrir: tus datos se conservan.

---

## Tecnologías

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox, Keyframes)
- JavaScript ES6+ (Vanilla)
- Google Fonts (Inter)
- localStorage API

---

## Notas

- No requiere backend, base de datos ni instalación.
- Funciona como sitio estático en GitHub Pages.
- Todo el código es texto plano, sin dependencias externas (excepto la fuente).

---

Creado con cuidado para ofrecer una experiencia de gestión de tareas moderna y profesional.