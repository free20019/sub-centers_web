import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element.js'
import './plugins/scrollbar.js'
import Tongwoo from 'tongwoo'
import { baseURL } from 'util'
import VueCookies from 'vue-cookies'
import  plTable from 'pl-table'
import 'pl-table/themes/index.css'
import 'pl-table/themes/plTableStyle.css'
Vue.use(VueCookies)
Vue.use(plTable)
Vue.use(Tongwoo)

Vue.config.productionTip = false
router.beforeEach((to, form, next) => {
  // if (form.path === '/login' || to.path === '/login') return next()
  // if (store.state.username == null || store.state.power.length === 0) {
  //   axios.get('common/index', { baseURL }).then(async res => {
  //     console.log(res.data)
  //     if (res.data.info != 0) return next({ name: '登录' })
  //     const data = (res.data.list && res.data.list[0]) || {}
  //     const name = data.REAL_NAME || ''
  //     const power = (data.POWER_IDS && data.POWER_IDS.split(',')) || []
  //     await store.commit('LOGIN', { name, power })
  //     return next({ name: 'Index' })
  //   })
  // }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
