<template>
  <div class="col-md-4 offset-md-4">

    <div v-if="type == 'products'" class="btn-group btn-group-toggle" data-toggle="buttons">
      <label v-if="sortedBy" @click="select('clear')" class="btn btn-dark" title="Quitar preferencia" clear-sort>
        <input type="radio" name="options" autocomplete="off"><i class="fas fa-times-circle"></i>
      </label>
      <label @click="select('asc')" class="btn btn-dark" :class="sortedBy == 'asc' && 'active focus'" title="Ordenar de menor a mayor precio">
        <input type="radio" name="options" autocomplete="off"><i class="fas fa-sort-numeric-down"></i>
      </label>
      <label @click="select('desc')" class="btn btn-dark" :class="sortedBy == 'desc' && 'active focus'" title="Ordenar de mayor a menor precio">
        <input type="radio" name="options" autocomplete="off"><i class="fas fa-sort-numeric-down-alt"></i>
      </label>
      <label @click="select('count')" class="btn btn-dark" :class="sortedBy == 'count' && 'active focus'">
        <input type="radio" name="options" autocomplete="off"><i class="fas fa-sort-amount-down mr-1"></i>Relevancia
      </label>
    </div>

    <div v-if="type == 'categories'" class="btn-group btn-group-toggle" data-toggle="buttons">
      <label @click="select('asc')" class="btn btn-dark" :class="(sortedBy == 'asc' || !sortedBy) && 'active'">
        <input type="radio" name="options" autocomplete="off" checked>A-Z
      </label>
      <label @click="select('desc')" class="btn btn-dark" :class="sortedBy == 'desc' && 'active'">
        <input type="radio" name="options" autocomplete="off">Z-A
      </label>
      <label @click="select('count')" class="btn btn-dark" :class="sortedBy == 'count' && 'active'">
        <input type="radio" name="options" autocomplete="off"><i class="fas fa-sort-amount-down mr-1"></i>Cant.
      </label>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SortButtons',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sortedBy: null,
    }
  },
  methods: {
    select(selected) {
      this.$emit('selection', selected);
      this.sortedBy = selected != 'clear' ? selected : null;
    },
  },
}
</script>

<style lang="scss" scoped>

.btn-group {
  box-shadow: .1rem .2rem .5rem #c0c0c07d;

  .btn {
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-dark {
    background-color: #4f4343;
    border-color: #393131;
  }

  .btn-dark:not(:disabled):not(.disabled).active,
  .btn-dark:not(:disabled):not(.disabled):active,
  .show > .btn-dark.dropdown-toggle {
    background-color: #241d1d;
    border-color: #171a1d;
  }
}

@media (min-width: 768px) {
  label[clear-sort] {
    margin-left: -2rem;
  }
}

</style>
