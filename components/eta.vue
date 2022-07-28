<template>
  <div id="eta">
    <h1>
      <span class="fa">
        <font-awesome-icon icon="fa-solid fa-clock" />
      </span>
      <span>
        {{ fDuration }}
      </span>
    </h1>
    <h1>
      <span class="fa">
        <font-awesome-icon icon="fa-solid fa-road" />
      </span>
      <span>
        {{ fDistance }}
      </span>
    </h1>
    <h1 :style="`color:${startColor}`">
      <span class="fa">
        <font-awesome-icon icon="fa-solid fa-car" />
      </span>
      <span>
        {{ devices[0] && devices[0].name }}
      </span>
    </h1>
    <h1 :style="`color:${endColor}`">
      <span class="fa">
        <font-awesome-icon icon="fa-solid fa-location-dot" />
      </span>
      <span>
        {{ geofences[0] && geofences[0].name }}
      </span>
    </h1>
    <p>
      <b>Actualizado: </b>{{ updated }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDistance } from 'date-fns'
import { pt } from 'date-fns/locale'
import { format } from '@/utils/mapbox'
export default {
  name: 'EtaPanel',
  computed: {
    ...mapGetters(['duration', 'distance', 'devices', 'geofences', 'startColor', 'endColor']),
    fDistance () { return format.metric(this.distance) },
    fDuration () { return format.duration(this.duration) },
    updated () {
      return this.devices[0] &&
       formatDistance(new Date(this.devices[0].lastUpdate), new Date(), { addSuffix: true, locale: pt })
    }
  }
}
</script>

<style scoped>

span {
  padding-left: 10px;
}

.fa {
  width: 50px;
  padding: 0 12px 0 0;
  display: inline-block;
}

#eta {
  position: absolute;
  margin: 20px;
  width: 250px;
  top: 0;
  /*bottom: 50%;*/
  padding: 20px;
  background-color: #fffd;
  overflow-y: scroll;
  font-family: sans-serif;
  transition: 0.3s;
}
</style>
