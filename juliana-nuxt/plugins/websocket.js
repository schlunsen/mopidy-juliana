import Vue from "vue";
import Mopidy from 'mopidy'
let mopidy;

export default ({ app, env }, inject) => {
  inject("getMopidy", async () => {
      if (!mopidy) {
        console.info(env)
        
        mopidy = new Mopidy({
            webSocketUrl: "wss://" + env.api +"/juliana/ws/",
          });
      }
      return mopidy
  });
};
