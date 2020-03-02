<template>
  <v-container fluid>
    <h1>Juliana</h1>
    <Browser />

  </v-container>
</template>

<script>
import Browser from "~/components/Browser.vue";
export default {
  mounted() {
    let mopidy = this.$getMopidy();
    window.mopidy = mopidy;
    mopidy.on("state:online", () => {
      mopidy.library.getHistory();
      //      mopidy.playback.next();

      
    });
  },
  components: {
    Browser
  }
};
</script>

<style>
</style>