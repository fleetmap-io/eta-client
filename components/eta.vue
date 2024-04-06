<template>
  <div id="eta">
    <div v-if="duration !== -1" style="color:#2d5f99">
      <span class="fa">
        <font-awesome-icon icon="fa-solid fa-clock" />
      </span>
      <span>
        {{ duration | fDuration }}
      </span>
      <span class="fa" style="padding-left: 5px">
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
        {{ devices[0] && devices[0].name }}<br>
      </span>
      <span style="font-size: smaller">{{ address }}</span>
    </p>
    <p v-if="endAddress" :style="`color:` + getStatusColor()">
      <img src="/flag.svg" alt="Destino">
      <span>
        {{ endAddress }}
      </span>
    </p>
    <div style="text-align: center; font-size: small">
      <font-awesome-icon icon="fa-solid fa-wifi" /> actualizado {{ updated }}
    </div>
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
  filters: {
    fDuration (duration) {
      return format.duration(duration)
    }
  },
  computed: {
    ...mapGetters(['address', 'duration', 'distance', 'devices', 'geofences', 'startColor', 'endColor', 'onColor', 'endAddress', 'session', 'position']),
    fDistance () { return format.metric(this.distance) },
    updated () {
      const locale = locales[navigator.language.substring(0, 2)]
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
  max-width: 200px;
  background-color: #ffef;
  position: absolute;
  margin: 10px;
  top: 0;
  padding: 10px;
  overflow-y: scroll;
  font-family: sans-serif;
  transition: 0.3s;
  border-radius: 10px;
}
</style>
