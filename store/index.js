export const state = () => ({
  duration: 0,
  distance: 0
})

export const getters = {
  duration: state => state.duration,
  distance: state => state.distance
}

export const mutations = {
  setDuration (state, duration) {
    state.duration = duration
  },
  setDistance (state, distance) {
    state.distance = distance
  }
}
