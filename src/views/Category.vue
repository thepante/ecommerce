<template>
  <main role="main" class="pb-5">

    <PageHeader :title="category">
      <InlineFilter v-model="filter" label="Mostrando precios desde:" />
    </PageHeader>

    <div class="container content">
      <div id="options" class="row">
        <TextFilter v-model="query"/>
        <SortButtons type="products" @selection="sortProducts" />
      </div>

      <div id="listing" class="row">

        <template v-if="!loading">
          <ProductCard
            v-for="(product, index) in products"
            :key="index"
            :name="processContent(product.name)"
            :description="processContent(product.briefDesc)"
            :currency="product.currency"
            :cost="product.cost"
            :soldCount="product.soldCount"
            :image="product.images[0]"
            :link="`/product/${product._id + product.name.asPath()}`"
          />

          <NoResultsCard
            v-if="noProducts"
            message="No se econtraron productos que cumplan con ese criterio."
            @closed="clearFilters"
          />
        </template>

        <template v-else>
          <ContentLoader
            v-for="index in 6"
            :key="index"
            width="1032"
            height="182"
          >
            <rect x="0" y="2" rx="2" ry="2" width="235" height="154" />
            <rect x="263" y="10" rx="2" ry="2" width="168" height="23" />
            <rect x="263" y="45" rx="0" ry="0" width="88" height="20" />
            <rect x="263" y="80" rx="0" ry="0" width="495" height="18" />
            <rect x="935" y="12" rx="0" ry="0" width="80" height="12" />
          </ContentLoader>
        </template>

      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

import { useRoute } from 'vue-router';
import { ContentLoader } from 'vue-content-loader';

import PageHeader from '../components/General/PageHeader.vue';
import InlineFilter from '../components/ListingView/InlineFilter.vue';
import TextFilter from '../components/ListingView/TextFilter.vue';
import SortButtons from '../components/ListingView/SortButtons.vue';
import ProductCard from '../components/ListingView/ProductCard.vue';
import NoResultsCard from '../components/ListingView/NoResultsCard.vue';

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
    TextFilter,
    ContentLoader,
  },

  data() {
    return {
      loading: true,
      array: null,
      sortedArray: null,
      query: '',
      filter: {
        min: 0,
        max: Infinity,
      },
    }
  },

  setup() {
    const route = useRoute();
    const category = route.params.category.capitalized();
    return { category };
  },

  mounted() {
    axios.get(`/api/products?catName=${this.category}`)
      .then(response => {
        this.array = response.data.products;
        this.loading = false;
        document.title = `Categoría: ${this.category} - ${this.$store.state.title}`;
      })
      .catch(error => {
        if (error.response.status === 404) {
          this.$router.push({ name: 'NotFound' });
        }
        return console.log("error:", error.response);
      });
  },

  computed: {
    products() {
      const query = this.query.trim();
      const array = (this.sortedArray || this.array).filter(product => {
        return (
          product.cost >= this.filter.min && product.cost <= this.filter.max
          && !(query && !productMatchesSearch(product.name + product.briefDesc, query))
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
      this.query = '';
    },

    clearFilters() {
      this.clearSearch();
      this.filter = {
        min: 0,
        max: Infinity,
      };
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
      if (this.query) {
        const query = this.query.trim();
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
