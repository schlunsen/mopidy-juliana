import Vue from "vue";
import { WSController } from "~/libs/WSController.js";
import Mopidy from 'mopidy'
let mopidy;

export default ({ app }, inject) => {
  inject("getMopidy", () => {
      if (!mopidy) {
        
        mopidy = new Mopidy({
            webSocketUrl: "ws://192.168.0.150:6680/mopidy/ws/",
          });
      }
      return mopidy
  });
};
