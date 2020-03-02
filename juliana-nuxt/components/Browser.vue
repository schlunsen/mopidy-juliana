<template>
  <div>
    <v-btn v-if="currentUri" @click="back()">Back</v-btn>
    <v-text-field outlined v-model="search" />
    <v-data-table :search="search" :headers="headers" :items="items">
      <template v-slot:item.name="{ item }">
        <p style="cursor: pointer;" @click="gotoItem(item)">{{item.name}}</p>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { PlayerMixin } from "~/mixins/PlayerMixin.js";
export default {
  mixins: [PlayerMixin],
  data: function() {
    return {
      lastUri: null,
      search: '',
      currentUri: null,
      items: [],
      headers: [
        {
          text: "name",
          value: "name"
        }
      ]
    };
  },
  mounted() {
      this.$root.$on('gotoItem', () => {
          this.search = '';
      })
    this.mopidy = this.$getMopidy();
    if (this.$store.state.cache_store.root) {
      if (this.$store.state.cache_store.root.length) {
        this.items = this.$store.state.cache_store.root;
      }
    }
    setTimeout(() => {
      this.mopidy.library
        .browse({
          uri: null
        })
        .then(res => {
          this.$store.commit("cache_store/setRoot", res);
          console.info(res);
          this.items = res;
        });
    }, 2000);
  },
  methods: {
    async back() {
      this.gotoItem({
        uri: this.lastUri
      });
    }
  }
};
</script>

<style>
</style>