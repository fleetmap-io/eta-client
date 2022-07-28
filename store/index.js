export const state = () => ({
  duration: 0,
  distance: 0,
  geofences: [],
  devices: [],
  startColor: '#3887be',
  endColor: '#f30',
  session: null
})

export const getters = {
  duration: state => state.duration,
  distance: state => state.distance,
  geofences: state => state.geofences,
  devices: state => state.devices,
  startColor: state => state.startColor,
  endColor: state => state.endColor,
  end: state => state.session.attributes.linkVersion.split(','),
  endAddress: state => state.session && state.session.attributes.endAddress
}

export const mutations = {
  setDuration (state, duration) {
    state.duration = duration
  },
  setDistance (state, distance) {
    state.distance = distance
  },
  SET_DEVICES (state, devices) {
    state.devices = devices
  },
  SET_SESSION (state, session) {
    state.session = session
  }
}

export const actions = {
  async getData ({ commit }) {
    const token = new URLSearchParams(window.location.search).get('token')
    const body = 'email=' + encodeURIComponent(`temp_${token}`) + '&password=' + encodeURIComponent(token)
    commit('SET_SESSION', await this.$axios.$post('/session', body))
    commit('SET_DEVICES', await this.$axios.$get('/devices'))
  }
}
