<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6" class="justify-space-between d-flex">
        <p
          v-if="currentTrack"
        >{{currentTrack.artists.map(a => a.name).join(',')}} - {{currentTrack.name}}</p>
        
      </v-col>
      <v-col cols="6" class="flex-row-reverse d-flex">
        <v-btn @click="togglePlay()">
          <span v-if="state === 'playing'">Pause</span>
          <span v-else>Play</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: function() {
    return {
      state: "",
      currentTrack: ""
    };
  },
  async mounted() {
    this.mopidy = await this.$getMopidy();
    this.mopidy.on("state", async () => {
      this.init();
    });
  },

  methods: {
    async init() {
      this.state = await this.mopidy.playback.getState();
      this.currentTrack = await this.mopidy.playback.getCurrentTrack();
    },
    togglePlay() {
      if (this.state === "playing") {
        this.mopidy.playback.pause();
        this.state = "paused";
      } else {
        this.mopidy.playback.play();
        this.state = "playing";
      }
    }
  }
};
</script>

<style>
</style>