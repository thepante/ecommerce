<template>
  <div @mouseover="mouseOver" @mouseleave="mouseOver" class="img-big-wrap">
    <div id="preview-img" :style="`background-image: url(${require(`@/${images[indexVisible]}`)});`" >
      <div id="controls">
        <i @click="changeImagePrev" class="fas fa-chevron-left"></i>
        <i @click="changeImageNext" class="fas fa-chevron-right"></i>
      </div>
    </div>
  </div>
  <div class="img-small-wrap" id="thumbnails">

    <div
      v-for="(image, index) in images"
      :key="index"
      @click="changeImageTo(index)"
      class="item-gallery"
      :class="indexVisible == index ? 'selected' : ''"
      :style="`background-image: url(${require(`@/${image}`)});`"
    />

  </div>
</template>

<script>
export default {
  name: 'ImageSlideshow',
  props: {
    images: {
      type: Array,
      required: true,
    }
  },

  data() {
    return {
      indexVisible: 0,
      mouseOverPreview: false,
    }
  },

  methods: {
    changeImageTo(index) {
      this.indexVisible = index;
    },

    changeImagePrev() {
      const isThisTheFirst = this.indexVisible !== 0;
      const lastIndex = this.images.length - 1;
      const previous = isThisTheFirst ? this.indexVisible - 1 : lastIndex;
      this.changeImageTo(previous);
    },

    changeImageNext() {
      const lastIndex = this.images.length - 1;
      const isNotTheLast = this.indexVisible !== lastIndex;
      const next = isNotTheLast ? this.indexVisible + 1 : 0;
      this.changeImageTo(next);
    },

    mouseOver() {
      this.mouseOverPreview = !this.mouseOverPreview;
    },

    async autoLoopImages() {
      await setTimeout(() => {
        !this.mouseOverPreview && this.changeImageNext();
        this.autoLoopImages();
      }, 5000);
    },

  },

  mounted() {
    this.autoLoopImages()
  },

}
</script>

<style lang="scss" scoped>

.gallery-wrap .img-small-wrap .item-gallery {
  width: 60px;
  height: 60px;
  border: 1px solid #ddd;
  margin: 7px 2px;
  display: inline-block;
  overflow: hidden;
  cursor: pointer;
  border-radius: 4px;
  opacity: 0.8;
  transition: all 0.5s;
}

#thumbnails .selected {
  opacity: 1;
}

#thumbnails .selected:before {
  content: "";
  background: #007bff;
  display: block;
  width: 100%;
  height: 3px;
}

.gallery-wrap .img-small-wrap {
  text-align: center;
}

#preview-img,
.item-gallery {
  height: 470px;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: center;
}

#preview-img:hover #controls {
  opacity: 1;
}

#preview-img #controls {
  position: relative;
  font-size: 2rem;
  width: 100%;
  height: 100%;
  padding-top: 210px;
  opacity: 0;
  transition: opacity 0.5s;
}

#controls i {
  position: relative;
  display: block;
  opacity: 0.6;
  transition: all 0.5s;
  float: left;
  width: 42px;
  height: 42px;
  margin: 10px;
  padding-left: 10px;
  padding-top: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
}

#controls i:hover {
  opacity: 1;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
}

#controls i.fa-chevron-right {
  position: absolute;
  right: 0px;
  padding-left: 13px !important;
}

</style>>

