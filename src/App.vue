<template>
  <v-app>
    <powerForecast />
  </v-app>
</template>

<script>
import powerForecast from './components/PowerForecast.vue';

export default {
  name: 'App',

  components: {
    powerForecast
  },

  data: () => ({
    //
  }),
};
</script>
