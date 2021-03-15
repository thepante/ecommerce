<template>
  <div v-if="!loading" class="comments-section p-3 p-sm-5">
    <div v-if="comments.length" id="comments">
      <CommentCard
        v-for="(comment, index) in comments"
        :key="index"
        :username="comment.user"
        :content="comment.description"
        :score="comment.score"
        :dateTime="comment.dateTime"
        :avatar="comment.avatar"
        :id="comment._id"
      />
    </div>

    <div v-else class="alert-warning alert-dismissible p-4 fade show col" role="alert">
      <strong>No hay comentarios</strong>
    </div>

    <hr>
    <WriteCommentBox @new-comment="publishComment" />
  </div>
</template>

<script>
import axios from 'axios';

import CommentCard from '../components/CommentCard.vue';
import WriteCommentBox from '../components/WriteCommentBox.vue';

export default {
  name: 'CommentsSection',
  components: { CommentCard, WriteCommentBox },
  props: {
    productid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      comments: null,
    }
  },
  mounted() {
    axios.get(`/api/comments/${this.productid}`).then(response => {
      this.comments = response.data;
      this.loading = false;
    });
  },
  methods: {

    publishComment({user, content, score, avatar}) {
      const newComment = {
        user,
        score,
        avatar,
        description: content,
        productId: this.productid,
        dateTime: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      }

      /* this.comments.push(newComment); */

      fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      }).then(res => res.ok ? res.json() : null)
        .then(res => {
          newComment._id = res;
          this.comments.push(newComment);
        })
        .catch(err => console.log('response error:', err));

    },

  },
}
</script>

<style lang="scss" scoped>

.comments-section {
  border-radius: .3rem;
  box-shadow: 0 3px 7px rgba(154,160,185,.05), 0 10px 40px rgba(166,173,201,.1);
}

@media (min-width: 768px) {
  .comments-section {
    margin: 1rem 3rem;

    .comment-content {
      margin-left: 4.75rem !important;
    }
  }
}

hr {
  margin-bottom: 2.25rem;
}

.alert-warning {
  position: relative;
  text-align: center;
}

</style>

