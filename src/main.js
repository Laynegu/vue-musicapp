import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import '@/common/less/index.less'

// 实现图片的懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('@/common/image/loading.svg'),
  attempt: 1
})

Vue.config.productionTip = false

fastclick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
