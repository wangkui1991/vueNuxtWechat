import axios from 'axios'
const baseUrl = ''
// const apiUrl = 'http://47.105.223.108:9191/mock/16/ice'

class Services {
  getWechatSignature (url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }
  getUserByOAuth (url) {
    console.log('url2', url)
    return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
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
    return axios.get(`${baseUrl}/admin/user`)
  }
}

export default new Services()
