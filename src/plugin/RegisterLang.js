import GetLang from '@services/Language';
import RegisterLang from '@/setup/RegisterLang';

export default function install(app) {
  app.config.globalProperties.$rootLang = GetLang;

  app.mixin({
    beforeCreate() {
      if (this.$options.RegisterLang) {
        const { lang } = RegisterLang(this.$options.RegisterLang);
        this.$lang = lang;
      }
    },
  });
}
