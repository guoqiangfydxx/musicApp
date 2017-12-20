<template>
  <div id="recommend" ref="recommend">
  	<scroll ref="scroll" class="recommend_content" :data="discList">
      <div>
        <div class="slider-wrapper" v-if="sliders.length">
          <slider>
            <div v-for="item in sliders">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend_list">
          <h1 class="list_title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item" @click="selectItem(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading_container" v-show="!discList">
        <loading></loading>
      </div>
  	</scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getRecommend, getDiscList} from '@/api/recommend'
import {ERR_OK} from '@/api/config'
import Slider from '@/base/slider/slider'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {PlayListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  mixins: [PlayListMixin],
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  data() {
    return {
      sliders: [],
      discList: []
    }
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.sliders = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    loadImage() {
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: '/recommend/' + item.dissid
      })
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import '~common/stylus/variable'
  #recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend_content
      height: 100%
      overflow:hidden
      .slider_wrapper
        position:relative
        width: 100%
        overflow: hidden
      .recommend_list
        .list_title
          height: 65px
          line-height:65px
          text-align:center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing:border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow:hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading_container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)

</style>
