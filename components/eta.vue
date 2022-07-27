<template>
  <div id="eta">
    <h1>{{ fDuration }} {{ fDistance }}</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from '@/utils/mapbox'
export default {
  name: 'EtaPanel',
  computed: {
    ...mapGetters(['duration', 'distance']),
    fDistance () { return format.metric(this.distance) },
    fDuration () { return format.duration(this.distance) }
  }
}
</script>

<style scoped>

#eta {
  position: absolute;
  margin: 20px;
  width: 250px;
  top: 0;
  bottom: 50%;
  padding: 20px;
  background-color: #fffd;
  overflow-y: scroll;
  font-family: sans-serif;
}
</style>
