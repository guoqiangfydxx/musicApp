<template>
  <div id="music_list">
  	<div class="back" @click.stop="back">
  		<i class="icon-back"></i>
  	</div>
  	<h1 class="title" v-html="title"></h1>
  	<div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" ref="playBtn">
        <div v-show="songslist.length > 0" class="play" @click="playRandom">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
  		<div class="filter" ref="filter"></div>
  	</div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll :data="songslist" class="list" ref="list" :probeType="probeType" :listenScroll="listenScroll" @scroll="Scroll">
      <div class="song_list_wrapper">
        <song-list :rank="rank" :songs="songslist" @select="openPlayer"></song-list>
      </div>
      <div class="loading-container" v-show="!songslist.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import SongList from '@/base/song-list/song-list'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {mapActions} from 'vuex'
import {PlayListMixin} from 'common/js/mixin'
const REMIAN_HEIGHT = 40
export default {
  mixins: [PlayListMixin],
  props: {
    title: {
      type: String,
      defualt: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songslist: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrolly: 0
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    Scroll(pos) {
      this.scrolly = pos.y
    },
    back() {
      this.$router.back()
    },
    openPlayer(song, index) {
      this.selectPlay({
        list: this.songslist,
        index
      })
    },
    playRandom() {
      this.randomPlay({
        list: this.songslist
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.translateHeight = -this.imageHeight + REMIAN_HEIGHT
    this.$refs.list.$el.style.top = this.imageHeight + 'px'
  },
  watch: {
    scrolly(val) {
      let translatey = Math.max(this.translateHeight, val)
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.bgLayer.style['transform'] = `translate3d(0, ${translatey}px, 0)`
      let precent = Math.abs(val / this.imageHeight)
      if (val > 0) {
        scale += precent
        zIndex = 10
      } else {
        blur = Math.min(20, 20 * precent)
      }
      if (val < this.translateHeight) {
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = REMIAN_HEIGHT + 'px'
        zIndex = 10
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = 'block'
      }
      this.$refs.filter.style['backdrop'] = `blur(${blur}px)`
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #music_list
    position: fixed
    bottom: 0
    right: 0
    top: 0
    left: 0
    z-index: 100
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      text-align:center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
      np-wrap()
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          margin: 0 auto
          width: 135px
          box-sizing: border-box
          padding: 7px 0
          text-align: center
          border: 1px solid $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7,17,27,0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song_list_wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
