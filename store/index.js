export const state = () => ({
  duration: 0,
  distance: 0,
  geofences: [],
  devices: [],
  startColor: '#3887be',
  endColor: '#f30'
})

export const getters = {
  duration: state => state.duration,
  distance: state => state.distance,
  geofences: state => state.geofences,
  devices: state => state.devices,
  startColor: state => state.startColor,
  endColor: state => state.endColor
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
  },
  SET_DEVICES (state, devices) {
    state.devices = devices
  }
}

export const actions = {
  async getData ({ commit }) {
    commit('SET_GEOFENCES', await this.$axios.$get('/geofences'))
    commit('SET_DEVICES', await this.$axios.$get('/devices'))
  }
}
