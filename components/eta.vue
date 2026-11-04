<template>
  <div id="eta">
    <div v-for="device in devices" :key="device.id">
      <div v-if="etaByDevice(device.id)" style="color:#2d5f99">
        <span class="fa">
          <font-awesome-icon icon="fa-solid fa-clock" />
        </span>
        <span>
          {{ etaByDevice(device.id).duration | fDuration }}
        </span>
        <span class="fa" style="padding-left: 5px">
          <font-awesome-icon icon="fa-solid fa-road" />
        </span>
        <span>
          {{ fDistance(etaByDevice(device.id).distance) }}
        </span>
      </div>
      <p :style="`color:${startColor}`">
        <span class="fa">
          <font-awesome-icon icon="fa-solid fa-car" />
        </span>
        <span>
          {{ device.name }}<br>
        </span>
        <span style="font-size: smaller">{{ positionByDevice(device.id) && positionByDevice(device.id).address }}</span>
      </p>
      <div v-if="devices.length > 1" style="font-size: small; padding-bottom: 8px">
        <font-awesome-icon icon="fa-solid fa-wifi" /> actualizado {{ updated(device) }}
      </div>
    </div>
    <p v-if="endAddress" :style="`color:` + getStatusColor()">
      <img src="/flag.svg" alt="Destino">
      <span>
        {{ endAddress }}
      </span>
    </p>
    <div v-if="devices.length === 1" style="text-align: center; font-size: small">
      <font-awesome-icon icon="fa-solid fa-wifi" /> actualizado {{ updated(devices[0]) }}
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
    ...mapGetters(['devices', 'geofences', 'startColor', 'endColor', 'onColor', 'endAddress', 'session', 'position', 'positionByDevice', 'etaByDevice'])
  },
  methods: {
    fDistance (distance) { return format.metric(distance) },
    updated (device) {
      const locale = locales[navigator.language.substring(0, 2)]
      return device &&
       formatDistance(new Date(device.lastUpdate), new Date(), { addSuffix: true, locale })
    },
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
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  font-family: sans-serif;
  transition: 0.3s;
  border-radius: 10px;
}
</style>
