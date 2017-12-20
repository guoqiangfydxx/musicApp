<template>
  <div id="slider" ref="slider">
  	<div class="slider-group" ref="sliderGroup">
  		<slot></slot>
  	</div>
  	<div class="dots">
  		<span v-for="(item, index) in dots" class="dot" :class="{active: currentPageIndex === index}"></span>
  	</div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    autoPlay: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.sliderScroll) {
        return
      }
      this._setSliderWidth(true)
      this.sliderScroll.refresh()
    })
  },
  beforeDestory() {
    clearTimeout(this.timer)
  },
  methods: {
    _initSlider() {
      this.sliderScroll = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          speed: 400,
          threshold: 0.3
        }
      })

      this.sliderScroll.on('scrollEnd', () => {
        let pageIndex = this.sliderScroll.getCurrentPage().pageX
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          this._play()
        }
      })

      this.sliderScroll.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = this.$refs.slider.clientWidth
      let sliderWidth = 0
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        child.style.width = width + 'px'
        addClass(child, 'slider-item')
        sliderWidth += width
      }
      if (this.loop && !isResize) {
        sliderWidth += 2 * width
      }
      this.$refs.sliderGroup.style.width = sliderWidth + 'px'
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1
      if (this.loop) {
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        this.sliderScroll.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable"
	#slider
    min-height: 1px
    position: relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
