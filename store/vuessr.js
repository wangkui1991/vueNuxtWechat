import Service from './services'

const vuessr = {
  state: () => {
    return {
      houses: [],
      characters: [],
      cities: [],
      focusHouse: {}
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
    },
    SET_FOCUS_HOUSE: (state, data) => {
      state.focusHouse = data
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
    },

    async focusHouse ({ state, commit }, _id) {
      console.log(42)
      if (_id === state.focusHouse._id) return
      const res = await Service.focusHouse(_id)

      commit('SET_FOCUS_HOUSE', res.data.data)
      console.log('a', res.data.data)
      return res
    }
  }
}

export default vuessr
