import app from "./app.vue";

import GetLang from "@global-modules/LanguageSystem.js";
import init from "./init.js";

const vue_enchantSimulator = () => import("@views/EnchantSimulator/main.vue");

export default {
  path: '/enchant',
  component: app,
  beforeEnter(to, from, next) {
    init().then(() => next());
  },
  meta: {
    leftMenuViewButtons: [{
      title: () => GetLang('Page Title/enchant-simulator'),
      icon: 'mdi-cube-scan',
      path: ''
    }]
  },
  children: [{
    path: '',
    component: vue_enchantSimulator,
    meta: {
      title: () => GetLang('Page Title/enchant-simulator')
    }
  }]
};