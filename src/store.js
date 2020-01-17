import Vue from 'vue'
import Vuex from 'vuex'
import { hasArray } from 'util'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    power: [],
    cphm: ''
  },
  mutations: {
    LOGIN(state, { name, power }) {
      state.username = name
      if (hasArray(power)) state.power = power
    },
    setHTAddress(state, az){
      state.cphm = az;
    },
    cleanHTAddress(state){
      state.cphm = '';
    }
  },
  actions: {}
})
