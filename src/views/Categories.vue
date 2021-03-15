<template>
  <main role="main" class="pb-5">

    <PageHeader title="Productos por categoría">
      <InlineFilter label="Filtrar por cantidad de productos:" />
    </PageHeader>

    <div v-if="!loading && array && array.length" class="container content">
      <div id="options" class="row">
        <TextFilter />
        <SortButtons type="categories" @selection="sortProducts" />
      </div>

      <div id="listing" class="row">

        <ProductCard
          v-for="(category, index) in categories"
          :key="index"
          :name="processContent(category.name)"
          :description="processContent(category.description)"
          :soldCount="category.productCount"
          :image="category.imgSrc"
          :link="`/category/${category.name.toLowerCase()}`"
        />

        <NoResultsCard
          v-if="noCategories"
          message="No se econtraron categorías que cumplan con ese criterio."
          @closed="clearFilters"
        />

      </div>
    </div>

    <SpinnerLoading v-if="loading" />
  </main>
</template>

<script>
import axios from 'axios';

import { computed } from 'vue';
import { useStore } from 'vuex';

import PageHeader from '../components/PageHeader.vue';
import InlineFilter from '../components/InlineFilter.vue';
import TextFilter from '../components/TextFilter.vue';
import SortButtons from '../components/SortButtons.vue';
import ProductCard from '../components/ProductCard.vue';
import NoResultsCard from '../components/NoResultsCard.vue';
import SpinnerLoading from '../components/SpinnerLoading.vue';

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
    SpinnerLoading
  },
  setup() {
    const store = useStore();
    const filter = computed(() => store.state.filter);

    // ensure to work with default values at page load
    store.dispatch('resetRangeFilter');
    store.state.filter.query = '';

    return { store, filter };
  },
  data() {
    return {
      loading: true,
      array: null,
      sortedArray: null,
      error: null,
    }
  },
  computed: {
    categories() {
      const query = this.filter.query.trim();
      const array = (this.sortedArray || this.array).filter(category => {
        return (
          category.productCount >= this.filter.range.min && category.productCount <= this.filter.range.max
          && !(query && !productMatchesSearch(category.name + category.description, query))
        )
      });
      return array || [];
    },
    noCategories() {
      return this.categories.length < 1;
    },
  },

  mounted() {
    axios.get('/api/categories').then(response => {
      this.array = response.data;
      this.loading = false;
    });
  },

  methods: {

    /* fetchData() { */
    /*   this.loading = true; */
    /*   return fetch('https://japdevdep.github.io/ecommerce-api/category/all.json', { */
    /*     method: 'GET', */
    /*   }) */
    /*   .then(res => { */
    /*     if (!res.ok) { */
    /*       const error = new Error(res.statusText); */
    /*       error.json = error.json(); */
    /*       throw error; */
    /*     } */

    /*     return res.json(); */
    /*   }) */
    /*   .then(json => this.data = json) */
    /*   .catch(err => { */
    /*     this.error = err; */

    /*     if (err.json) { */
    /*       return err.json.then(json => { */
    /*         this.error.message = json.message; */
    /*       }); */
    /*     } */
    /*   }) */
    /*   .then(() => this.loading = false); */
    /* }, */

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
      this.sortedArray = [...this.array].sort((a, b) => {
         switch (criteria) {
          case 'asc':     return a.name < b.name ? -1 : 1;
          case 'desc':    return a.name > b.name ? -1 : 1;
          case 'count': return b.productCount - a.productCount;
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
