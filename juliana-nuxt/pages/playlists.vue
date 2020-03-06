<template>
  <v-data-table :headers="headers" :items="items">
    <template v-slot:item.name="{ item }">
      <p style="cursor: pointer;" @click="gotoItem(item)">{{item.name}}</p>
    </template>
  </v-data-table>
</template>

<script>
import { PlayerMixin } from "~/mixins/PlayerMixin.js";
export default {
  mixins: [PlayerMixin],
  data: function() {
    return {
      headers: [
        {
          text: "Name",
          value: "name"
        }
      ],
      items: []
    };
  },
  methods: {
    gotoItem(item) {
      if (item.type === "track") {
        this.playItem(item)

      } else {
        this.mopidy.playlists.getItems({ uri: item.uri }).then(res => {
          this.items = res;
        });
      }
    }
  },
  mounted() {
    this.mopidy = this.$getMopidy();

    setTimeout(async () => {
      window.mopidy = await this.mopidy;
      this.mopidy.playlists.asList().then(res => {
        this.items = res;
        console.info(res, "RES");
      });
    }, 2000);
  }
};
</script>

<style>
</style>