<template>
  <transition name="slide">
  	<music-list :rank="rank" :title="title" :bgImage="bgImage" :songslist="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getRankMusic} from '@/api/rank'
import {ERR_OK} from '@/api/config'
import {createSong} from 'common/js/song'
export default {
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    this._getRankMusic()
  },
  methods: {
    _getRankMusic() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getRankMusic(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let result = []
      list.forEach((item) => {
        const musicData = item.data
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
	.slide-enter-active, .slide-leave-actve
		transition: all 0.3s ease
	.slide-enter, .slide-leave-to
		transform: translated(100%, 0, 0)
</style>
