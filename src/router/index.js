import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PageNotFound from '../views/PageNotFound.vue';
import Categories from '../views/Categories.vue';
import Category from '../views/Category.vue';
import Products from '../views/Products.vue';
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
    path: '/products',
    name: 'Products',
    component: Products,
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
    meta: { title: 'Mi Perfil' },
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
    meta: { title: 'Mi Carrito' },
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
    meta: { title: 'Cerrar sesión' },
  },
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
  routes,
})

export default router
