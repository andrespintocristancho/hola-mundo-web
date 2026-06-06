const STORAGE_KEY = 'tareas-app-v3';
const THEME_KEY = 'theme';

let tareas = [];
let filtro = 'all';
let searchText = '';
let sortBy = '';
let sortAsc = true;

const $ = sel => document.querySelector(sel);
const $all = sel => Array.from(document.querySelectorAll(sel));
const input = $('#todo-input');
const prioritySelect = $('#priority-select');
const categorySelect = $('#category-select');
const todoList = $('#todo-list');
const searchInput = $('#search-input');
const sortDateBtn = $('#sort-date-btn');
const sortPriorityBtn = $('#sort-priority-btn');
const filterBtns = $all('.filter-btn');

const uid = () => Math.random().toString(36).slice(2,9);

function guardar(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas)); }
function cargar(){ try { tareas = JSON.parse(localStorage.getItem(STORAGE_KEY))||[]; } catch { tareas=[]; } }

function render(){
  let lista = tareas.slice();
  lista = lista.filter(t=> (filtro==='active'? !t.completada : filtro==='completed'? t.completada : true));
  if(searchText) lista = lista.filter(t=> t.titulo.toLowerCase().includes(searchText));

  if(sortBy==='date') lista.sort((a,b)=> sortAsc? a.creadaAt-b.creadaAt : b.creadaAt-a.creadaAt);
  if(sortBy==='priority'){
    const rank = {high:3,medium:2,low:1};
    lista.sort((a,b)=> sortAsc? rank[a.prioridad]-rank[b.prioridad]: rank[b.prioridad]-rank[a.prioridad]);}

  todoList.innerHTML='';
  lista.forEach(t=>{
    const li=document.createElement('li');
    li.className='todo-item'+(t.completada?' completed':'');
    li.dataset.id=t.id;
    li.innerHTML=`<input type="checkbox" ${t.completada?'checked':''} class="checkbox"> <span class="priority-badge">${t.prioridad}</span><span class="category-badge">${t.categoria}</span><span class="title">${t.titulo}</span> <button class="edit-btn">Editar</button> <button class="remove-btn">X</button>`;
    li.querySelector('.checkbox').addEventListener('change',()=>toggle(t.id));
    li.querySelector('.remove-btn').addEventListener('click',()=>eliminar(t.id,li));
    li.querySelector('.edit-btn').addEventListener('click',()=>editar(t.id));
    todoList.appendChild(li);
  });
}

$('#todo-form').addEventListener('submit',e=>{
  e.preventDefault();
  const titulo=input.value.trim();
  if(!titulo) return;
  const nueva={id:uid(),titulo,completada:false,creadaAt:Date.now(),prioridad:prioritySelect.value,categoria:categorySelect.value};
  tareas.unshift(nueva);
  guardar();
  input.value='';
  render();
});

searchInput.addEventListener('input',e=>{searchText=e.target.value.toLowerCase();render();});
sortDateBtn.addEventListener('click',()=>{sortBy='date';sortAsc=!sortAsc;render();});
sortPriorityBtn.addEventListener('click',()=>{sortBy='priority';sortAsc=!sortAsc;render();});
filterBtns.forEach(btn=>btn.addEventListener('click',()=>{filtro=btn.dataset.filter;filterBtns.forEach(b=>b.classList.remove('is-active'));btn.classList.add('is-active');render();}));

function toggle(id){const t=tareas.find(x=>x.id===id);if(t){t.completada=!t.completada;guardar();render();}}
function eliminar(id,li){li.classList.add('removing');setTimeout(()=>{tareas=tareas.filter(x=>x.id!==id);guardar();render();},280);}
function editar(id){const t=tareas.find(x=>x.id===id);if(!t)return;const nuevo=prompt('Editar tarea:',t.titulo);if(nuevo){t.titulo=nuevo;guardar();render();}}

function iniciar(){cargar();render();}
document.addEventListener('DOMContentLoaded',iniciar);

// Tema
const themeToggle=$('#theme-toggle');
function aplicarTema(th){document.documentElement.setAttribute('data-theme',th);themeToggle.setAttribute('aria-pressed',th==='light');localStorage.setItem(THEME_KEY,th);}
function cargarTema(){const t=localStorage.getItem(THEME_KEY)||'dark';aplicarTema(t);} 
cargarTema(); themeToggle.addEventListener('click',()=>{const actual=document.documentElement.getAttribute('data-theme');aplicarTema(actual==='light'?'dark':'light');});