import Service from './services'

const vuessr = {
  state: () => {
    return {
      houses: [],
      characters: [],
      cities: []
    }
  },
  getters: {},
  mutations: {
    SET_HOUSES: (state, houses) => {
      state.houses = houses
    },
    SET_CHARACTERS: (state, characters) => {
      state.characters = characters
    },
    SET_CITIES: (state, cities) => {
      state.cities = cities
    }
  },
  actions: {
    async fetchHouses ({commit}) {
      console.log(54)
      const res = await Service.fetchHouses()
      commit('SET_HOUSES', res.data.data)

      return res
    },
    async fetchCharacters ({commit}) {
      const res = await Service.fetchCharacters()
      commit('SET_CHARACTERS', res.data.data)
      return res
    },
    async fetchCities ({commit}) {
      const res = await Service.fetchCities()
      commit('SET_CITIES', res.data.data)
      return res
    }
  }
}

export default vuessr
