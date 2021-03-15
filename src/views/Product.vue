<template>
  <div v-if="!loading" class="container">
    <div id="product-info" class="card">
      <div class="row">
        <aside class="col-md-6 border-right mr-3 mr-md-0 pr-0">
          <article class="gallery-wrap">
            <ImageSlideshow :images="product.images" />
          </article>
        </aside>
        <aside class="col-md-6">
          <article class="card-body p-3 p-sm-5 p-md-3 p-lg-5">
            <ProductInfoSection
              :name="product.name"
              :description="product.description"
              :currency="product.currency"
              :cost="product.cost"
              :category="product.category"
              :soldCount="product.soldCount"
            />
          </article>
        </aside>
      </div>
    </div>

    <div class="text-center p-4">
      <h4>Comentarios</h4>
    </div>

    <CommentsSection :productid="product._id" />

    <div class="text-center p-4">
      <h5>Productos relacionados</h5>
    </div>

    <RelatedProducts :products="product.related" />

  </div>
  <SpinnerLoading v-if="loading" />
</template>

<script>
import axios from 'axios';
import { useRoute } from 'vue-router';

import ImageSlideshow from '../components/ImageSlideshow.vue';
import ProductInfoSection from '../components/ProductInfoSection.vue';
import CommentsSection from '../components/CommentsSection.vue';
import RelatedProducts from '../components/RelatedProducts.vue';
import SpinnerLoading from '../components/SpinnerLoading.vue';

export default {
  name: 'ProductInfo',
  components: {
    ImageSlideshow,
    ProductInfoSection,
    CommentsSection,
    RelatedProducts,
    SpinnerLoading,
  },
  data() {
    return {
      loading: true,
      product: null,
      comments: null,
    }
  },

  mounted() {
    const route = useRoute();
    const productID = route.params.id;

    axios.get(`/api/product/${productID}`).then(response => {
      this.product = response.data;
      this.loading = false;
      document.title = `${this.product.name} · ${this.product.currency} ${this.product.cost} - ${this.$store.state.title}`;
    });

  },
}
</script>

<style lang="scss" scoped>

.container {
  margin-top: 2rem;
}

.card {
	position: relative;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-direction: column;
	flex-direction: column;
	min-width: 0;
	word-wrap: break-word;
	background-color: #fff;
	background-clip: border-box;
	border: 1px solid rgba(0,0,0,.125);
	border-radius: .25rem;
}

#product-info {
  margin-bottom: 2rem;
  box-shadow: 0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2);
}

#product-info article {
  padding-bottom: 1rem !important;
}

</style>

