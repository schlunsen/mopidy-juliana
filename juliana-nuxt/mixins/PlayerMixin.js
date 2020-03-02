const PlayerMixin = {
  methods: {
    async playItem(item) {
      this.$toast.info("Playing " + item.name, { duration: 2000 });
      await this.mopidy.tracklist.clear();
      await this.mopidy.tracklist.add({ uris: [item.uri] });
      await this.mopidy.playback.play();
    },
    async gotoItem(item) {
      this.$root.$emit("gotoItem");

      if (item.type == "track" || item.__model__ == "Track") {
        this.playItem(item);
      } else {
        this.lastUri = this.currentUri;
        this.currentUri = item.uri;
        this.mopidy.library
          .browse({
            uri: item.uri
          })
          .then(res => {
            console.info(res);
            this.items = res;
          });
      }
    }
  }
};

export { PlayerMixin };
