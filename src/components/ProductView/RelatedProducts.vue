<template>
  <div id="related-products">
    <template v-if="products">
      <RelatedProductCard
        v-for="(product, index) in products"
        :key="index"
        :name="product.name"
        :description="product.briefDesc"
        :img="product.imgSrc"
        :currency="product.currency"
        :cost="product.cost"
        :soldCount="product.soldCount"
        :id="product._id"
      />
    </template>
    <template v-else>
      <ContentLoader
        v-for="index in 2"
        :key="index"
        width="296"
        height="93"
      >
        <rect x="156" y="18" rx="2" ry="2" width="128" height="18" />
        <rect x="208" y="42" rx="2" ry="2" width="75" height="15" />
        <rect x="213" y="66" rx="0" ry="0" width="70" height="8" />
        <rect x="214" y="81" rx="0" ry="0" width="1" height="0" />
        <rect x="0" y="0" rx="0" ry="0" width="294" height="2" />
        <rect x="0" y="91" rx="0" ry="0" width="294" height="2" />
        <rect x="0" y="0" rx="0" ry="0" width="2" height="93" />
        <rect x="292" y="0" rx="0" ry="0" width="2" height="93" />
      </ContentLoader>
    </template>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader';
import RelatedProductCard from './RelatedProductCard.vue';

export default {
  name: 'RelatedProducts',
  components: { RelatedProductCard, ContentLoader },
  props: {
    products: {
      type: Array,
    },
  },
}
</script>

<style lang="scss" scoped>

#related-products {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

#related-products > div {
  min-width: 300px;
  max-width: 400px;
  max-height: 100px;
  box-shadow: 0 2px 1px -6px rgba(60,75,100,.12), 0 1px 3px 0 rgba(60,75,100,.2);
}

</style>
