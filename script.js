/* ========================================
   TaskFlow - Lógica Profesional
   ======================================== */

const STORAGE_KEY = 'taskflow-v4';
const THEME_KEY = 'taskflow-theme';

let tareas = [];
let filtro = 'all';
let busqueda = '';
let ordenarPor = '';
let ordenAsc = true;

/* --- Selectores --- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const form = $('#todo-form');
const inputTarea = $('#todo-input');
const selectPrioridad = $('#priority-select');
const selectCategoria = $('#category-select');
const lista = $('#todo-list');
const inputBuscar = $('#search-input');
const btnSortDate = $('#sort-date-btn');
const btnSortPriority = $('#sort-priority-btn');
const btnClear = $('#clear-completed');
const filterBtns = $$('.filter-btn');
const countTotal = $('#count-total');
const countPending = $('#count-pending');
const countCompleted = $('#count-completed');
const progressBar = $('#progress-bar');
const progressText = $('#progress-text');
const emptyState = $('#empty-state');
const themeToggle = $('#theme-toggle');
const themeIcon = $('#theme-icon');

/* --- Utilidades --- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const PRIORITY_LABELS = { low: 'Baja', medium: 'Media', high: 'Alta' };
const PRIORITY_RANK = { high: 3, medium: 2, low: 1 };
const CATEGORY_LABELS = { personal: 'Personal', work: 'Trabajo', study: 'Estudio', other: 'Otra' };

function formatDate(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

/* --- Persistencia --- */
function guardar() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas)); }
function cargar() {
  try { tareas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { tareas = []; }
}

/* --- Contadores y progreso --- */
function actualizarEstadisticas() {
  const total = tareas.length;
  const completadas = tareas.filter(t => t.completada).length;
  const pendientes = total - completadas;
  const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;

  countTotal.textContent = total;
  countPending.textContent = pendientes;
  countCompleted.textContent = completadas;
  progressBar.style.width = porcentaje + '%';
  progressText.textContent = porcentaje + '% completado';
}

/* --- Filtrado y ordenación --- */
function obtenerTareasFiltradas() {
  let resultado = tareas.slice();

  if (filtro === 'active') resultado = resultado.filter(t => !t.completada);
  if (filtro === 'completed') resultado = resultado.filter(t => t.completada);

  if (busqueda) {
    const q = busqueda.toLowerCase();
    resultado = resultado.filter(t =>
      t.titulo.toLowerCase().includes(q) ||
      CATEGORY_LABELS[t.categoria].toLowerCase().includes(q) ||
      PRIORITY_LABELS[t.prioridad].toLowerCase().includes(q)
    );
  }

  if (ordenarPor === 'date') {
    resultado.sort((a, b) => ordenAsc ? a.creadaAt - b.creadaAt : b.creadaAt - a.creadaAt);
  }
  if (ordenarPor === 'priority') {
    resultado.sort((a, b) => ordenAsc ? PRIORITY_RANK[a.prioridad] - PRIORITY_RANK[b.prioridad] : PRIORITY_RANK[b.prioridad] - PRIORITY_RANK[a.prioridad]);
  }

  return resultado;
}

/* --- Renderizado --- */
function render() {
  const filtradas = obtenerTareasFiltradas();

  lista.innerHTML = '';

  if (filtradas.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  filtradas.forEach(t => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (t.completada ? ' completed' : '');
    li.dataset.id = t.id;

    li.innerHTML = `
      <label class="custom-checkbox">
        <input type="checkbox" ${t.completada ? 'checked' : ''}>
        <span class="checkmark">${t.completada ? '&#10003;' : ''}</span>
      </label>
      <div class="todo-info">
        <span class="todo-title">${escapeHTML(t.titulo)}</span>
        <div class="todo-meta">
          <span class="badge badge-${t.prioridad}">${PRIORITY_LABELS[t.prioridad]}</span>
          <span class="badge badge-category">${CATEGORY_LABELS[t.categoria] || t.categoria}</span>
          <span class="todo-date">${formatDate(t.creadaAt)}</span>
        </div>
      </div>
      <div class="todo-actions">
        <button class="action-btn edit-btn" title="Editar">&#9998;</button>
        <button class="action-btn delete-btn" title="Eliminar">&#10005;</button>
      </div>
    `;

    li.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTarea(t.id));
    li.querySelector('.edit-btn').addEventListener('click', () => editarInline(t.id, li));
    li.querySelector('.delete-btn').addEventListener('click', () => eliminarTarea(t.id, li));

    lista.appendChild(li);
  });

  actualizarEstadisticas();
  actualizarFiltrosUI();
  actualizarSortUI();
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* --- Acciones --- */
function agregarTarea(titulo, prioridad, categoria) {
  tareas.unshift({
    id: uid(),
    titulo: titulo.trim(),
    completada: false,
    creadaAt: Date.now(),
    prioridad: prioridad,
    categoria: categoria
  });
  guardar();
  render();
}

function toggleTarea(id) {
  const t = tareas.find(x => x.id === id);
  if (t) { t.completada = !t.completada; guardar(); render(); }
}

function eliminarTarea(id, li) {
  li.classList.add('removing');
  setTimeout(() => {
    tareas = tareas.filter(x => x.id !== id);
    guardar();
    render();
  }, 300);
}

function editarInline(id, li) {
  const t = tareas.find(x => x.id === id);
  if (!t) return;

  const titleSpan = li.querySelector('.todo-title');
  if (li.querySelector('.edit-inline')) return;

  const inputEdit = document.createElement('input');
  inputEdit.type = 'text';
  inputEdit.className = 'edit-inline';
  inputEdit.value = t.titulo;

  titleSpan.replaceWith(inputEdit);
  inputEdit.focus();
  inputEdit.select();

  function guardarEdicion() {
    const nuevoValor = inputEdit.value.trim();
    if (nuevoValor && nuevoValor !== t.titulo) {
      t.titulo = nuevoValor;
      guardar();
    }
    render();
  }

  inputEdit.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); guardarEdicion(); }
    if (e.key === 'Escape') render();
  });
  inputEdit.addEventListener('blur', guardarEdicion);
}

