<template>
  <div>
    <v-breadcrumbs :items="folders">
       <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        @click="gotoItem(item)"
        :disabled="item.disabled"
        style="cursor: pointer;"
      >
        {{ item.name }}
      </v-breadcrumbs-item>
    </template>
    </v-breadcrumbs>
    <v-btn v-if="currentUri" @click="back()">Back</v-btn>
    <v-text-field outlined v-model="search" />
    <v-data-table :search="search" :headers="headers" :items="items" :items-per-page="10000">
      <template v-slot:item.name="{ item }">
        <p v-if="item" style="cursor: pointer;" @click="gotoItem(item)">{{item.name}}</p>
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
      folders: [{
        name: 'Root',
        uri: null
      }],
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
  async mounted() {
      this.$root.$on('gotoItem', () => {
          this.search = '';
      })
    this.mopidy = await this.$getMopidy();
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
      let lastItem = this.folders.pop()
      this.gotoItem({
        uri: lastItem.uri
      });
    }
  }
};
</script>

<style>
</style>