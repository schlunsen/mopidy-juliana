<template>
  <v-container fluid>
    <h1>Juliana</h1>
    <v-row>
      <v-col cols="12">
        <TrackImageInfo />
      </v-col>
      <v-col cols="12" md="6">
        <Browser />
      </v-col>
      <v-col cols="12" md="6">
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script>
import Browser from "~/components/Browser.vue";
import TrackImageInfo from "~/components/TrackImageInfo.vue";
export default {
  async mounted() {
    let mopidy = await this.$getMopidy();
    window.mopidy = mopidy;
    mopidy.on("state:online", () => {
      mopidy.library.getHistory();
      //      mopidy.playback.next();

      
    });
  },
  components: {
    Browser,
    TrackImageInfo
  }
};
</script>

<style>
</style>