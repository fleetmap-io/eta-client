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
import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher'
import Eta from '../components/eta'
import 'mapbox-gl-style-switcher/styles.css'

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
let map = null
let socket = null
export default {
  name: 'IndexPage',
  components: { Eta },
  computed: {
    ...mapGetters(['geofences', 'startColor', 'endColor', 'end'])
  },
  async mounted () {
    await this.getLastPosition()
    this.initMap()
    setTimeout(this.initWebSocket, 2000)
  },
  methods: {
    async getLastPosition () {
      await this.$store.dispatch('getData')
    },
    initMap () {
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.end || this.start,
        zoom: 12
      })
      map.addControl(new MapboxStyleSwitcherControl())
      // map.setMaxBounds([end, end])
      map.on('load', () => {
        if (this.end) {
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
                      coordinates: this.end
                    }
                  }
                ]
              }
            },
            paint: {
              'circle-radius': 10,
              'circle-color': this.endColor
            }
          })
          // this is where the code from the next step will go
        }
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
            'circle-color': this.startColor
          }
        })
      }
      if (this.end) {
        this.getRoute(coords)
      } else {
        map.setCenter(coords)
      }
    },
    async getRoute (start) {
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${this.end[0]},${this.end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
            const last = data.positions.pop()
            this.$store.commit('setPosition', last)
            this.update([last.longitude, last.latitude])
          }
        }
      })
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
