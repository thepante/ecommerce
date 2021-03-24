<template>
  <div class="container">
    <div id="product-info" class="card">
      <div class="row">
        <aside class="col-md-6 border-right mr-3 mr-md-0 pr-0">
          <article class="gallery-wrap">
            <ImageSlideshow :images="product ? product.images : null" :id="productid" />
          </article>
        </aside>
        <aside class="col-md-6">
          <article class="card-body p-3 p-sm-5 p-md-3 p-lg-5">
            <ProductInfoSection :product="product" />
          </article>
        </aside>
      </div>
    </div>

    <div class="text-center p-4">
      <h4>Comentarios</h4>
    </div>

    <CommentsSection :key="productid" :productid="productid" />

    <div class="text-center p-4">
      <h5>Productos relacionados</h5>
    </div>

    <RelatedProducts :key="productid" :products="product ? product.related : null" />

  </div>
</template>

<script>
import axios from 'axios';
import { useRoute } from 'vue-router';

import ImageSlideshow from '../components/ImageSlideshow.vue';
import ProductInfoSection from '../components/ProductInfoSection.vue';
import CommentsSection from '../components/CommentsSection.vue';
import RelatedProducts from '../components/RelatedProducts.vue';

export default {
  name: 'ProductInfo',
  components: {
    ImageSlideshow,
    ProductInfoSection,
    CommentsSection,
    RelatedProducts,
  },
  data() {
    return {
      loading: true,
      productid: null,
      product: null,
      comments: null,
    }
  },

  mounted() {
    const route = useRoute();
    const productID = route.params.id;
    this.productid = productID;

    axios.get(`/api/product/${productID}`)
      .then(response => {
        this.product = response.data;
        this.loading = false;
        document.title = `${this.product.name} · ${this.product.currency} ${this.product.cost} - ${this.$store.state.title}`;
      })
      .catch(error => {
        if (error.response.status === 404) {
          this.$router.push({ name: 'NotFound' });
        }
        return console.log("error:", error.response);
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

