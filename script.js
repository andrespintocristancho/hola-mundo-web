(function(){
  'use strict';

  // Estado y persistencia
  const STORAGE_KEY = 'todos-v1';
  const THEME_KEY = 'theme';
  const FILTER_KEY = 'filter';
  /** @type {{id:string, title:string, completed:boolean, createdAt:number}[]} */
  let todos = [];
  /** @type {'all'|'active'|'completed'} */
  let currentFilter = 'all';

  // Elementos del DOM
  const $ = (s,ctx=document)=>ctx.querySelector(s);
  const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));

  const form = $('#todo-form');
  const input = $('#todo-input');
  const list = $('#todo-list');
  const countTotal = $('#count-total');
  const countPending = $('#count-pending');
  const countCompleted = $('#count-completed');
  const clearCompletedBtn = $('#clear-completed');
  const themeToggle = $('#theme-toggle');
  const filterButtons = $$('.filter-btn');

  // Utilidades
  const uid = () => Math.random().toString(36).slice(2,9);
  const now = () => Date.now();
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  const saveFilter = () => localStorage.setItem(FILTER_KEY, currentFilter);
  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      todos = raw ? JSON.parse(raw) : [];
      // Migración suave: asegurar createdAt en tareas antiguas
      for (const t of todos) if (typeof t.createdAt !== 'number') t.createdAt = now();
    } catch { todos = []; }
  };
  const loadFilter = () => {
    const stored = localStorage.getItem(FILTER_KEY);
    if (stored === 'all' || stored === 'active' || stored === 'completed') currentFilter = stored;
  };

  const formatDate = (ms) => {
    try {
      return new Date(ms).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    } catch { return ''; }
  };

  const setActiveFilterUI = () => {
    for (const btn of filterButtons) {
      const isActive = btn.dataset.filter === currentFilter;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    }
  };

  const getFilteredTodos = () => {
    if (currentFilter === 'active') return todos.filter(t => !t.completed);
    if (currentFilter === 'completed') return todos.filter(t => t.completed);
    return todos;
  };

  const updateCounters = () => {
    const total = todos.length;
    const pending = todos.filter(t => !t.completed).length;
    const completed = total - pending;
    countTotal.textContent = `${total} ${total===1?'total':'totales'}`;
    countPending.textContent = `${pending} ${pending===1?'pendiente':'pendientes'}`;
    countCompleted.textContent = `${completed} ${completed===1?'completada':'completadas'}`;
  };

  const render = () => {
    list.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (const t of getFilteredTodos()) {
      const li = document.createElement('li');
      li.className = 'todo-item' + (t.completed ? ' completed' : '');
      li.dataset.id = t.id;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'checkbox';
      cb.checked = t.completed;
      cb.addEventListener('change', () => toggle(t.id));

      const contentWrap = document.createElement('div');
      contentWrap.style.display = 'flex';
      contentWrap.style.flexDirection = 'column';
      contentWrap.style.gap = '.2rem';

      const span = document.createElement('span');
      span.className = 'title';
      span.textContent = t.title;

      const date = document.createElement('span');
      date.className = 'meta-date';
      date.textContent = `Creada: ${formatDate(t.createdAt)}`;

      contentWrap.append(span, date);

      const edit = document.createElement('button');
      edit.className = 'edit-btn';
      edit.type = 'button';
      edit.textContent = 'Editar';
      edit.addEventListener('click', () => startEdit(t.id));

      const del = document.createElement('button');
      del.className = 'remove-btn';
      del.type = 'button';
      del.textContent = 'Eliminar';
      del.addEventListener('click', () => remove(t.id));

      li.append(cb, contentWrap, edit, del);
      frag.append(li);
    }
    list.append(frag);
    updateCounters();
  };

  // Acciones
  const add = (title) => {
    const v = title.trim();
    if (!v) return;
    todos.unshift({ id: uid(), title: v, completed: false, createdAt: now() });
    save();
    render();
  };

  const toggle = (id) => {
    const t = todos.find(x => x.id === id);
    if (!t) return;
    t.completed = !t.completed;
    save();
    render();
  };

  const remove = (id) => {
    todos = todos.filter(x => x.id !== id);
    save();
    render();
  };

  const clearCompleted = () => {
    if (!todos.some(t => t.completed)) return;
    const ok = confirm('¿Eliminar todas las tareas completadas? Esta acción no se puede deshacer.');
    if (!ok) return;
    todos = todos.filter(t => !t.completed);
    save();
    render();
  };

  const startEdit = (id) => {
    const li = list.querySelector(`[data-id="${id}"]`);
    if (!li) return;
    const titleSpan = li.querySelector('.title');
    if (!titleSpan) return;

    // Evitar múltiples ediciones simultáneas en el mismo ítem
    if (li.querySelector('.edit-input')) return;

    const current = titleSpan.textContent || '';
    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.className = 'edit-input';
    inputEdit.value = current;
    inputEdit.setAttribute('aria-label', 'Editar tarea');

    titleSpan.replaceWith(inputEdit);
    inputEdit.focus();
    inputEdit.setSelectionRange(current.length, current.length);

    const cancel = () => {
      inputEdit.replaceWith(titleSpan);
    };
    const commit = () => {
      const v = inputEdit.value.trim();
      if (v) {
        const t = todos.find(x => x.id === id);
        if (t) { t.title = v; save(); }
      }
      render();
    };

    inputEdit.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') cancel();
    });
    inputEdit.addEventListener('blur', commit);
  };

  // Tema
  const applyTheme = (mode) => {
    if (mode === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme'); // dark por defecto
  };
  const loadTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  };
  const toggleTheme = () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    themeToggle.setAttribute('aria-pressed', String(next === 'light'));
    themeToggle.textContent = next === 'light' ? '🌙' : '🌞';
  };

  // Eventos
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    add(input.value);
    input.value = '';
    input.focus();
  });
  clearCompletedBtn.addEventListener('click', clearCompleted);
  themeToggle.addEventListener('click', toggleTheme);

  for (const btn of filterButtons) {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      if (f === 'all' || f === 'active' || f === 'completed') {
        currentFilter = f;
        saveFilter();
        setActiveFilterUI();
        render();
      }
    });
  }

  // Init
  load();
  loadFilter();
  render();
  setActiveFilterUI();
  applyTheme(loadTheme());
  themeToggle.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '🌙' : '🌞';
})();
