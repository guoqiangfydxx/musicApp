webpackJsonp([5],{BRgg:function(t,n,e){"use strict";n.b=function(){var t=i()({},o.b,{uin:0,needNewCode:1,platform:"h5"});return Object(a.a)("https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg",t,o.c)},n.a=function(t){var n=i()({},o.b,{tpl:3,page:"detail",topid:t,type:"top",song_begin:0,song_num:30,platform:"h5",needNewCode:0});return Object(a.a)("https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg",n,o.c)};var s=e("woOf"),i=e.n(s),a=e("Gak4"),o=e("T452")},s3x3:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s=e("Dd8w"),i=e.n(s),a=e("kvay"),o=e("NYxO"),r=e("BRgg"),c=e("T452"),l=e("PvFA"),u={data:function(){return{songs:[],rank:!0}},computed:i()({title:function(){return this.topList.topTitle},bgImage:function(){return this.songs.length?this.songs[0].image:""}},Object(o.c)(["topList"])),created:function(){this._getRankMusic()},methods:{_getRankMusic:function(){var t=this;this.topList.id?Object(r.a)(this.topList.id).then(function(n){n.code===c.a&&(t.songs=t._normalizeSongs(n.songlist))}):this.$router.push("/rank")},_normalizeSongs:function(t){var n=[];return t.forEach(function(t){var e=t.data;e.songid&&e.albumid&&n.push(Object(l.a)(e))}),n}},components:{MusicList:a.a}},p={render:function(){var t=this.$createElement,n=this._self._c||t;return n("transition",{attrs:{name:"slide"}},[n("music-list",{attrs:{rank:this.rank,title:this.title,bgImage:this.bgImage,songslist:this.songs}})],1)},staticRenderFns:[]},f=e("VU/8")(u,p,!1,function(t){e("vbD7")},null,null);n.default=f.exports},vbD7:function(t,n,e){var s=e("w5Ss");"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);e("rjj0")("12bb79f2",s,!0)},w5Ss:function(t,n,e){(t.exports=e("FZ+f")(!0)).push([t.i,"\n.slide-enter-active,\n.slide-leave-actve {\n  -webkit-transition: all 0.3s ease;\n  transition: all 0.3s ease;\n}\n.slide-enter,\n.slide-leave-to {\n  -webkit-transform: translated(100%, 0, 0);\n          transform: translated(100%, 0, 0);\n}","",{version:3,sources:["E:/xampp/htdocs/musicApp/vueMusic/src/components/top-list/top-list.vue"],names:[],mappings:";AACA;;EAEE,kCAAkC;EAClC,0BAA0B;CAC3B;AACD;;EAEE,0CAA0C;UAClC,kCAAkC;CAC3C",file:"top-list.vue",sourcesContent:["\n.slide-enter-active,\n.slide-leave-actve {\n  -webkit-transition: all 0.3s ease;\n  transition: all 0.3s ease;\n}\n.slide-enter,\n.slide-leave-to {\n  -webkit-transform: translated(100%, 0, 0);\n          transform: translated(100%, 0, 0);\n}"],sourceRoot:""}])}});
//# sourceMappingURL=5.b8bd4a4757b4f0fb85d8.js.map