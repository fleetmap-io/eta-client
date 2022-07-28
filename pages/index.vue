<template>
  <div>
    <div id="map" />
    <eta />
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import bbox from '@turf/bbox'
import { mapGetters } from 'vuex'
import Eta from '../components/eta'
mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
let map = null
let socket = null
let end = null
export default {
  name: 'IndexPage',
  components: { Eta },
  computed: {
    ...mapGetters(['geofences'])
  },
  async mounted () {
    sessionStorage.clear()
    await this.$axios.$get('/session' + window.location.search)
    await this.getLastPosition()
    this.initMap()
    this.initWebSocket()
  },
  methods: {
    async getLastPosition () {
      await this.$store.dispatch('getData')
      const [poi] = this.geofences
      end = poi.area.split('(')[1].split(',')[0].split(' ').map(c => Number.parseFloat(c)).reverse()
    },
    initWebSocket () {
      socket = new WebSocket(`wss://${process.env.TRACCAR_SERVER}/api/socket`)
      const events = ['onclose', 'onerror', 'onopen']
      events.forEach((eventType) => {
        socket[eventType] = (event) => {
          if (event.type === 'close') {
            setTimeout(() => {
              this.initWebSocket()
            }, 10000)
          }
        }
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data)
          if (data.positions && data.positions.length) {
            this.update([data.positions[0].longitude, data.positions[0].latitude])
            // this.updateMarkers(data.positions.sort((a, b) => a.fixTime === b.fixTime ? 0 : a.fixTime < b.fixTime ? -1 : 1))
          }
        }
      })
    },
    initMap () {
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: end, // starting position
        zoom: 12
      })
      // map.setMaxBounds([end, end])
      map.on('load', () => {
        // Add starting point to the map
        map.addLayer({
          id: 'point',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: end
                  }
                }
              ]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
          }
        })
        // this is where the code from the next step will go
      })
    },
    update (coords) {
      const start = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: coords
            }
          }
        ]
      }
      if (map.getLayer('start')) {
        map.getSource('start').setData(start)
      } else {
        map.addLayer({
          id: 'start',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: coords
                  }
                }
              ]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#f30'
          }
        })
      }
      this.getRoute(coords)
    },
    async getRoute (start) {
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      )
      const json = await query.json()
      const data = json.routes[0]
      const route = data.geometry.coordinates
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      }
      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson)
      } else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        })
      }
      map.fitBounds(bbox(geojson), { padding: { top: 30, bottom: 30, left: 330, right: 30 } })
      this.$store.commit('setDuration', data.duration)
      this.$store.commit('setDistance', data.distance)
    }
  }
}
</script>
<style>
body {
  margin: 0;
  padding: 0;
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
