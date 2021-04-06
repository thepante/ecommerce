<template>
  <template v-if="product">
    <h3 class="mb-3">{{ product.name }}</h3>
    <p class="price-detail-wrap">
      <span class="price h4">
        <span class="currency badge badge-light">{{ product.currency }} {{ product.cost.asPrice() }}</span>
      </span>
    </p>
    <dl class="item-property">
      <dd>
        <p v-html="product.description.replace(/\\n/g, '<br>')" />
      </dd>
    </dl>
    <div class="row">
      <dl class="col col-md-12 mb-1 param param-feature">
        <dt>Categoría</dt>
        <dd>{{ product.category.name }}</dd>
      </dl>
      <dl class="col mb-0 param param-feature">
        <dt>Vendidos</dt>
        <dd>{{ product.soldCount }}</dd>
      </dl>
    </div>
  </template>

  <template v-else>
    <ContentLoader viewBox="0 0 445 250">
      <rect x="0" y="2" rx="3" ry="3" width="250" height="47" />
      <rect x="0" y="63" rx="3" ry="3" width="113" height="28" />
      <rect x="0" y="117" rx="3" ry="3" width="426" height="18" />
      <rect x="0" y="147" rx="3" ry="3" width="400" height="18" />
      <rect x="0" y="176" rx="3" ry="3" width="425" height="18" />
      <rect x="0" y="207" rx="3" ry="3" width="380" height="18" />
    </ContentLoader>
    <div class="row">
      <dl class="col col-md-12 mb-3 param param-feature">
        <ContentLoader width="120" height="30">
          <rect x="0" y="2" rx="3" ry="3" width="120" height="28" />
        </ContentLoader>
      </dl>
      <dl class="col mb-0 param param-feature">
        <ContentLoader width="120" height="30">
          <rect x="0" y="2" rx="3" ry="3" width="120" height="28" />
        </ContentLoader>
      </dl>
    </div>
  </template>

  <hr>
  <div class="btn-cart">
    <a href="#" class="btn btn-primary text-uppercase">
      Agregar al carrito <i class="fas fa-shopping-cart"></i>
    </a>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader';

export default {
  name: 'ProductInfoSection',
  components: { ContentLoader },
  props: {
    product: {
      type: Object,
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

