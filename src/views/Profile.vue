<template>
  <div v-if="user" class="container myprofile">
    <span v-if="ALERTS.SELECTED" id="alert-profile" :class="alert.style">{{ alert.msg }}</span>
    <div class="card settings">
      <div class="card-header bg-white border-0">
        <div class="row">
          <div class="col-sm-10">
            <h3>Mi perfil</h3>
            <h6 class="heading-small text-muted">Datos personales</h6>
          </div>
          <div class="col d-flex justify-content-center m-0 p-0 pp-btn">

            <div
              id="profile-picture"
              aria-expanded="false"
              data-toggle="dropdown"
              class="profile-picture"
              :style="`background-image: url('${user.picture || DEFAULT_PIC}')`"
            >
              <div class="change-pic-overlay">
                <i class="fas fa-wrench"></i>
              </div>
            </div>

            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="profile-picture">
              <label class="dropdown-item">
                <input @change="uploadPicture" type="file" style="display: none; position: fixed; top: -1000px;">
                Seleccionar una imagen...
              </label>
              <div class="dropdown-divider"></div>
              <span @click="deleteProfilePic" class="dropdown-item" :class="hasDefaultPic && 'disabled'" >
                {{ labelDeletePic }}
              </span>
            </div>

          </div>
        </div>
      </div>

      <div id="profile-settings" @keyup.enter="saveProfile" class="card-body">
        <div class="row">
          <div class="form-group col-sm-6">
            <label class="form-control-label" for="username">Nombre de usuario</label>
            <input :value="user.username" id="username" type="text" class="form-control" required>
          </div>
          <div class="form-group col-sm-6">
            <label class="form-control-label" for="email">Correo electrónico</label>
            <input :value="user.email" id="email" type="email" class="form-control">
          </div>
        </div>
        <div class="row">
          <div class="form-group col-sm-6">
            <label class="form-control-label" for="names">Nombres</label>
            <input :value="user.firstNames" id="firstNames" type="text" class="form-control">
          </div>
          <div class="form-group col-sm-6">
            <label class="form-control-label" for="lastnames">Apellidos</label>
            <input :value="user.lastNames" id="lastNames" type="text" class="form-control">
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6 d-flex p-0">
            <div class="form-group col-3">
              <label class="form-control-label" for="age">Edad</label>
              <input :value="user.age" id="age" type="number" class="form-control" min="0" oninput="validity.valid||(value='');">
            </div>
            <div class="form-group col-9">
              <label class="form-control-label" for="telephone">Teléfono</label>
              <input :value="user.phone" id="phone" type="number" class="form-control" min="0" oninput="validity.valid||(value='');">
            </div>
          </div>
        </div>
        <hr>
        <div class="row px-3">
          <button @click="saveProfile" class="btn btn-primary btn-block profile-save">Guardar cambios</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      DEFAULT_PIC: require('@/assets/user.png'),
      LABELS: {
        DELETE: 'Eliminar imagen de perfil',
        REVERT: 'Cancelar cambios de imagen',
      },
      ALERTS: {
        SELECTED: null,
        SAVED: { msg: 'Guardado!', style: 'saved', duration: 4 },
        ERROR: { msg: 'Imagen muy pesada! Peso máximo permitido de 512KB', style: 'error', duration: 10 },
      },
      hasDefaultPic: false,
      labelDeletePic: null,
    }
  },
  computed: {
    profilePicture: () => document.getElementById('profile-picture'),
    alert() {
      return this.ALERTS[this.ALERTS.SELECTED]
    },
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    return { store, user };
  },
  mounted() {
    if (this.user) {
      this.userPicIsDefault() && (this.hasDefaultPic = true);
      this.labelDeletePic = this.LABELS.DELETE;
    } else {
      this.loginRedir();
    }
  },
  methods: {

    loginRedir() {
      this.$router.push({
        name: 'Login',
        params: {
          msg: 'Debes estar logueado para acceder a los ajustes de perfil',
          from: 'Profile',
        }
      });
    },

    pictureDisplayed() {
      return this.profilePicture.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
    },

    gotChanged() {
      return this.pictureDisplayed() !== (this.user.picture || this.DEFAULT_PIC);
    },

    isDefault() {
      return this.pictureDisplayed() == this.DEFAULT_PIC;
    },

    userPicIsDefault() {
      return this.isDefault() && !this.user.picture;
    },

    setProfilePic(src) {
      this.profilePicture.style.backgroundImage = `url('${src}')`;
      this.labelDeletePic = this.gotChanged() ? this.LABELS.REVERT : this.LABELS.DELETE;
      this.hasDefaultPic = this.userPicIsDefault();
    },

    deleteProfilePic() {
      this.setProfilePic(this.gotChanged() && this.user.picture || this.DEFAULT_PIC);
    },

    uploadPicture() {
      const input = document.querySelector('input[type=file]');
      const file = input.files[0];

      const readAndPreview = () => {
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            const bytes = (reader.result.length * (3/4) - 1);
            const size = bytes * 0.001; // KB

            if (size <= 512) {
              this.setProfilePic(reader.result);
            } else {
              this.showAlert('ERROR');
            }

          }, false);
          reader.readAsDataURL(file);
        }
      }

      // preview image
      file && readAndPreview();
      input.value = '';
    },

    // show a notification with a success or error notice
    showAlert(type) {
      this.ALERTS.SELECTED = type;
      setTimeout(() => this.ALERTS.SELECTED = null, this.alert.duration * 1000);
    },

    saveProfile() {
      const inputs = Array.from(document.getElementsByTagName('input'));
      const updatedData = this.user;

      // update user data with new values from inputs in form
      inputs.forEach(input => {
        if (!input.id) return;
        const value = input.value.trim();

        if (value) {
          updatedData[input.id] = value;
        } else if (input.id !== 'username') {
          delete updatedData[input.id];
        }
      });

      // if picture got changed
      if (this.gotChanged()) {
        if (this.isDefault()) {
          delete updatedData.picture;
        } else {
          updatedData.picture = this.pictureDisplayed();
        }
      }

      try {
        localStorage.setItem('Logged-User', JSON.stringify(updatedData));
        this.ALERTS.SELECTED = 'SAVED';
        this.showAlert('SAVED')
      } catch {
        this.setProfilePic(this.user.picture)
        console.log('Error while trying to save to local');
      }
    },
  },
}
</script>

