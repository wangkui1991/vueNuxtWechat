import axios from 'axios'
const vuex = {
  state: () => {
    return {

      user: null

    }
  },
  getters: {},
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
    }

  }
}

export default vuex
