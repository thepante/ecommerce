const profilePicture = document.getElementById('profile-picture');
const btnDeletePic = document.getElementById('delete-picture');
const alert = document.getElementById('alert-profile');

const ALERTS = {
  SAVED: { msg: 'Guardado!', style: 'saved', duration: 4 },
  ERROR: { msg: 'Error al guardar: imagen de perfil muy pesada!', style: 'error', duration: 10 },
}

const DEFAULT_PIC = './img/user.png';
let pictureUsing = null;

function setProfilePic(src) {
  profilePicture.style.backgroundImage = `url('${src}')`;
  pictureUsing = src;
  setDeleteAvailability();
}

function setDeleteAvailability() {
  const isDefault = pictureUsing === DEFAULT_PIC;
  isDefault ? btnDeletePic.classList.add('disabled') : btnDeletePic.classList.remove('disabled');
}

// carga una imagen como string. base64
function uploadPicture() {
  const file = document.querySelector('input[type=file]').files[0];

  function readAndPreview() {
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.addEventListener('load', function() {
        setProfilePic(this.result);
      }, false);
      reader.readAsDataURL(file);
    }
  }

  // previsualizo la imagen
  file && readAndPreview();
}


function loadUserData() {
  // claves que no voy a utilizar en el for of
  const ignoreKeys = ['viagoogle', 'picture'];

  // restaura: asigna los valores de los inputs
  for (const [key, value] of Object.entries(userData)) {
    if (ignoreKeys.includes(key)) continue;
    document.getElementById(key).value = value;
  }

  setProfilePic(userData.picture);
}


function saveProfile(e) {
  e.preventDefault();
  e.stopPropagation();

  const inputs = Array.from(this.getElementsByTagName('input'));
  const updatedData = userData;

  // actualiza, agrega o elimina los valores a la copia del userData para guardarlo
  inputs.forEach(input => {
    const value = input.value.trim();
    if (value !== '') {
      updatedData[input.id] = value;
    } else if (input.id !== 'username') {
      delete updatedData[input.id];
    }
  });

  // si se cambió la imagen, la actualizo en el updatedData
  if (pictureUsing !== userData.picture) updatedData.picture = pictureUsing;

  try {
    localStorage.setItem('Logged-User', JSON.stringify(updatedData));
    window.location = window.location.pathname + '?saved';
  } catch {
    showAlert(ALERTS.ERROR);
    document.body.scrollIntoView();
  }
}

// mostrar un mensaje de 'guardado' o 'error'
function showAlert({msg, style, duration}) {
  alert.innerText = msg;
  alert.classList.add(style);
  setTimeout(() => alert.classList.remove(style), duration * 1000);
}


document.addEventListener("DOMContentLoaded", function() {
  profileSaved && showAlert(ALERTS.SAVED);
  loadUserData();

  document.getElementById('pic-picker').addEventListener('change', uploadPicture);
  btnDeletePic.addEventListener('click', () => setProfilePic(DEFAULT_PIC));
  document.getElementById('profile').addEventListener('submit', saveProfile);
});
