<template>
  <main v-if="!loading" role="main" class="pb-5">

    <PageHeader :title="category">
      <InlineFilter label="Mostrando precios desde:" />
    </PageHeader>

    <div class="container content">
      <div id="options" class="row">
        <TextFilter />
        <SortButtons type="products" @selection="sortProducts" />
      </div>

      <div id="listing" class="row">

        <ProductCard
          v-for="(product, index) in products"
          :key="index"
          :name="processContent(product.name)"
          :description="processContent(product.briefDesc)"
          :currency="product.currency"
          :cost="product.cost"
          :soldCount="product.soldCount"
          :image="product.images[0]"
          :link="`/product/${product._id}`"
        />

        <NoResultsCard
          v-if="noProducts"
          message="No se econtraron productos que cumplan con ese criterio."
          @closed="clearFilters"
        />

      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import PageHeader from '../components/PageHeader.vue';
import InlineFilter from '../components/InlineFilter.vue';
import TextFilter from '../components/TextFilter.vue';
import SortButtons from '../components/SortButtons.vue';
import ProductCard from '../components/ProductCard.vue';
import NoResultsCard from '../components/NoResultsCard.vue';

// define if products matches with text query
const productMatchesSearch = (content, query) => ~content.toLowerCase().indexOf(query.toLowerCase());


export default {
  name: 'Products',
  components: {
    ProductCard,
    NoResultsCard,
    PageHeader,
    InlineFilter,
    SortButtons,
    TextFilter
  },
  setup() {
    const store = useStore();
    const filter = computed(() => store.state.filter);

    /* // ensure to work with default values at page load */
    /* store.dispatch('resetRangeFilter'); */
    /* store.state.filter.query = ''; */
    return { store, filter };
  },
  data() {
    return {
      loading: true,
      array: null,
      sortedArray: null,
    }
  },

  mounted() {
    const route = useRoute();
    const category = route.params.category;
    this.category = category.capitalized();

    axios.get(`/api/products?catName=${category}`).then(response => {
      this.array = response.data.products;
      this.loading = false;
      document.title = `Categoría: ${this.category} - ${this.$store.state.title}`;
    });
  },

  computed: {
    products() {
      const query = this.filter.query.trim();
      const array = (this.sortedArray || this.array).filter(product => {
        return (
          product.cost >= this.filter.range.min && product.cost <= this.filter.range.max
          && !(query && !productMatchesSearch(product.name + product.description, query))
        )
      });
      return array || [];
    },
    noProducts() {
      return this.products.length < 1;
    }
  },

  methods: {

    resetSort() {
      this.sortedArray = null;
    },

    clearSearch() {
      this.filter.query = '';
    },

    clearFilters() {
      this.clearSearch();
      this.store.dispatch('resetRangeFilter');
    },

    sortProducts(criteria) {
      if (criteria == 'clear') this.resetSort();
      this.sortedArray = [...this.array].sort((a, b) => {
         switch (criteria) {
          case 'asc':     return a.cost - b.cost;
          case 'desc':    return b.cost - a.cost;
          case 'count': return b.soldCount - a.soldCount;
        }
      });
    },

    // if needed, highlights query that matches in product name/description
    processContent(content) {
      if (this.filter.query) {
        const query = this.filter.query.trim();
        let result = '';
        let scan = true;
        let from = 0;
        let i = 0;

        while (scan) {
          let rest = content.substr(from);
          i = rest.toLowerCase().indexOf(query.toLowerCase());

          if (i == -1) {
            result += rest;
            scan = false;
          } else {
            result += rest.substr(0, i) + `<span class="highlight">${rest.substr(i, query.length)}</span>`;
            from += i + query.length;
          }
        }

        return result;
      } else {
        return content;
      }
    },

  },
}
</script>

<style lang="scss" scoped>

#listing {
  padding: 2.5rem;
  border-radius: .3rem;
  background-color: #fff;
  box-shadow: 0 3px 7px rgba(154,160,185,.05), 0 10px 40px rgba(166,173,201,.1);
}

#options {
  margin-bottom: 1rem;
}

@media (max-width: 767px) {
  #options {
    text-align: center !important;
  }
}

@media (min-width: 768px) {
  #options .offset-md-4 {
    text-align: right !important;
  }
}

</style>