<style lang="scss" scoped>

.myprofile {
  max-width: 800px;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.settings {
  box-shadow: 0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2);

  h3 {
    font-weight: 700;
  }

  hr {
    margin-bottom: 2rem !important;
  }

  .card-header {
    padding-top: 1.5rem;
  }

  .dropdown-item,
  .dropdown-item label {
    cursor: pointer;
  }

  .dropdown-item.disabled,
  .dropdown-item:disabled {
    color: #a3aab0;
    pointer-events: none;
  }

  input[type="number"],
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    background: transparent;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: textfield !important;
  }

  .pp-btn .show .change-pic-overlay {
    opacity: 1;
  }
}

#alert-profile {
  text-align: center;
  font-weight: 700;
  font-size: .8rem;
  color: #fff;
  padding: .2rem 1rem;
  margin: 0 auto;
  margin-top: -2.5rem;
  margin-bottom: 1rem;
  border-radius: .2rem;
  box-shadow: 0 2px 6px -1px #9b9494;

  &.saved, &.error {
    display: table;
  }

  &.saved {
    background: #7fbb7f;
  }

  &.error {
    background: #f76b6b;
  }
}

.profile-picture {
  display: block;
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  border: .1rem solid #f0f0f0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0 0 4px #e5e5e5;
  overflow: hidden;

  &:active {
    outline: none !important;
    outline-offset: 0 !important;
  }

  &:hover .change-pic-overlay {
    opacity: 1;
  }
}

.change-pic-overlay {
  opacity: 0;
  display: block;
  color: white;
  height: 100%;
  width: 100%;
  text-align: center;
  font-weight: 700;
  font-size: 1.5rem;
  padding-top: 1.215rem;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.397);
  transition: all .2s ease-in-out;
}

.profile-save {
  font-weight: 700;
  text-transform: uppercase;
  font-size: .8rem;
  padding: 0.55rem 1.6rem;
}

</style>
