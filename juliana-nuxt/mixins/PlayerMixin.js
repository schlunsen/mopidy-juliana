const PlayerMixin = {
  methods: {
    async playItem(item) {
      this.$toast.info("Playing " + item.name, { duration: 2000 });
      await this.mopidy.tracklist.clear();
      await this.mopidy.tracklist.add({ uris: [item.uri,...this.items.map(i => i.uri)] });
      await this.mopidy.playback.play();
    },
    async gotoItem(item) {
      this.$root.$emit("gotoItem");

      if (item.type == "track" || item.__model__ == "Track") {
        this.playItem(item);
      } else {
        if (this.folders.find((e => e.uri == item.uri))) {
          while (this.folders[this.folders.length -1].uri !== item.uri) {
              this.folders.pop()
          }

        } else {
          this.folders.push(item)
        }
        
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
