import Vue from 'vue';
import Router from 'vue-router';
import Splash from './views/Splash.vue';
import Phone from './views/Phone.vue';
import Bucket from './views/Bucket.vue';
import Pay from './views/Pay.vue';
import Finish from './views/Finish.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Splash,
    },
    {
      path: '/phone',
      name: 'phone',
      component: Phone,
    },
    {
      path: '/bucket',
      name: 'bucket',
      component: Bucket,
    },
    {
      path: '/pay',
      name: 'pay',
      component: Pay,
    },
    {
      path: '/finish',
      name: 'finish',
      component: Finish,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
