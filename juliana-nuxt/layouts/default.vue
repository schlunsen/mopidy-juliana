<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      
      
      
      <v-toolbar-title v-text="title" />
      <v-spacer />
      
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <nuxt />
        
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>mdi-repeat</v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app class="justify-center">
      <span>Rasmus Schlünsen &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <BottomBarPlayer class="bottom-player" style="width: 100%;" />
  </v-app>
</template>

<script>
import BottomBarPlayer from '~/components/BottomBarPlayer.vue'
require("vue-cli-plugin-vuetify-preset-basil/preset");
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Dashboard",
          to: "/"
        },
        {
          icon: "mdi-search",
          title: "Search",
          to: "/search"
        },
        {
          icon: "mdi-settings",
          title: "Settings",
          to: "/settings"
        },

      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Juliana music player"
    };
  },
  components: {
    BottomBarPlayer
  }
};
</script>
<style lang="stylus" scoped>
.bottom-player {
  position: fixed; 
  z-index: 22;
  bottom: 0px;
  height: 50px;
  width: 100%;
  background: red;
  max-width: none;
}
</style>
