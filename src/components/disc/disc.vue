<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songslist="songslist"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getDisc} from '@/api/recommend'
import {ERR_OK} from '@/api/config'
import {createSong} from 'common/js/song'
export default {
  data() {
    return {
      songslist: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created() {
    this._getDisc()
  },
  methods: {
    _getDisc() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getDisc(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songslist = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let result = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          result.push(createSong(musicData))
        }
      })
      return result
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
