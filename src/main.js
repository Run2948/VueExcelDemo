import Vue from 'vue'
import App from './App.vue'
import router from './router'

/* PUBLIC */
import './assets/styles/reset.min.css'
import './assets/styles/basic.css'

/* ElementUI */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
