import Service from './services'

const wechat = {
  state: () => {
    return { authUser: null }
  },
  getters: {},
  mutations: {
    SET_AUTH_USER: (state, payload) => {
      state.authUser = payload
    }
  },
  actions: {
    getWechatSignature ({commit}, url) {
      return Service.getWechatSignature(url)
    },

    getWechatOAuth ({ commit }, url) {
      return Service.getWechatOAuth(url)
    },
    setAuthUser ({commit}, authUser) {
      commit('SET_AUTH_USER', authUser)
    }
  }
}

export default wechat
