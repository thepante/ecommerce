<template>
  <NavBar />
  <router-view :key="$route.fullPath" />
  <Footer />
</template>

<script>
import { useStore } from 'vuex';

import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';

Number.asPrice = Number.prototype.asPrice = function(){
  let num = this;
  if (num % 1 != 0) num = num.toFixed(2).replace('.', ',');
  num = String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&.');
  return num;
}

String.capitalized = String.prototype.capitalized = function(){
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.asPath = String.prototype.asPath = function(){
  return '-' + this.replace(/\W+/g, '-').toLowerCase();
}

export default {
  name: 'App',
  components: { NavBar, Footer },
  setup() {
    useStore().commit('initStore');
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        document.title = `${to.meta.title && to.meta.title + ' · ' || ''}${this.$store.state.title} - ${this.$store.state.subtitle}`;
      },
    },
  },
}
</script>

<style lang="scss">
$fa-font-path: "~@fortawesome/fontawesome-free/webfonts";
@import "~@fortawesome/fontawesome-free/scss/fontawesome";
@import "~@fortawesome/fontawesome-free/scss/solid";   // fas
@import "~@fortawesome/fontawesome-free/scss/regular"; // far
@import "~@fortawesome/fontawesome-free/scss/brands";  // fab

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.card-body,
.container,
.site-header {
  font-family: "Raleway", serif !important;
}


/* Home */
#header.home::before {
  position: absolute;
  content: '';
  width: 100%;
  height: 770px;
  top: -12.5rem;
  left: 0;
  background-image: url('assets/home/header-bg.png');
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% 100%;
  z-index: -999;
}

#header {
  padding-bottom: 0px !important;
  --illu-offset: -5rem;
}

#header div {
  position: relative;
  z-index: 1;
}

@media (min-width: 1000px) {
  #header.home > div::before {
    position: absolute;
    content: '';
    display: block;
    float: right;
    top: var(--illu-offset);
    right: -80px;
    width: 450px;
    height: 400px;
    background-image: url('assets/home/top-illustration.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
}

#header h3 {
  font-weight: 700;
}

#header h3::after {
  position: relative;
  display: inline-block;
  content: '';
  width: 100%;
  height: 10px;
  background-color: #ffdc9a;
  left: 0;
  bottom: 17px;
  z-index: -1;
}

#header p {
	color: #515151;
	font-size: 0.85rem;
}

@media (min-width: 1000px) and (max-width: 1200px){
  #header.home p {
    max-width: 30rem;
  }
}

#header .logo-jap {
  display: block;
  width: 298px;
  height: 62px;
  background-image: url('assets/ceibal-jap.png');
  background-repeat: no-repeat;
}

@media (min-width: 490px) {
  #header .logo-jap {
    margin-left: 1rem;
    margin-top: 1rem;
    margin-bottom: -1rem;
  }
}

/* Pages */
main:not(.home) {
  --bg-offset: -25rem;
}

main:not(.home)::before {
  position: absolute;
  content: '';
  width: 100%;
  height: 770px;
  top: var(--bg-offset);
  left: 0;
  background-image: url('assets/home/header-bg.png');
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% 100%;
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  transform: scaleX(-1);
  z-index: -999;
}

#header:not(.home) {
  padding-top: 3rem;
  padding-bottom: 1rem !important;
  margin-bottom: 1rem !important;
  cursor: default;
}

#header:not(.home) p,
#header:not(.home) h3 {
  margin: 0 auto;
}

#header:not(.home) p {
  font-size: 1rem;
}

#header .information {
  text-align: center;
}

#header:not(.home) h3::after {
  background-color: #ffdc9ae7;
}

#header:not(.home) p.alert-warning {
  border-radius: 4px;
  padding: 1rem 2rem;
  margin-top: 1rem;
  font-size: 0.8rem;
  box-shadow: 0.2rem 0.2rem 0.2rem #c0c0c03d;
}


.site-header a {
  color: white;
  transition: ease-in-out color 0.15s;
}

.light-text {
  color: white;
}

.site-header .dropdown-menu a {
  color: black;
}


.alert {
  position: fixed;
  top: 80px;
  width: 50%;
  left: 50%;
  transform: translate(-50%, 0);
}

a.custom-card,
a.custom-card:hover {
  color: inherit;
  text-decoration: inherit;
}

.checked {
  color: orange;
}

/* Floating labels */

.form-label-group {
  position: relative;
}

.form-label-group input,
.form-label-group label {
  height: 3.125rem;
  padding: 0.75rem;
}

.form-label-group label {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  margin-bottom: 0; /* Override default `<label>` margin */
  line-height: 1.5;
  color: #495057;
  pointer-events: none;
  cursor: text; /* Match the input under the label */
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: all 0.1s ease-in-out;
}

.form-label-group input::-webkit-input-placeholder {
  color: transparent;
}

.form-label-group input::-moz-placeholder {
  color: transparent;
}

.form-label-group input:-ms-input-placeholder {
  color: transparent;
}

.form-label-group input::-ms-input-placeholder {
  color: transparent;
}

.form-label-group input::placeholder {
  color: transparent;
}

.form-label-group input:not(:-moz-placeholder-shown) {
  padding-top: 1.25rem;
  padding-bottom: 0.25rem;
}

.form-label-group input:not(:-ms-input-placeholder) {
  padding-top: 1.25rem;
  padding-bottom: 0.25rem;
}

.form-label-group input:not(:placeholder-shown) {
  padding-top: 1.25rem;
  padding-bottom: 0.25rem;
}

.form-label-group input:not(:-moz-placeholder-shown) ~ label {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 12px;
  color: #777;
}

.form-label-group input:not(:-ms-input-placeholder) ~ label {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 12px;
  color: #777;
}

.form-label-group input:not(:placeholder-shown) ~ label {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 12px;
  color: #777;
}

/* Floating labels - Fallback for Edge */
@supports (-ms-ime-align: auto) {
  .form-label-group {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column-reverse;
    flex-direction: column-reverse;
  }

  .form-label-group label {
    position: static;
  }

  .form-label-group input::-ms-input-placeholder {
    color: #777;
  }
}



</style>
