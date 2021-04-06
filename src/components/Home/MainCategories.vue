<template>
  <div class="container py-5">
    <div class="row">

      <template v-if="categories">
        <CategoryCard v-for="(category, index) in categories"
          :key="index"
          :name="category.name"
          :description="category.description"
          :image="category.image"
          :count="category.count"
          :route="category.name"
        />
      </template>

      <template v-else>
        <ContentLoader v-for="index in 6"
          :key="index"
          class="col-lg-6"
          width="555"
          height="312"
        >
          <rect x="30" y="56" rx="2" ry="2" width="120" height="22" />
          <rect x="30" y="98" rx="0" ry="0" width="215" height="16" />
          <rect x="214" y="81" rx="0" ry="0" width="1" height="0" />
          <rect x="935" y="12" rx="0" ry="0" width="80" height="12" />
          <rect x="30" y="124" rx="0" ry="0" width="180" height="16" />
          <rect x="0" y="0" rx="5" ry="5" width="555" height="4" />
          <rect x="0" y="288" rx="5" ry="5" width="555" height="4" />
          <rect x="0" y="0" rx="5" ry="5" width="4" height="292" />
          <rect x="551" y="0" rx="5" ry="5" width="4" height="292" />
        </ContentLoader>
      </template>

    </div>
    <br>
    <div class="row">
      <router-link type="button" class="btn btn-light btn-lg btn-block" to="categories">Ver todas</router-link>
    </div>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader';
import CategoryCard from './CategoryCard.vue';

export default {
  name: 'MainCategories',
  components: { CategoryCard, ContentLoader },
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
