(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{320:function(t,e,r){"use strict";r.d(e,"a",(function(){return o}));r(38),r(43);var n=r(13),o={methods:{gotoItem:function(t){var e=this;return Object(n.a)(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(console.log(t),"track"!=t.type&&"Track"!=t.__model__){r.next=11;break}return e.$toast.info("Playing "+t.name,{duration:2e3}),r.next=5,e.mopidy.tracklist.clear();case 5:return r.next=7,e.mopidy.tracklist.add({uris:[t.uri]});case 7:return r.next=9,e.mopidy.playback.play();case 9:r.next=14;break;case 11:e.lastUri=e.currentUri,e.currentUri=t.uri,e.mopidy.library.browse({uri:t.uri}).then((function(t){console.info(t),e.items=t}));case 14:case"end":return r.stop()}}),r)})))()}}}},370:function(t,e,r){"use strict";r.r(e);r(43);var n=r(13),o={mixins:[r(320).a],data:function(){return{lastUri:null,search:"",currentUri:null,items:[],headers:[{text:"name",value:"name"}]}},mounted:function(){var t=this;this.mopidy=this.$getMopidy(),this.$store.state.cache_store.root&&this.$store.state.cache_store.root.length&&(this.items=this.$store.state.cache_store.root),setTimeout((function(){t.mopidy.library.browse({uri:null}).then((function(e){t.$store.commit("cache_store/setRoot",e),console.info(e),t.items=e}))}),2e3)},methods:{back:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.gotoItem({uri:t.lastUri});case 1:case"end":return e.stop()}}),e)})))()}}},c=r(46),l=r(66),m=r.n(l),h=r(140),d=r(369),f=r(364),component=Object(c.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[t.currentUri?r("v-btn",{on:{click:function(e){return t.back()}}},[t._v("Back")]):t._e(),t._v(" "),r("v-text-field",{attrs:{outlined:""},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}}),t._v(" "),r("v-data-table",{attrs:{search:t.search,headers:t.headers,items:t.items},scopedSlots:t._u([{key:"item.name",fn:function(e){var n=e.item;return[r("p",{staticStyle:{cursor:"pointer"},on:{click:function(e){return t.gotoItem(n)}}},[t._v(t._s(n.name))])]}}])})],1)}),[],!1,null,null,null),v=component.exports;m()(component,{VBtn:h.a,VDataTable:d.a,VTextField:f.a});var _={mounted:function(){var t=this.$getMopidy();window.mopidy=t,t.on("state:online",(function(){t.library.getHistory()}))},components:{Browser:v}},y=r(311),k=Object(c.a)(_,(function(){var t=this.$createElement,e=this._self._c||t;return e("v-container",{attrs:{fluid:""}},[e("h1",[this._v("Juliana")]),this._v(" "),e("Browser")],1)}),[],!1,null,null,null);e.default=k.exports;m()(k,{VContainer:y.a})}}]);