export const state = () => ({
  duration: 0,
  distance: 0,
  geofences: []
})

export const getters = {
  duration: state => state.duration,
  distance: state => state.distance,
  geofences: state => state.geofences
}

export const mutations = {
  setDuration (state, duration) {
    state.duration = duration
  },
  setDistance (state, distance) {
    state.distance = distance
  },
  SET_GEOFENCES (state, geofences) {
    state.geofences = geofences
  }
}

export const actions = {
  async geofences ({ commit }) {
    commit('SET_GEOFENCES', await this.$axios.$get('/geofences'))
  }
}
