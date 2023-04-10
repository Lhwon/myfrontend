import Vue from 'vue';
import VueRouter from 'vue-router';
import helloWorld from './components/HelloWorld.vue';
import powerForecast from './components/PowerForecast.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: helloWorld,
  },
  {
      path: '/powerForecast',
      name: 'powerForecast',
      component: powerForecast
  }
];
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;