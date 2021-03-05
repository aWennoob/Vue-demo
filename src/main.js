import Vue from 'vue'
import App from './App.vue'
// import { Input ,Form} from 'element-ui';
import ElementUI from 'element-ui'
import router from './routers/index'

import store from './vuex/store'
import './theme/element/index.css'
import * as api from './api/index'

Vue.config.productionTip = false
// Vue.use(Input)
// Vue.use(Form)
Vue.use(ElementUI)
Vue.prototype.$API=api

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
