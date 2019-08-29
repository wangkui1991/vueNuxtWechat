import Service from './services'

const wechat = {
  state: () => {
    return {}
  },
  getters: {},
  mutations: {},
  actions: {
    getWechatSignature ({commit}, url) {
      return Service.getWechatSignature(url)
    },
    getUserByOAuth ({commit}, url) {
      return Service.getUserByOAuth(url)
    }
  }
}

export default wechat
