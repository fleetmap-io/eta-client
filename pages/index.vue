<template>
  <div>
    <div id="map" />
    <eta />
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import Eta from '../components/eta'
mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
let map = null

const bounds = [
  [-123.069003, 45.395273],
  [-122.303707, 45.612333]
]
// an arbitrary start will always be the same
// only the end or destination will change
const start = [-122.662323, 45.523751]
export default {
  name: 'IndexPage',
  components: { Eta },
  mounted () {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.662323, 45.523751], // starting position
      zoom: 12,
      projection: 'globe'
    })
    map.on('style.load', () => {
      map.setFog({})
    })

    map.setMaxBounds(bounds)

    map.on('load', () => {
      // make an initial directions request that
      // starts and ends at the same location
      this.getRoute(start)

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
                  coordinates: start
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

    map.on('click', (event) => {
      const coords = Object.keys(event.lngLat).map(key => event.lngLat[key])
      const end = {
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
      if (map.getLayer('end')) {
        map.getSource('end').setData(end)
      } else {
        map.addLayer({
          id: 'end',
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
    })
  },
  methods: {
    async  getRoute (end) {
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