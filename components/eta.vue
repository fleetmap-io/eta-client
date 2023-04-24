<template>
  <div id="eta">
    <div v-if="endAddress">
      <span class="fa">
        <font-awesome-icon icon="fa-solid fa-clock" />
      </span>
      <span>
        {{ fDuration }}
      </span>
      <span class="fa">
        <font-awesome-icon icon="fa-solid fa-road" />
      </span>
      <span>
        {{ fDistance }}
      </span>
    </div>
    <p :style="`color:${startColor}`">
      <span class="fa">
        <font-awesome-icon icon="fa-solid fa-car" />
      </span>
      <span>
        {{ devices[0] && devices[0].name }}
      </span>
    </p>
    <p :style="`color:` + getStatusColor()">
      <span class="fa">
        <font-awesome-icon icon="fa-solid fa-location-dot" />
      </span>
      <span>
        {{ endAddress ? endAddress : (position ? position.address : '') }}
      </span>
    </p>
    <p>
      Actualizado: {{ updated }}
    </p>
    <span style="font-size: smaller">{{ title }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDistance } from 'date-fns'
import { pt, es } from 'date-fns/locale'
import { format } from '@/utils/mapbox'

const locales = { pt, es }
export default {
  name: 'EtaPanel',
  computed: {
    ...mapGetters(['duration', 'distance', 'devices', 'geofences', 'startColor', 'endColor', 'onColor', 'endAddress', 'session', 'position']),
    title: () => 'v' + document.title.split(' ')[2],
    fDistance () { return format.metric(this.distance) },
    fDuration () { return format.duration(this.duration) },
    updated () {
      const locale = locales[navigator.language.substring(0, 2)]
      if (!locale) {
        console.error('language not implemented', navigator.language)
      }
      return this.devices[0] &&
       formatDistance(new Date(this.devices[0].lastUpdate), new Date(), { addSuffix: true, locale })
    }
  },
  methods: {
    getStatusColor () {
      return this.endAddress
        ? this.endColor
        : (this.position ? (this.position.attributes.ignition ? this.onColor : this.endColor) : this.startColor)
    }
  }
}
</script>

<style scoped>

.fa {
  padding: 0 12px 0 0;
  display: inline-block;
}

#eta {
  position: absolute;
  margin: 10px;
  top: 0;
  /*bottom: 50%;*/
  padding: 10px;
  background-color: #fffd;
  overflow-y: scroll;
  font-family: sans-serif;
  transition: 0.3s;
}
</style>
