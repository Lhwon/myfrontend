import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './index'


Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
