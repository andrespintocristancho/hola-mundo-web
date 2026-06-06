(function(){
  'use strict';

  // Estado y persistencia
  const STORAGE_KEY = 'todos-v1';
  /** @type {{id:string, title:string, completed:boolean}[]} */
  let todos = [];

  // Elementos del DOM
  const $ = (s,ctx=document)=>ctx.querySelector(s);
  const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));

  const form = $('#todo-form');
  const input = $('#todo-input');
  const list = $('#todo-list');
  const pendingCount = $('#pending-count');
  const clearCompletedBtn = $('#clear-completed');
  const themeToggle = $('#theme-toggle');

  // Utilidades
  const uid = () => Math.random().toString(36).slice(2,9);
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      todos = raw ? JSON.parse(raw) : [];
    } catch { todos = []; }
  };

  const render = () => {
    list.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (const t of todos) {
      const li = document.createElement('li');
      li.className = 'todo-item' + (t.completed ? ' completed' : '');
      li.dataset.id = t.id;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'checkbox';
      cb.checked = t.completed;
      cb.addEventListener('change', () => toggle(t.id));

      const span = document.createElement('span');
      span.className = 'title';
      span.textContent = t.title;

      const del = document.createElement('button');
      del.className = 'remove-btn';
      del.type = 'button';
      del.textContent = 'Eliminar';
      del.addEventListener('click', () => remove(t.id));

      li.append(cb, span, del);
      frag.append(li);
    }
    list.append(frag);

    const pending = todos.filter(t => !t.completed).length;
    pendingCount.textContent = `${pending} ${pending === 1 ? 'pendiente' : 'pendientes'}`;
  };

  // Acciones
  const add = (title) => {
    const v = title.trim();
    if (!v) return;
    todos.unshift({ id: uid(), title: v, completed: false });
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
    todos = todos.filter(t => !t.completed);
    save();
    render();
  };

  // Tema
  const THEME_KEY = 'theme';
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

  // Init
  load();
  render();
  applyTheme(loadTheme());
  themeToggle.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '🌙' : '🌞';
})();
