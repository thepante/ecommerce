<template>
  <div :id="id" class="row mb-5">
    <div class="col-sm-10">
      <img :src="avatar || require('@/assets/user.png')" class="avatar rounded-circle">
      <h5 class="user-name font-weight-bold">{{ username }}</h5>
      <ul class="rating">
        <li v-for="i in 5" :key="i">
          <i class="fas fa-star" :class="i <= score && 'blue-text'"></i>
        </li>
      </ul>
    </div>
    <div class="col-sm-10 comment-content">
      <p class="dark-grey-text article">{{ content }}</p>
      <div class="card-data comment-date font-small grey-text">
        <span :title="dateTime">{{ date }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentCard',
  props: {
    username: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    dateTime: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  computed: {

    date() {
      const date = this.dateTime;
      return date.slice(8, 10) +'/'+ date.slice(5, 7) +'/'+ date.slice(0, 4)
    },

  },

  methods: {


  },
}
</script>

<style lang="scss" scoped>

.avatar {
  width: 3.75rem;
  height: 3.75rem;
  float: left;
  margin-right: 1rem;
}

@media (min-width: 768px) {
  #comments-section {
    margin: 1rem 3rem;
  }

  .comment-content {
    margin-left: 4.75rem !important;
  }
}

.rounded-circle {
  border-radius: 50% !important;
}
.rating {
  color: #8d8d8d;
  list-style-type: none;
  padding: 0;
}

.rating li,
.side-nav .social li {
  display: inline-block;
}

.blue-text {
  color: #2196f3 !important;
}

.comment-date {
  font-size: 0.9rem;
  color: #9e9e9e !important;
}

.dark-grey-text {
  font-size: 0.9rem;
}



</style>

