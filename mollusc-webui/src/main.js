import Vue from 'vue'
import App from './views/App.vue'
import router from './router'
import store from './store'
import 'bulma'
import 'bulma-extensions/dist/css/bulma-extensions.min.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  mounted() {
  },
  render: h => h(App)
}).$mount('#app')