/* --- UI Filtros --- */
function actualizarFiltrosUI() {
  filterBtns.forEach(btn => {
    const activo = btn.dataset.filter === filtro;
    btn.classList.toggle('is-active', activo);
  });
}

function actualizarSortUI() {
  btnSortDate.classList.toggle('is-active', ordenarPor === 'date');
  btnSortPriority.classList.toggle('is-active', ordenarPor === 'priority');
}

/* --- Eventos --- */
form.addEventListener('submit', e => {
  e.preventDefault();
  const titulo = inputTarea.value.trim();
  if (!titulo) return;
  agregarTarea(titulo, selectPrioridad.value, selectCategoria.value);
  inputTarea.value = '';
  inputTarea.focus();
});

inputBuscar.addEventListener('input', e => {
  busqueda = e.target.value;
  render();
});

btnSortDate.addEventListener('click', () => {
  if (ordenarPor === 'date') { ordenAsc = !ordenAsc; }
  else { ordenarPor = 'date'; ordenAsc = false; }
  render();
});

btnSortPriority.addEventListener('click', () => {
  if (ordenarPor === 'priority') { ordenAsc = !ordenAsc; }
  else { ordenarPor = 'priority'; ordenAsc = false; }
  render();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filtro = btn.dataset.filter;
    render();
  });
});

btnClear.addEventListener('click', () => {
  const hay = tareas.some(t => t.completada);
  if (!hay) return;
  const ok = confirm('¿Eliminar todas las tareas completadas? Esta acción no se puede deshacer.');
  if (!ok) return;
  tareas = tareas.filter(t => !t.completada);
  guardar();
  render();
});

/* --- Tema --- */
function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  themeIcon.innerHTML = tema === 'light' ? '&#9728;' : '&#9790;';
  localStorage.setItem(THEME_KEY, tema);
}

function cargarTema() {
  const guardado = localStorage.getItem(THEME_KEY);
  if (guardado) { aplicarTema(guardado); return; }
  const prefiere = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  aplicarTema(prefiere ? 'light' : 'dark');
}

themeToggle.addEventListener('click', () => {
  const actual = document.documentElement.getAttribute('data-theme');
  aplicarTema(actual === 'light' ? 'dark' : 'light');
});

/* --- Iniciar --- */
function iniciar() {
  cargarTema();
  cargar();
  render();
}

document.addEventListener('DOMContentLoaded', iniciar);