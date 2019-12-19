import axios from 'axios'
const baseUrl = ''
// const apiUrl = 'http://47.105.223.108:9191/mock/16/ice'

class Services {
  getWechatSignature (url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }
  getWechatOAuth (url) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${encodeURIComponent(url)}`)
  }

  fetchHouses () {
    return axios.get(`${baseUrl}/wiki/houses`)
  }

  focusHouse (id) {
    return axios.get(`${baseUrl}/wiki/houses/${id}`)
  }
  fetchCities () {
    return { data: { data: [] }, success: true }
  }
  fetchCharacters () {
    return axios.get(`${baseUrl}/wiki/characters`)
  }
  focusCharacter (id) {
    return axios.get(`${baseUrl}/wiki/characters/${id}`)
  }
  fetchProducts () {
    return axios.get(`${baseUrl}/admin/products`)
  }
  fetchProduct (id) {
    return axios.get(`${baseUrl}/admin/products/${id}`)
  }
  fetchUserAndOrders () {
    return axios.get(`${baseUrl}/user/user`)
  }
  createOrder ({ productId, name, address, phoneNumber }) {
    return axios.post(`${baseUrl}/wechat-pay`, {
      productId,
      name,
      address,
      phoneNumber
    })
  }
}

export default new Services()
