<template>
  <div>
    <HomeHeader />
    <MainCategories :categories="categories" />
  </div>
</template>

<script>
import axios from 'axios';

import HomeHeader from '../components/HomeHeader.vue';
import MainCategories from '../components/MainCategories.vue';

export default {
  name: 'Home',
  components: { HomeHeader, MainCategories },
  data() {
    return {
      loading: true,
      categories: null,
    }
  },

  mounted() {
    axios.get('/api/home').then(response => {
      this.categories = response.data.categories;
      this.loading = false;
    });

  },
}
</script>
