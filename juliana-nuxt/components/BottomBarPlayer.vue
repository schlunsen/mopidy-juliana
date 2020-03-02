<template>
  <v-container fluid style="padding:0;">
    <v-row style="padding:0 0 0 20px;;">
      <v-col cols="6" class="justify-space-between d-flex">
        <p
          v-if="currentTrack && currentTrack.artists"
        >{{currentTrack.artists.map(a => a.name).join(',')}} - {{currentTrack.name}}</p>
        <p v-else>{{currentTrack.name}}</p>
        
      </v-col>
      <v-col cols="6" class="flex-row-reverse d-flex align-start">
        <v-btn small @click="togglePlay()" style="margin: 0px 10px 5px 0;">
          <span v-if="state === 'playing'">Pause</span>
          <span v-else>Play</span>
        </v-btn>
        <v-btn small @click="togglePlay()" style="margin: 0px 10px 5px 0;">
          <span v-if="!isMuted">mute</span>
          <span v-else>Unmute</span>
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
      currentTrack: "",
      isMuted: false,
    };
  },
  async mounted() {
    this.mopidy = await this.$getMopidy();
    this.mopidy.on("state", async () => {
      this.init();
      this.interval = setInterval(() => {
        this.init()
      }, 5000);
    });
  },
  destroyed() {
    clearInterval(this.interval)
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