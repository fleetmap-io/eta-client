export const state = () => ({
  duration: -1,
  distance: 0,
  geofences: [],
  devices: [],
  startColor: '#3887be',
  onColor: '#3D993D',
  endColor: '#f30',
  session: null,
  position: null,
  address: ''
})

export const getters = {
  address: state => state.address,
  duration: state => state.duration,
  distance: state => state.distance,
  geofences: state => state.geofences,
  devices: state => state.devices,
  startColor: state => state.startColor,
  onColor: state => state.onColor,
  endColor: state => state.endColor,
  end: state => state.session.attributes.linkVersion && state.session.attributes.linkVersion.split(','),
  endAddress: state => state.session && state.session.attributes.endAddress,
  position: state => state.position,
  device: state => state.devices && state.devices[0] && state.devices[0].name
}

export const mutations = {
  setDuration (state, duration) {
    state.duration = duration
  },
  setDistance (state, distance) {
    state.distance = distance
  },
  setPosition (state, position) {
    state.position = position
  },
  SET_DEVICES (state, devices) {
    state.devices = devices
  },
  SET_SESSION (state, session) {
    state.session = session
  },
  SET_ADDRESS (state, address) {
    state.address = address
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
