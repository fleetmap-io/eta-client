export const format = {
  duration (s) {

  },

  imperial (m) {
    const mi = m / 1609.344
    if (mi >= 100) { return mi.toFixed(0) + 'mi' }
    if (mi >= 10) { return mi.toFixed(1) + 'mi' }
    if (mi >= 0.1) { return mi.toFixed(2) + 'mi' }
    return (mi * 5280).toFixed(0) + 'ft'
  },

  metric (m) {
    if (!m) { return 'calculando...' }
    if (m >= 100000) { return (m / 1000).toFixed(0) + 'km' }
    if (m >= 10000) { return (m / 1000).toFixed(1) + 'km' }
    if (m >= 100) { return (m / 1000).toFixed(2) + 'km' }
    return m.toFixed(0) + 'm'
  }
}
