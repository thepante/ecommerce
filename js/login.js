let loginInputs = [];

const checkInputs = () => {
  let filledForm = true;

  loginInputs.forEach( input => {
    if (input.value === '') {
      filledForm = false;
      input.style.background = '#e6c2c2';
    }
  });

  if (filledForm) {
    window.location = 'index.html';
  }
}

const removeWarning = () => {
  loginInputs.forEach( input => {
    if (input.value != '') {
      input.style.background = 'white';
    }
  });
}

document.addEventListener("DOMContentLoaded", function(e){
  loginInputs = [
    document.getElementById('inputUser'),
    document.getElementById('inputPassword')
  ];
  
  // Revisa los inputs si se clickea en 'Entrar' o si se pulsa la tecla 'Enter'
  document.getElementById("submitButton").addEventListener('click', checkInputs);
  document.getElementById("loginForm").addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkInputs();
  });

  // Si el usuario empezó a llenar un campo, entonces remuevo la advertencia visual de este
  document.getElementById('loginForm').addEventListener('keyup', removeWarning);
});