<template>
  <v-container class="bottom-player" fluid style="padding:0;">
    <v-row style="padding:0 0 0 10px;">
      <v-col cols="4" class="d-flex left-side">
        <v-img
          :src="'https://i.picsum.photos/id/581/200/200.jpg'"
          style="height: 50px; max-width: 50px; margin-right: 10px;"
        />
        <div class="d-flex" style="align-items: center; margin-bottom: 20px;">
          <v-icon color="white">mdi-heart</v-icon>
          <v-icon color="white">mdi-dots-horizontal</v-icon>
          <v-icon color="white">mdi-volume-high</v-icon>
        </div>
      </v-col>
      <v-col
        cols="4"
        class="justify-center d-flex"
        style="flex-direction: column; justify-content: center;"
      >
        <p
          style="margin:0; text-align:center;"
          v-if="currentTrack && currentTrack.artists"
        >{{currentTrack.artists.map(a => a.name).join(',')}} - {{currentTrack.name}}</p>
        <p v-else>{{currentTrack && currentTrack.name}}</p>
        <v-slider
          v-if="hasSlider"
          color="white"
          label-color="white"
          @change="sliderChange"
          style="margin:0"
          v-model="trackSlider"
          min="0"
          :max="trackLength"
          :label="trackLabel"
        ></v-slider>
      </v-col>

      <v-col
        cols="4"
        class="flex-row-reverse d-flex align-item-center"
        style="align-items: center; margin-bottom: 20px;"
      >
        <v-btn small @click="playNext()" style="margin: 0px 10px 5px 0;">
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>

        <v-btn small @click="togglePlay()" style="margin: 0px 10px 5px 0;">
          <span v-if="state === 'playing'">
            <v-icon>mdi-pause</v-icon>
          </span>
          <span v-else>
            <v-icon>mdi-play</v-icon>
          </span>
        </v-btn>
        <v-btn small @click="toggleMute()" style="margin: 0px 10px 5px 0;">
          <span v-if="!isMuted">
            <v-icon>mdi-volume-variant-off</v-icon>
          </span>
          <span v-else>
            <v-icon>mdi-volume-plus</v-icon>
          </span>
        </v-btn>
        <v-btn small @click="playPrev()" style="margin: 0px 10px 5px 0;">
          <v-icon>mdi-skip-previous</v-icon>
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
      trackSlider: 0,
      trackLabel: "0:00",
      trackLength: 0,
      hasSlider: false
    };
  },
  async mounted() {
    this.mopidy = await this.$getMopidy();
    this.mopidy.on("state", async () => {
      this.init();
      this.interval = setInterval(() => {
        this.init();
      }, 5000);
    });
  },
  destroyed() {
    clearInterval(this.interval);
  },

  methods: {
    playNext() {
      this.mopidy.playback.next()
    },
    playPrev() {
      this.mopidy.playback.previous()
    },
    sliderChange() {
      this.mopidy.playback.seek({
        time_position: this.trackSlider
      });
    },
    async init() {
      this.state = await this.mopidy.playback.getState();
      this.isMuted = await this.mopidy.mixer.getMute();
      console.info(this.isMuted);
      this.currentTrack = await this.mopidy.playback.getCurrentTrack();
      console.info(this.currentTrack);

      if (this.currentTrack) {
        this.trackSlider = await this.mopidy.playback.getTimePosition();
        this.trackLength = this.currentTrack.length;
      }
      this.trackLabel = "" + Math.round(this.trackSlider / 1000);

      this.hasSlider = this.currentTrack.length > 0;
    },
    async toggleMute() {
      if (this.isMuted) {
        await this.mopidy.mixer.setMute({ mute: false });
        this.isMuted = false;
      } else {
        await this.mopidy.mixer.setMute({ mute: true });
        this.isMuted = true;
      }
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
.left-side {
  color: white !important;
}
.bottom-player {
  position: fixed;
  z-index: 22;
  bottom: 0px;
  height: 80px;
  width: 100%;
  background: rgba(24.5, 24.5, 24.5, 1);
  color: white !important;
  max-width: none;
  label {
    color: #ffffff !important;
  }
}
</style>