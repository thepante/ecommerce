<template>
  <h3 class="mb-3">{{ name }}</h3>
  <p class="price-detail-wrap">
    <span class="price h4">
      <span class="currency badge badge-light">{{ currency }} {{ cost.asPrice() }}</span>
    </span>
  </p>
  <dl class="item-property">
    <dd>
      <p v-html="description.replace(/\\n/g, '<br>')"></p>
    </dd>
  </dl>

  <div class="row">
    <dl class="col col-md-12 mb-1 param param-feature">
      <dt>Categoría</dt>
      <dd>{{ category.name }}</dd>
    </dl>
    <dl class="col mb-0 param param-feature">
      <dt>Vendidos</dt>
      <dd>{{ soldCount }}</dd>
    </dl>
  </div>
  <hr>
  <div class="btn-cart">
    <a href="#" class="btn btn-primary text-uppercase">
      Agregar al carrito <i class="fas fa-shopping-cart"></i>
    </a>
  </div>

</template>

<script>
export default {
  name: 'ProductInfoSection',
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
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
    category: {
      type: String,
      required: true,
    },
    soldCount: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>

h3 {
  display: inline-table;
  line-height: 1rem;
  font-weight: bold;
  color: #202020;

  &::after {
    position: relative;
    display: inline-block;
    content: '';
    width: 100%;
    height: 10px;
    background-color: #ffdc9ae7;
    left: 0;
  }
}

.btn-cart {
  text-align: center;

  a {
    padding: 0.7rem 1.6rem;
    font-size: 0.7rem;
    font-weight: bold;
  }

}

</style>

