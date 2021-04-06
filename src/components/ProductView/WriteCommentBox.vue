<template>
  <div id="write-comment">

    <div v-if="!user" class="alert-light">
      <router-link :to="{ name: 'Login', params: { msg: 'Inicia sesión para calificar este producto' } }" class="alert-link">Inicia sesión</router-link> para dejar el tuyo.
    </div>

    <div v-if="user">
      <h5>Agregá el tuyo</h5>
      <div class="row">
        <div style="width: 100%;">
          <textarea v-model="comment.content" :placeholder="`${user.username}, calificá este producto!`"></textarea>
          <div class="send-group">
            <div class="btn-group">
              <div id="rate-stars" @click="clickedStar" class="btn-group d-flex flex-row">
                <div v-if="error.missingScore" id="rate-required">Requerido <span class="fas fa-arrow-right"></span></div>
                <label v-for="index in 5" :key="index" @mouseover="hoverStar" @mouseout="hoverReset">
                  <input type="radio" name="rating" :value="index" autocomplete="off"  required>
                  <i class="fas fa-star" :class="starClassFor(index)"></i>
                </label>
              </div>
            </div>
            <button @click="sendComment" class="btn btn-primary" type="button">Publicar comentario</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'WriteCommentBox',
  data() {
    return {
      hovered: 0,
      comment: {
        user: null,
        content: '',
        score: null,
      },
      error: {
        missingScore: null,
      },
    }
  },

  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {

    starClassFor(index) {
      return (index <= this.comment.score && 'filled') || (index <= this.hovered && 'soft-filled');
    },

    hoverStar(e) {
      const hovered = e.target.previousSibling.value;
      if (!hovered) return;
      this.hovered = hovered;
    },

    hoverReset() {
      this.hovered = 0;
    },

    clickedStar(e) {
      if (e.target.tagName.toUpperCase() !== 'INPUT') return;
      this.error.missingScore = null;
      const selected = e.target.value;
      this.comment.score = this.comment.score != selected ? selected : null;
    },

    sendComment() {
      if (this.user && this.comment.content && this.comment.score) {
        this.comment.user = this.user.username;
        this.comment.avatar = this.user.picture;

        this.$emit('new-comment', this.comment);
      } else if (!this.comment.score) {
        this.error.missingScore = true;
      }
    },

  },
}
</script>

<style lang="scss" scoped>

#write-comment {
  margin: 0 auto;
  padding: 1rem;
}

h5 {
  margin-bottom: 1rem;
}

.alert-light {
  text-align: center;
}

.send-group {
  margin-top: 0.9rem;
  text-align: right;
}

.send-group .btn-group {
  margin-right: 10px;
  margin-top: 5px;
}

button {
  padding: 0.7rem 1.6rem;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
}

textarea {
  resize: none;
  padding: 20px;
  height: 130px;
  width: 100%;
  border: 1px solid #f2f2f2;
  border-radius: 4px;
}

textarea:focus {
  box-shadow: 0 0 4px #0000000f;
}

.textarea-alert {
  box-shadow: 0 0 4px #b12f2f81 !important;
}

#rate-required {
  padding: 0px 10px;
  margin-top: 3px;
  margin-right: 0px;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: bold;
  color: #c85d5d;
  /* opacity: 0; */
  transition: opacity 500ms;
}

#rate-stars {
  display: flex;
}

#rate-stars .fa-star {
  color: #8d8d8d;
  cursor: pointer;
}

#rate-stars input {
  display: none;
}

.filled {
  color: #2196f3 !important;
}

.soft-filled {
  color: #8baec9 !important;
}


</style>

