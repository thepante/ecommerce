<template>
  <div id="related-products">
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
  </div>
</template>

<script>
import RelatedProductCard from '../components/RelatedProductCard.vue';

export default {
  name: 'RelatedProducts',
  components: { RelatedProductCard },
  props: {
    products: {
      type: Array,
      required: true,
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
