const PlayerMixin = {
  methods: {
    async gotoItem(item) {
      console.log(item);

      if (item.type == "track" || item.__model__ == "Track") {
        this.$toast.info("Playing " + item.name, { duration: 2000 });
        await this.mopidy.tracklist.clear();
        await this.mopidy.tracklist.add({ uris: [item.uri] });
        await this.mopidy.playback.play();
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
