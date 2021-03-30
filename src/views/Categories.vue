<template>
  <main role="main" class="pb-5">

    <PageHeader title="Productos por categoría">
      <InlineFilter v-model="filter" label="Filtrar por cantidad de productos:" />
    </PageHeader>

    <div class="container content">
      <div id="options" class="row">
        <TextFilter v-model="query" />
        <SortButtons type="categories" @selection="sortProducts" />
      </div>

      <div id="listing" class="row">

        <template v-if="!loading">
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
            <rect x="263" y="50" rx="0" ry="0" width="495" height="18" />
            <rect x="935" y="12" rx="0" ry="0" width="80" height="12" />
          </ContentLoader>
        </template>

      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

import { ContentLoader } from 'vue-content-loader';

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
    TextFilter,
    ContentLoader,
  },
  data() {
    return {
      loading: true,
      array: null,
      sortedArray: null,
      error: null,
      query: '',
      filter: {
        min: 0,
        max: Infinity,
      },
    }
  },
  computed: {
    categories() {
      const query = this.query.trim();
      const array = (this.sortedArray || this.array).filter(category => {
        return (
          category.productCount >= this.filter.min && category.productCount <= this.filter.max
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
