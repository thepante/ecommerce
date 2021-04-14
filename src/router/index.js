import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import PageNotFound from '../views/PageNotFound.vue';
import Categories from '../views/Categories.vue';
import Category from '../views/Category.vue';
import Product from '../views/Product.vue';
import Profile from '../views/Profile.vue';
import Sell from '../views/Sell.vue';
import Cart from '../views/Cart.vue';
import Access from '../views/Access.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/categories',
    name: 'Categorías',
    component: Categories,
    meta: { title: 'Productos' },
  },
  {
    path: '/category/:category',
    name: 'Category',
    component: Category,
  },
  {
    path: '/product/:id',
    name: 'ProductInfo',
    component: Product,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Mi Perfil',
      redirName: 'los ajustes de perfil',
      authRequired: true,
    },
  },
  {
    path: '/sell',
    name: 'Sell',
    component: Sell,
    meta: { title: 'Publicar un artículo' },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: {
      title: 'Mi Carrito',
      redirName: 'tu carrito de compras',
      authRequired: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Access,
    meta: { title: 'Iniciar sesión' },
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Access,
    meta: {
      title: 'Cerrar sesión',
      authRequired: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: PageNotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
  routes,
});



router.beforeEach((to, from, next) => {

  // Logged user can't go to login page again
  if (to.name === 'login' && localStorage.getItem('Logged-User')) {
    router.push({ name: 'Home' });

  // If route requires authentication
  } else if (to.meta.authRequired) {
    if (!localStorage.getItem('Logged-User')) {
      router.push({
        name: 'Login',
        params: {
          msg: `Debes estar logueado para acceder a ${to.meta.redirName}`,
        },
        query: {
          continue: to.name.toLowerCase(),
        }
      });
    }
  }

  return next();

});


export default router;

