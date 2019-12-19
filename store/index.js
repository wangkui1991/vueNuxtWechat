import axios from 'axios'
import Services from './services'
import createLogger from 'vuex/dist/logger'
const debug = process.env.NODE_ENV !== 'production'
const vuex = {
  state: () => {
    return {

      user: null,

      payments: []

    }
  },
  getters: {},
  // plugins: debug ? [createLogger()] : [],
  mutations: {

    SET_USER: (state, payload) => {
      state.user = payload
    }
  },
  actions: {
    nuxtServerInit ({ commit }, { req }) {
      if (req.session && req.session.user) {
        const { email, nickname, avatarUrl } = req.session.user
        const user = {
          email,
          nickname,
          avatarUrl
        }
        commit('SET_USER', user)
      }
    },
    async login ({commit}, {email, password}) {
      try {
        let res = await axios.post('/user/login', {
          email, password
        })
        let {data} = res
        if (data.success) commit('SET_USER', data.user)
        return data
      } catch (e) {
        if (e.response.status === 401) {
          throw new Error('You can\'t do it')
        }
      }
    },
    async logout ({commit}) {
      await axios.post('/user/logout')
      commit('SET_USER', null)
    },
    async fetchPayments ({ state }) {
      let { data } = await axios.get('/admin/payments')
      console.log(data)
      state.payments = data
      return data
    },
    async fetchUserAndOrders ({ state, commit }) {
      const res = await Services.fetchUserAndOrders()
      commit('SET_USER', res.data.data)

      return res
    }

  }
}

export default vuex
