<template>
  <scroll ref="suggest" class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" @beforeScroll="listScroll" :beforeScroll="beforeScroll">
   <ul class="suggest-list">
    <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
     <div class="icon">
      <i :class="getIconCls(item)"></i>
     </div>
     <div class="name">
      <p class="text" v-html="getDisplayName(item)"></p>
     </div>
    </li>
    <loading v-show="hasMore" title=""></loading>
   </ul> 
   <div class="no-result-wrapper" v-show="!hasMore && !result.length">
    <no-result :title="title"></no-result>
   </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {search} from '@/api/search'
import {ERR_OK} from '@/api/config'
import {createSong} from 'common/js/song'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import NoResult from '@/base/no-result/no-result'
const TYPE_SINGER = 'singer'
const perpage = 20
export default {
  props: {
    query: {
      type: String,
      default: '1111'
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      title: '抱歉，暂无搜索结果',
      beforeScroll: true
    }
  },
  created() {
    this._search()
  },
  methods: {
    listScroll() {
      this.$emit('listScroll')
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._getResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    _search() {
      this.hasMore = true
      this.page = 1
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._getResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    _getResult(data) {
      let result = []
      if (data.zhida && data.zhida.singerid) {
        result.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        result = result.concat(this._normalizeSongs(data.song.list))
      }
      return result
    },
    _normalizeSongs(list) {
      let result = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          result.push(createSong(musicData))
        }
      })
      return result
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query() {
      this._search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
 @import '~common/stylus/variable'
 @import '~common/stylus/mixin'
 .suggest
  height: 100%
  overflow: hidden
  .suggest-list
   padding: 0 30px
   .suggest-item
    display: flex
    align-items:center
    padding-bottom: 20px
   .icon
    flex: 0 0 30px
    width: 30px
    [class^='icon-']
     font-size: 14px
     color: $color-text
   .name
    flex: 1
    font-size: $font-size-medium
    color: $color-text-d
    overflow: hidden
    .text
     no-wrap()
  .no-result-wrapper
   position: fixed
   width: 100%
   top: 50%
   transform: translateY(-50%)
</style>
