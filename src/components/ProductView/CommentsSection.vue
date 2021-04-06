<template>
  <div class="comments-section p-3 p-sm-5">
    <template v-if="!loading">
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
    </template>

    <template v-else>
      <ContentLoader
        v-for="index in 2"
        :key="index"
        width="620" height="170"
      >
        <circle cx="30" cy="30" r="30" />
        <rect x="77" y="6" rx="2" ry="2" width="115" height="18" />
        <rect x="77" y="38" rx="2" ry="2" width="80" height="10" />
        <rect x="77" y="76" rx="0" ry="0" width="420" height="15" />
        <rect x="77" y="100" rx="0" ry="0" width="380" height="15" />
      </ContentLoader>
    </template>
    <hr>
    <WriteCommentBox @new-comment="publishComment" />
  </div>
</template>

<script>
import axios from 'axios';

import { ContentLoader } from 'vue-content-loader';
import CommentCard from './CommentCard.vue';
import WriteCommentBox from './WriteCommentBox.vue';

export default {
  name: 'CommentsSection',
  components: { CommentCard, WriteCommentBox, ContentLoader },
  props: {
    productid: {
      type: String,
    },
  },
  data() {
    return {
      loading: true,
      comments: null,
    }
  },
  mounted() {
    if (this.productid) {
      axios.get(`/api/comments/${this.productid}`).then(response => {
        this.comments = response.data;
        this.loading = false;
      });
    }
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

