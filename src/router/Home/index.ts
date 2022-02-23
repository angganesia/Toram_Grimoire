import type { RouteRecordRaw } from 'vue-router'

import { ViewInit } from '@/shared/services/ViewInit'

import HomeView from '@/views/Home/Home/index.vue'

import ViewWrapper from './view-wrapper.vue'

const AboutView = () => import('@/views/Home/About/index.vue')

export default {
  name: 'AppRoot',
  path: '/',
  component: ViewWrapper,
  beforeEnter(to, from, next) {
    ViewInit().then(next)
  },
  meta: {
    title: null,
    leftMenuViewButtons: [{
      title: 'app.page-title.home',
      icon: 'ant-design:home-outlined',
      pathName: 'Home',
    }, {
      title: 'app.page-title.about',
      icon: 'bx-bxs-star-half',
      pathName: 'About',
    }],
  },
  children: [{
    name: 'Home',
    path: '',
    component: HomeView,
  }, {
    name: 'About',
    path: 'about',
    component: AboutView,
    meta: {
      title: 'app.page-title.about',
    },
  }],
} as RouteRecordRaw
