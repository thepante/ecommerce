<template>
  <div class="card m-2">
    <div class="no-gutters">
      <router-link :to="`./${id + name.asPath()}`" class="stretched-link" />
      <img class="rel-thumbnail" :src="require(`@/img/product/${id}/${img}`)" />
      <div class="description">{{ description }}</div>
      <div class="info">
        <h5>{{ name }}</h5>
        <p class="badge badge-light">{{ currency }} {{ cost.asPrice() }}</p>
        <p class="card-text"><small class="text-muted">{{ soldCount }} vendidos</small></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelatedProduct',
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    soldCount: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>

img {
  float: left;
  max-height: 100px;
  border-radius: 2px 0 0 2px;
  -webkit-mask-image: -webkit-linear-gradient(right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);
  mask-image: linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0));
}

.info {
  position: absolute;
  right: 0px;
  text-align: right;
  padding-top: 0.4rem;
  padding-right: 0.9rem;
}

h5 {
  font-weight: 700;
  margin-bottom: 0px !important;
}

.card {
  overflow: hidden;

  img {
    opacity: 1;
    transition-duration: 0.6s;
  }

  .description {
    opacity: 0;
    transition-duration: 0.6s;
  }

  &:hover {
    img {
      opacity: 0.3;
      transition: opacity;
      transition-duration: 0.6s;
    }
    .description {
      opacity: 1;
      transition: opacity;
      transition-duration: 0.6s;
    }
  }

}

.description {
  position: absolute;
  left: 0;
  float: left;
  height: 100%;
  max-width: 160px;
  padding-left: 10px;
  padding-top: 5px;
  font-size: 0.8rem;
  color: #353535;
}

</style>
