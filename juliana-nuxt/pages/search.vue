<template>
  <v-container fluid>
    <v-text-field outlined :label="'Search'" v-model="search" big></v-text-field>
    <v-btn @click="searchMopidy()">Search</v-btn>
    <v-data-table :headers="headers" :items="items">
      <template v-slot:item.name="{ item }">
        <p style="cursor: pointer;" @click="gotoItem(item)">{{item.name}}</p>
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
      search: "horse",
      items: [],
      headers: [
        {
          text: "Name",
          value: "name"
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
    searchMopidy() {
      this.mopidy.library
        .search({
          query: {
            any: this.search
          }
        })
        .then(res => {
          let newItems = [];
          console.info(res)

          if (!res) return;

          res.forEach(r => {
            r.tracks.forEach(t => {
              newItems.push({...t, type: r.uri});
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