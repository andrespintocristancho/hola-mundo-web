# App de Tareas (SPA)

Aplicación web de tareas hecha con HTML, CSS y JavaScript puro. Funciona 100% en el navegador (sin backend) y persiste los datos en localStorage.

## Novedades
- Filtros: Todas, Pendientes, Completadas.
- Editar una tarea en línea.
- Fecha de creación visible por tarea.
- Contadores: total, pendientes y completadas.
- Confirmación antes de eliminar completadas.
- Diseño responsive mejorado para móvil.
- Preferencia de tema (claro/oscuro) guardada.

## Estructura
- `index.html`: Maquetado, filtros y contadores.
- `style.css`: Estilos modernos, responsive y estados visuales.
- `script.js`: Lógica (CRUD, filtros, edición, persistencia y tema).

## Uso
1. Abre `index.html` en tu navegador o visita la URL de GitHub Pages si está habilitado.
2. Escribe una tarea y pulsa Enter o el botón Agregar.
3. Usa los filtros (Todas, Pendientes, Completadas).
4. Edita con el botón “Editar”; pulsa Enter o haz clic fuera para guardar.
5. Marca tareas con el checkbox y elimínalas con “Eliminar”.
6. “Eliminar completadas” pedirá confirmación.

## Notas
- Todo se guarda en `localStorage`.
- No requiere backend ni servicios externos.
