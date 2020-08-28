let loginInputs = [];

const accessHome = () => window.location = 'home.html';

const checkInputs = () => {
  let filledForm = true;

  loginInputs.forEach( input => {
    if (input.value.replace(/\s+/g,' ').trim() === '') {
      filledForm = false;
      input.style.background = '#e6c2c2';
    }
  });

  if (filledForm) {
    const data = {
      username: loginInputs[0].value,
      picture: './img/user.png'
    };
    localStorage.setItem('Logged-User', JSON.stringify(data));
    accessHome();
  }
}

const removeWarning = () => {
  loginInputs.forEach( input => {
    if (input.value != '') {
      input.style.background = 'white';
    }
  });
}

// Si inicia con cuenta de Google
function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  const data = {
    username: profile.getName(), 
    picture: profile.getImageUrl()
  };
  localStorage.setItem('Logged-User', JSON.stringify(data));
  accessHome();
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