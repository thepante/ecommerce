<template>
  <div class="col-lg-6 p-2 pb-4">
    <div class="cat-card">
      <router-link :to="{ name: 'Category', params: { category: route.toLowerCase() } }">
        <div class="img-container">
          <img :src="require(`@/${image}`)" :alt="name">
        </div>
        <div class="info">
          <h4>{{ name }}</h4>
          <p v-html="description"></p>
        </div>
        <span class="badge badge-light">{{ count }} publicaciones</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryCard',
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    count: {
      type: String,
      required: true
    }
  },
}
</script>

<style lang="scss" scoped>

.cat-card {
  position: relative;
  box-shadow: 3px 6px 6px #c0c0c069;
  border-radius: 4px;
  border: 1px solid #b3b3b38c;
  height: 290px;
  max-width: 550px;
  overflow: hidden;
  margin: 0 auto;
  z-index: 100;

  .info {
    position: absolute;
    top: 0;
    left: 0;
    padding: 45px 30px;
    z-index: 999;
  }

  .img-container {
    width: 555px;
    transform: translate3d(0px, 0px, 0px);
  }

  img {
    width: 555px;
    -webkit-transition: all .4s ease-out 0s;
    -moz-transition: all .4s ease-out 0s;
    -ms-transition: all .4s ease-out 0s;
    -o-transition: all .4s ease-out 0s;
    transition: all .4s ease-out 0s;
  }

  h4 {
    font-size: 24px;
    font-weight: 700;
    line-height: 40px;
  }

  p {
    color: #777;
    font-size: 16px;
    font-weight: 500;
    transition: all .4s ease-out 0s;
  }

  a {
    position: absolute;
    display: block;
    float: left;
    width: 100%;
    height: 100%;
    color: inherit;
    z-index: 9999;

    &:hover {
      text-decoration: none;
    }
  }

  span {
    position: absolute;
    bottom: 0.3rem;
    margin: 1rem 2rem;
    padding: 5px 10px;
    font-size: 0.8rem;
    box-shadow: 0 0 0.3rem #0000003a;
    border-radius: 2rem;
    transition: all 0.3s ease-out;
    opacity: 0;
  }

  &:hover img {
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -ms-transform: scale(1.2);
    -o-transform: scale(1.2);
    transform: scale(1.2);
    filter: saturate(200%);
  }

  &:hover span {
    bottom: 0;
    opacity: 1;
  }

}

</style>
