import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueLazyLoad from 'vue-lazyload'

// 导入 mavonEditor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import './common/utils/element'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

Vue.use(mavonEditor)

// 使用懒加载
Vue.use(VueLazyLoad, {
  loading: require('./assets/pageImg/loading2.gif')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
