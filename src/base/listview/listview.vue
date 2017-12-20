<template>
  <scroll class="listview" :data="listData" ref="listview" :listenScroll="listenScroll" @scroll="listScroll" :probeType="probeType">
    <ul>
      <li v-for="group in listData" class="list_group" ref="listgroup">
        <h2 class="list_group_title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list_group_item" @click="selectItem(item)">
            <img v-lazy="item.avatar" alt="" class="avatar">
            <p class="name">{{item.name}}</p>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list_shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" class="item" :data-index="index" :class="currentIndex === index ? 'current' : ''">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="listFixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!listData.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll'
import {getData} from 'common/js/dom'
import loading from '@/base/loading/loading'
export default {
  props: {
    listData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrolly: 0,
      currentIndex: 0,
      diff: -1
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  computed: {
    shortcutList() {
      return this.listData.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrolly > 0) {
        return
      }
      return this.listData[this.currentIndex] ? this.listData[this.currentIndex].title : ''
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      let index = getData(e.target, 'index')
      let firsttouch = e.touches[0]
      this.touch.y1 = firsttouch.pageY
      this.touch.index = index
      this._scrollTo(index)
    },
    onShortcutTouchMove(e) {
      let endtouch = e.touches[0]
      this.touch.y2 = endtouch.pageY
      let diff = (this.touch.y2 - this.touch.y1) / 18 | 0
      let currentindex = parseInt(this.touch.index) + diff
      this._scrollTo(currentindex)
    },
    listScroll(pos) {
      this.scrolly = pos.y
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrolly = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 10)
    },
    _calculateHeight() {
      const list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (var i = 0; i < list.length; i++) {
        let temp = list[i]
        height += temp.clientHeight
        this.listHeight.push(height)
      }
    },
    selectItem(item) {
      this.$emit('select', item)
    }
  },
  watch: {
    scrolly(newY) {
      const listHeight = this.listHeight
      // 滚动到顶部
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 滚动到中间
      for (var i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      this.currnetIndex = this.listHeight.length - 2
    },
    listData() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    diff(val) {
      let fixedTop = (val > 0 && val < 30) ? val - 30 : 0
      if (this.fixed === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.listFixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll,
    loading
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list_group
      padding-bottom: 30px
      .list_group_title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list_group_item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list_shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
