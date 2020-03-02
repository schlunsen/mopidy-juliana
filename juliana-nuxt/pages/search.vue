<template>
  <v-container fluid>
    <v-row>
      <v-checkbox v-model="localSearch" :label="'Local'" />
      <v-checkbox v-model="youtubeSearch" :label="'Youtube'" />
    </v-row>
    <v-text-field
      @keyup.native.enter="searchMopidy"
      outlined
      :label="'Search'"
      v-model="search"
      big
    ></v-text-field>
    <v-btn @click="searchMopidy()">Search</v-btn>
    <v-data-table :headers="headers" :items="items">
      <template v-slot:item.name="{ item }">
        <p style="cursor: pointer;" @click="gotoItem(item)">{{item.name}}</p>
      </template>
      <template v-slot:item.artists="{ item }">
        <p
          v-if="item.artists && item.artists.length"
          style="cursor: pointer;"
          @click="gotoArtist(item)"
        >{{item.artists[0].name}}</p>
      </template>
      <template v-slot:item.album="{ item }">
        <p v-if="item.album" style="cursor: pointer;" @click="gotoAlbum(item)">{{item.album.name}}</p>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { PlayerMixin } from "~/mixins/PlayerMixin.js";
export default {
  mixins: [PlayerMixin],
  data: function() {
    return {
      localSearch: true,
      youtubeSearch: true,
      search: "horse",
      items: [],
      headers: [
        {
          text: "Name",
          value: "name"
        },
        {
          text: "Artist",
          value: "artists"
        },
        {
          text: "Album",
          value: "album"
        },
        {
          text: "Source",
          value: "type"
        }
      ]
    };
  },
  mounted() {
    this.mopidy = this.$getMopidy();
  },
  methods: {
    gotoAlbum(item) {
      console.info(item);
    },
    searchMopidy() {
      let searchQuery = {
        query: {
          any: this.search
        },
        uris: []
      };
      if (this.localSearch) {
        searchQuery.uris.push("local:");
      }
      if (this.youtubeSearch) {
        searchQuery.uris.push("youtube:");
      }

      this.mopidy.library.search(searchQuery).then(res => {
        let newItems = [];
        console.info(res);

        if (!res) return;

        res.forEach(r => {
          if (!r.tracks) return;
          r.tracks.forEach(t => {
            newItems.push({ ...t, type: r.uri });
          });
        });
        this.items = newItems;
      });
    }
  }
};
</script>

<style>
</style>