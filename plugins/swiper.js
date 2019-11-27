import Vue from 'vue'

// you can see more in https://github.com/surmon-china/vue-awesome-swiper

if (process.browser) {
  const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr')
  Vue.use(VueAwesomeSwiper)
  console.log(123, Vue)
}
