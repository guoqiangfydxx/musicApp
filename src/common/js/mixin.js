import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {upset} from 'common/js/util'

export const PlayListMixin = {
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlaylist method')
    }
  },
  watch: {
    playList(newval) {
      this.handlePlayList(newval)
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      let modeClass = ''
      if (this.mode === playMode.sequence) {
        modeClass = 'icon-sequence'
      } else if (this.mode === playMode.loop) {
        modeClass = 'icon-loop'
      } else {
        modeClass = 'icon-random'
      }
      return modeClass
    },
    ...mapGetters([
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = upset(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    isFavorite(song) {
      let index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      if (index > -1) {
        return true
      } else {
        return false
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    ...mapMutations({
      setCurrentIndex: 'SET_PLAY_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}
