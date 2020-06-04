import Vue from 'vue';
import VueRouter from 'vue-router';

// views
import Character from "./Character/app.js";
import Home from "./Home/app.js";
import Skill from "./Skill/app.js";
import Item from "./Item/app.js";
import DamageCalc from "./Calculation/damage/app.js";
import Enchant from "./Enchant/app.js";

import Page404 from "./Page404/app.js";

// stores
import navStore from "@store/nav.js";
import leftMenuStore from "@store/left-menu.js";

// global modules
import GetLang from "@global-modules/LanguageSystem.js";

Vue.use(VueRouter);

const routes = [
  Home,
  Character,
  Skill,
  Item,
  DamageCalc,
  Enchant,
  Page404
];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  if (to) {
    { // set title and meta tags
      const data = to.matched.slice().reverse().find(p => p.meta && p.meta.title);
      if (data) {
        const title = data.meta.title;
        document.title = GetLang('Page Title/base') + '｜' + (typeof title == 'function' ? title() : title);
      }
    } {
      document.head.querySelectorAll('*[data-vue-router-mata-tag-controlled]').forEach(el => el.remove());
      const data = to.matched.slice().reverse().find(p => p.meta && p.meta.metaTags);
      if (data) {
        const metaTags = data.meta.metaTags;
        if (metaTags) {
          const els = metaTags.map(def => {
            const el = document.createElement('meta');
            Object.keys(def).forEach(key => el.setAttribute(key, def[key]));
            el.setAttribute('data-vue-router-mata-tag-controlled', '');
          });
          document.head.append(...els);
        }
      }
    }

    // set nav
    navStore.commit('setItems', {
      items: to.matched
        .filter(p => p.meta && p.meta.title)
        .map(p => {
          const title = p.meta.title;
          return {
            title: typeof title == 'function' ? title() : title,
            path: p.path
          };
        })
    });

    // set left menu
    {
      const data = to.matched.slice().reverse().find(p => p.meta && p.meta.leftMenuViewButtons);
      if (data) {
        const res = data.meta.leftMenuViewButtons.map(p => {
          return {
            title: typeof p.title == 'function' ? p.title() : title,
            icon: p.icon,
            path: data.path + p.path
          };
        });

        leftMenuStore.commit('setViewButtons', { viewButtons: res });
      }
    }
  }

  next();
});

export default router;