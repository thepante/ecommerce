<template>
  <div class="container py-5">
    <div class="row">

      <CategoryCard v-for="(category, index) in categories"
        :key="index"
        :name="category.name"
        :description="category.description"
        :image="category.image"
        :count="category.count"
        :route="category.name"
      />

    </div>
    <br>
    <div class="row">
      <router-link type="button" class="btn btn-light btn-lg btn-block" to="categories">Ver todas</router-link>
    </div>
  </div>
</template>

<script>
import CategoryCard from './CategoryCard.vue';

export default {
  name: 'MainCategories',
  components: { CategoryCard },
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
