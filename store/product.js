import Service from './services'
import axios from 'axios'

const product = {
  state: () => {
    return {
      products: [],
      currentProduct: {},
      shoppingScroll: 0,
      focusProduct: {}
    }
  },
  getters: {},
  mutations: {
    SET_PRODUCTS: (state, products) => {
      state.products = products
    },
    SET_CURRENT_PRODUCTS: (state, product) => {
      state.currentProduct = product
    },
    SET_SHOPPING_SCROLL: (state, payload) => {
      state.shoppingScroll = payload
    },
    SET_FOCUS_PRODUCT: (state, payload) => {
      state.focusProduct = payload
    }

  },
  actions: {
    async fetchProducts ({ commit }) {
      console.log(54)
      const res = await Service.fetchProducts()
      commit('SET_PRODUCTS', res.data.data)

      return res
    },
    async showProducts ({ commit, state }, _id) {
      if (_id === state.currentProduct._id) return

      const res = await Service.fetchProduct(_id)
      commit('SET_CURRENT_PRODUCT', res.data.data)

      return res
    },
    async saveProduct ({state, commit, dispatch}, product) {
      await axios.post('/admin/products', product)
      let res = await dispatch('fetchProducts')
      console.log('res', res)
      return res.data.data
    },
    async putProduct ({state, commit, dispatch}, product) {
      await axios.put('/admin/products', product)
      let res = await dispatch('fetchProducts')
      return res.data.data
    },
    async deleteProduct ({state, commit, dispatch}, product) {
      await axios.delete(`/admin/products/${product._id}`)
      let res = await dispatch('fetchProducts')
      return res.data.data
    },
    async focusProduct ({state, commit}, _id) {
      if (_id === state.focusProduct._id) return
      const res = await axios.get(`/admin/products/${_id}`)
      console.log('res', res)
      commit('SET_FOCUS_PRODUCT', res.data.data)
      console.log('ress,', state.focusProduct)
      return res
    }

  }
}

export default product
