webpackJsonp([4],{NSSj:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s=e("Dd8w"),i=e.n(s),a=e("kvay"),o=e("NYxO"),r=e("m40h"),c=e("T452"),l=e("PvFA"),d={data:function(){return{songslist:[]}},computed:i()({title:function(){return this.disc.dissname},bgImage:function(){return this.disc.imgurl}},Object(o.c)(["disc"])),created:function(){this._getDisc()},methods:{_getDisc:function(){var t=this;this.disc.dissid?Object(r.a)(this.disc.dissid).then(function(n){n.code===c.a&&(t.songslist=t._normalizeSongs(n.cdlist[0].songlist))}):this.$router.push("/recommend")},_normalizeSongs:function(t){var n=[];return t.forEach(function(t){t.songid&&t.albumid&&n.push(Object(l.a)(t))}),n}},components:{MusicList:a.a}},u={render:function(){var t=this.$createElement,n=this._self._c||t;return n("transition",{attrs:{name:"slide"}},[n("music-list",{attrs:{title:this.title,bgImage:this.bgImage,songslist:this.songslist}})],1)},staticRenderFns:[]},m=e("VU/8")(d,u,!1,function(t){e("Pif2")},null,null);n.default=m.exports},Pif2:function(t,n,e){var s=e("p0Zx");"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);e("rjj0")("65ed8d65",s,!0)},m40h:function(t,n,e){"use strict";n.c=function(){var t=o()({},c.b,{platform:"h5",uin:0,needNewCode:1,format:"jsonp"});return Object(r.a)("https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg",t,c.c)},n.b=function(){var t=o()({},c.b,{platform:"yqq",hostUin:0,sin:0,ein:29,sortId:5,needNewCode:0,categoryId:1e7,picmid:1,loginUin:0,rnd:Math.random(),format:"json"});return d.a.get("/api/getDiscList",{params:t}).then(function(t){return i.a.resolve(t.data)})},n.a=function(t){var n=o()({},c.b,{disstid:t,type:1,json:1,utf8:1,onlysong:0,platform:"yqq",hostUin:0,needNewCode:0,format:"json"});return d.a.get("/api/getDisc",{params:n}).then(function(t){return i.a.resolve(t.data)})};var s=e("//Fk"),i=e.n(s),a=e("woOf"),o=e.n(a),r=e("Gak4"),c=e("T452"),l=e("mtWM"),d=e.n(l)},p0Zx:function(t,n,e){(t.exports=e("FZ+f")(!0)).push([t.i,"\n.slide-enter-active,\n.slide-leave-active {\n  -webkit-transition: all 0.3s;\n  transition: all 0.3s;\n}\n.slide-enter,\n.slide-leave-to {\n  -webkit-transform: translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0);\n}","",{version:3,sources:["E:/xampp/htdocs/musicApp/vueMusic/src/components/disc/disc.vue"],names:[],mappings:";AACA;;EAEE,6BAA6B;EAC7B,qBAAqB;CACtB;AACD;;EAEE,2CAA2C;UACnC,mCAAmC;CAC5C",file:"disc.vue",sourcesContent:["\n.slide-enter-active,\n.slide-leave-active {\n  -webkit-transition: all 0.3s;\n  transition: all 0.3s;\n}\n.slide-enter,\n.slide-leave-to {\n  -webkit-transform: translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0);\n}"],sourceRoot:""}])}});
//# sourceMappingURL=4.e3a6d28518713dae95f0.js.map