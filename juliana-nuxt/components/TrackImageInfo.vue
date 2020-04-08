<template>
  <div v-if="currentTrack">
      <h2>Currently playing </h2>
      
      
      <h3>{{artist}}</h3>
      <h4>{{currentTrack.name}}</h4>
      

  </div>
</template>

<script>
export default {
    data: function() {
        return {
            currentTrack: null
        }
    },
    async mounted() {
        this.mopidy =  await this.$getMopidy();

        setTimeout(async () => {
            this.currentTrack = await this.mopidy.playback.getCurrentTrack();
            console.info(this.currentTrack)
            this.$forceUpdate()
        }, 200);



        
    },
    computed: {
        artist() {
            if (this.currentTrack) {
                    return this.currentTrack.artists.map(a => a.name).join(',')
            }
            

        },
        img() {
            return null
        }
    }
};
</script>

<style>
</style>