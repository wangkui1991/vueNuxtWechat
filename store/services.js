import axios from 'axios'
const baseUrl = ''
const apiUrl = 'http://47.97.160.105:9090/mock/11/ice'
class Services {
  getWechatSignature (url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }
  getUserByOAuth (url) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
  }
  fetchHouses () {
    console.log('url', `${apiUrl}/home/houses`)
    return axios.get(`${apiUrl}/home/houses`)
  }
  fetchCities () {
    return axios.get(`${apiUrl}/home/city`)
  }
  fetchCharacters () {
    return axios.get(`${apiUrl}/home/characters`)
  }
}

export default new Services()
