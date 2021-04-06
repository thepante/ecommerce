<template>
  <div class="col-12">
    <div class="card">
      <div class="row" style="display: inherit;">
        <div class="col-3">
          <img :src="require(`@/${image}`)" :alt="name">
        </div>
        <div class="col info">
          <div class="d-flex w-100 justify-content-between">
            <h4 class="mb-2 pl-0" v-html="name"></h4>
            <small>{{ soldCount }} {{ cost ? 'vendidos' : 'productos' }}</small>
          </div>
          <p v-if="cost"><span class="badge badge-secondary">{{ currency }} {{ cost.asPrice() }}</span></p>
          <p class="list-desc" v-html="description"></p>
        </div>
        <router-link :to="link" class="product-link" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProductCard',
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
    },
    cost: {
      type: String,
    },
    soldCount: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">

.card {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  word-wrap: break-word;
  min-width: 0;
  margin-bottom: 1.5rem;
  border-radius: .3rem;
  overflow: hidden;
  border: .15rem solid transparent;
  box-shadow: 0 4px 10px -1px rgba(154,160,185,.1);
  transition: all .2s ease-in-out;

  img {
    max-width: 100%;
    height: auto;
  }

  .info {
    margin: .5rem;
    margin-left: 0rem;

    h4 {
      font-weight: 700;
      height: 2rem;
    }

    p {
      margin-bottom: .2rem;
    }

    small {
      font-weight: 700;
      color: #a1a5a8 !important;
    }

    .badge {
      font-size: .9rem;
    }

    .d-flex {
      flex-wrap: wrap;
    }
  }


  h4::after {
    content: '';
    position: relative;
    display: inline-block;
    width: 30%;
    height: 0.5rem;
    bottom: 1rem;
    left: 0;
    background-color: transparent;
    z-index: 0;
    transition: all .2s ease-in-out;
  }

  &:hover {
    border-color: #cca57863;
  }

  &:hover h4::after {
    width: 100%;
    background-color: #ffdc9ae7;
  }
}

a.product-link {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.highlight {
  background-color: #faf08196;
  padding: 1px 1px;
  margin: 0 -1px;
  border-radius: 4px;
  display: inline-block;
}

@media (max-width: 768px) {
  #listing {
    margin-top: 2rem;
    padding: 0rem;
  }

  .card {
    border-radius: 0rem;

    h4 {
      font-size: 1rem;
    }

    h4::after {
      bottom: .7rem;
      height: .3rem;
    }

    small {
      float: left;
      position: absolute;
      top: 1.2rem;
    }

    .badge {
      font-size: .75rem !important;
    }

    .list-desc {
      font-size: .8rem;
    }

  }
}

</style>
