<template>
  <v-container class="bottom-player" fluid style="padding:0;">
    <v-row style="padding:0 0 0 10px;">
      <v-col cols="12" md="4" class="d-flex left-side align-center mb-0" style="padding-bottom:0;">
        <v-img
          v-if="albumArt"
          :src="albumArt"
          style="height: 50px; max-width: 50px; margin-right: 10px;"
        />
        <div
          class="d-flex track-info"
          style="align-items: center; margin-bottom: 20px; flex-direction: column; flex-grow: 3;"
          v-if="currentTrack"
        >
          <p
            style="margin:0; text-align:center;"
            v-if="currentTrack && currentTrack.artists"
          >{{currentTrack.artists.map(a => a.name).join(',')}}</p>
          <p>{{currentTrack.name}}</p>
        </div>
        <div class="favourite-icon" style>
          <v-icon style="margin: -10px 0 0 5px;" color="white">mdi-heart</v-icon>
        </div>
      </v-col>

      <v-col
        cols="12"
        md="4"
        class="justify-center d-flex"
        style="flex-direction: column; justify-content: center; margin-top:-20px; padding-top:0"
      >
        <div
          cols="4"
          md="4"
          class="flex-row-reverse d-flex align-item-center player-controls"
          style="align-items: center; justify-content: center; flex-grow:1 margin-bottom: 0px;"
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
        </div>

        <v-slider
          v-if="hasSlider"
          color="white"

          track-color="#3f3f3f"
          label-color="white"
          @change="sliderChange"
          style="margin:0 max-width:80%; max-height: 50px; margin-bottom: -20x;"
          v-model="trackSlider"
          min="0"
          :max="trackLength"
          :label="null"
        ></v-slider>
      </v-col>
      <v-col cols="4" class="align-center d-flex">
        <div class="d-flex align-baseline flex-row-reverse full-width mr-2" style="width: 100%">
          <v-slider
            :prepend-icon="'mdi-volume-high'"
            class="volume-slider"
            color="white"
            track-color="#3f3f3f"
            label-color="white"
            @change="volumeChange"
            style="margin:0"
            v-model="volumeSlider"
            :min="0"
            :max="100"
          ></v-slider>

          <div>
            <v-icon @click="volumeSlider= 0 " v-if="volumeSlider > 0" color="white">mdi-volume-high</v-icon>
            <v-icon @click="volumeSlider = 100 " v-else color="white">mdi-volume-variant-off</v-icon>
          </div>
        </div>
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
      volumeSlider: 100,
      trackLabel: "0:00",
      trackLength: 0,
      hasSlider: false,
      albumArt: ""
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
    volumeChange() {
      this.mopidy.mixer.setVolume({
        volume: parseInt(this.volumeSlider, 10)
      });
    },
    playNext() {
      this.mopidy.playback.next();
    },
    playPrev() {
      this.mopidy.playback.previous();
    },
    sliderChange() {
      this.mopidy.playback.seek({
        time_position: this.trackSlider
      });
    },
    async init() {
      this.state = await this.mopidy.playback.getState();
      this.isMuted = await this.mopidy.mixer.getMute();
      this.volumeSlider = await this.mopidy.mixer.getVolume();

      console.info(this.isMuted);
      this.currentTrack = await this.mopidy.playback.getCurrentTrack();
      this.albumArt = await this.mopidy.library.getImages({
        uris: [this.currentTrack.uri]
      });
      console.info(this.currentTrack);

      if (this.currentTrack) {
        this.trackSlider = await this.mopidy.playback.getTimePosition();
        this.trackLength = this.currentTrack.length;
      }
      this.trackLabel = "" + Math.round(this.trackSlider / 1000);

      this.hasSlider = this.currentTrack && this.currentTrack.length > 0;
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
  },
  watch: {
    volumeSlider() {
      this.volumeChange();
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
.favourite-icon {
  align-items: center;
  margin-bottom: 20px;
}

.volume-slider {
  max-width: 40% !important;
}



@media screen and (min-width: 960px) {
  .player-controls {
  margin-top: 30px;
}
}

@media screen and (max-width: 960px) {
  .bottom-player {
    height: 150px;
  }
  .track-info {
    width: 100%;
  }
  .favourite-icon {
    align-items: flex-start;
    justify-content: flex-start;
    color: red;
    display: none;
    
    margin-bottom: 20px;
  }
}
</style>