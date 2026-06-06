const button = document.getElementById('toggle-btn');
button.addEventListener('click',()=>{
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if(currentTheme==='dark'){
    document.documentElement.removeAttribute('data-theme');
    button.textContent='Cambiar a modo oscuro';
  }else{
    document.documentElement.setAttribute('data-theme','dark');
    button.textContent='Cambiar a modo claro';
  }
});