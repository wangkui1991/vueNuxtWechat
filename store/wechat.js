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
    }
  }
}

export default wechat
