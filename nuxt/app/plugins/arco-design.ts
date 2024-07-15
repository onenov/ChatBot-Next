import ArcoVue from "@arco-design/web-vue";
// 此处引入css则不需要在nuxt.config.ts配置
import "@arco-design/web-vue/dist/arco.css";
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(ArcoVue);
    nuxtApp.vueApp.use(ArcoVueIcon);

});
