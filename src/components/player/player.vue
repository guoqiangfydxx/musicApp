<template>
	<div id="player" v-show="playList.length > 0">
		<transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img :src="currentSong.image" alt="" width="100%" height="100%">
				</div>
				<div class="top">
					<div class="back" @click="back">
						<i class="icon-back"></i>
					</div>
					<h1 class="title">{{currentSong.name}}</h1>
					<h2 class="subtitle">{{currentSong.singer}}</h2>
				</div>
				<div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend.prevent="middleTouchEnd">
					<div class="middle-l" ref="middleL">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" :class="cdCls">
								<img :src="currentSong.image" alt="" class="image">
							</div>
						</div>
						<div class="playing-lyric-wrapper">
							<div class="playing-lyric">{{playingLyric}}</div>
						</div>
					</div>
					<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current' : currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active': currentDotShow === 'cd'}"></span>
						<span class="dot" :class="{'active': currentDotShow === 'lyric'}"></span>
					</div>
					<div class="progress-wrapper">
						<span class="time time-l">{{formatTime(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<progress-bar :percent="percent" @progressChange="onProgressBarChange"></progress-bar>
						</div>
						<span class="time time-r">{{formatTime(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<div class="icon i-left" @click="changeMode">
							<i :class="iconMode"></i>
						</div>
						<div class="icon i-left" :class="disableCls">
							<i @click="prev" class="icon-prev"></i>
						</div>
						<div class="icon i-center" :class="disableCls">
							<i @click="togglePlaying" :class="playIcon"></i>
						</div>
						<div class="icon i-right" :class="disableCls">
							<i @click="next" class="icon-next"></i>
						</div>
						<div class="icon i-right">
							<i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon" >
					<img :class="cdCls" :src="currentSong.image" alt="" width="40" height="40">
				</div>
				<div class="text">
					<h2 class="name">{{currentSong.name}}</h2>
					<p class="desc">{{currentSong.singer}}</p>
				</div>
				<div class="control">
					<progress-circle :radius="radius" :percent="percent">
						<i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
					</progress-circle>
				</div>
				<div class="control" @click.stop="showPlayingList">
					<i class="icon-playlist"></i>
				</div>
			</div>
		</transition>
    <playing-list ref="playinglist"></playing-list>
		<audio ref="audio" :src="currentSong.url" @error="err" @play="ready" @timeupdate="updateTime" @ended="end"></audio>
	</div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import ProgressBar from '@/base/progress-bar/progress-bar'
  import {playMode} from 'common/js/config'
  import ProgressCircle from '@/base/progress-circle/progress-circle'
  import LyricParser from 'lyric-parser'
  import Scroll from '@/base/scroll/scroll'
  import PlayingList from 'components/playing-list/playing-list'
  import {playerMixin} from 'common/js/mixin'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentDotShow: 'cd',
        playingLyric: ''
      }
    },
    created() {
      this.touch = {}
    },
    computed: {
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini icon-mini' : 'icon-play-mini'
      },
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'playcurrIndex',
        'mode',
        'sequenceList',
        'favoriteList'
      ])
    },
    methods: {
      showPlayingList() {
        this.$refs.playinglist.show()
      },
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      enter(el, done) {
        const {x, y, scale} = this._getOriginPosition()
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getOriginPosition()
        this.$refs.cdWrapper.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style['transform'] = ''
      },
      _getOriginPosition() {
        const miniWidth = 40
        const miniLeft = 40
        const miniBottom = 30
        const normalTop = 80
        const width = window.innerWidth * 0.8
        const scale = miniWidth / width
        const x = -(window.innerWidth / 2 - miniLeft)
        const y = window.innerHeight - normalTop - width / 2 - miniBottom
        return {
          x,
          y,
          scale
        }
      },
      togglePlaying() {
        if (!this.songReady) {
          return
        }
        this.setPLayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      prev() {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
          return
        } else {
          let index = this.playcurrIndex - 1
          if (index === -1) {
            index = this.playList.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      next() {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
          return
        } else {
          let index = this.playcurrIndex + 1
          if (index === this.playList.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      ready() {
        this.songReady = true
        this.savePlayingHistory(this.currentSong)
      },
      err() {
        this.songReady = true
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      formatTime(time) {
        time = time | 0
        let minute = (time / 60) | 0
        let second = time % 60
        second = second < 10 ? '0' + second : second
        return `${minute}:${second}`
      },
      onProgressBarChange(percent) {
        this.$refs.audio.currentTime = this.currentSong.duration * percent
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(this.$refs.audio.currentTime * 1000)
        }
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      getLyric() {
        this.currentSong.getSongLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new LyricParser(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.currentLineNum = 0
          this.playingLyric = ''
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.startY = e.touches[0].pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const diffx = e.touches[0].pageX - this.touch.startX
        const diffy = e.touches[0].pageY - this.touch.startY
        if (Math.abs(diffy) - Math.abs(diffx) > 0) {
          return
        }
        const left = this.currentDotShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(Math.max(-window.innerWidth, left + diffx), 0)
        this.touch.percent = Math.abs(offsetWidth) / window.innerWidth
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style.transitionDuration = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style.transitionDuration = 0
      },
      middleTouchEnd(e) {
        let offsetWidth
        let opacity
        if (this.currentDotShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentDotShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentDotShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style.transitionDuration = 300 + 'ms'
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style.transitionDuration = 300 + 'ms'
        this.touch.initiated = false
      },
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN',
        setPLayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_PLAY_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      }),
      ...mapActions([
        'savePlayingHistory'
      ])
    },
    watch: {
      currentSong(newval, oldval) {
        if (!newval.id) {
          return
        }
        if (newval.id === oldval.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      playing(newval) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newval ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      PlayingList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable'
	@import '~common/stylus/mixin'	
	#player	
		.normal-player
			position: fixed
			top: 0
			bottom: 0
			left: 0
			right: 0
			background: $color-background
			z-index: 150
			&.normal-enter-active,&.normal-leave-active
				transition: all .3s
				.top,.bottom
					transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
			&.normal-enter,&.normal-leave-to
				opacity: 0
				.top
					transform: translate3d(0, -100px, 0)
				.bottom
					transform: translate3d(0, 100px, 0)
			.background
				position: absolute
				left: 0
				top: 0
				width: 100%
				height: 100%
				z-index: -1
				opacity: 0.6
				filter: blur(20px)
			.top
				position: relative
				margin-bottom: 25px
				.back
					position: absolute
					left: 6px
					top: 0
					z-index: 50
					.icon-back
						display: block
						padding: 9px
						font-size: $font-size-large-x
						color: $color-theme
						transform: rotate(-90deg)
				.title
					width: 70%
					margin: 0 auto
					line-height:40px
					text-align:center
					no-wrap()
					font-size: $font-size-large
					color: $color-text
				.subtitle
					line-height: 20px
					text-align:center
					font-size: $font-size-medium
					color: $color-text
			.middle
				position: fixed
				width: 100%
				top: 80px
				bottom: 170px
				white-space: nowrap
				font-size: 0
				.middle-l
					display:inline-block
					vertical-align:top
					position: relative
					width: 100%
					height: 0
					padding-top: 80%
					.cd-wrapper
						position: absolute
						left: 10%
						top: 0
						width: 80%
						height: 100%
						.cd
							height: 100%
							width: 100%
							box-sizing: border-box
							border: 10px solid rgba(255,255,255,0.1)
							border-radius: 50%
							&.play
								animation: rotate  20s linear infinite
							&.pause
								animation-play-state: paused
							.image
								width: 100%
								height: 100%
								position: absolute
								top: 0
								left: 0
								border-radius: 50%
					.playing-lyric-wrapper
						width: 80%
						margin: 30px auto 0 auto
						overflow:hidden
						text-align:center
						.playing-lyric
							height: 20px
							line-height: 20px
							font-size: $font-size-medium
							color: $color-text
        .middle-r
					display:inline-block
					vertical-align:top
					width: 100%
					height: 100%
					overflow:hidden
					.lyric-wrapper	
						width: 80%
						margin: 0 auto
						overflow: hidden
						text-align:center
						.text
							line-height: 32px
							color: $color-text-l
							font-size: $font-size-medium
							&.current
								color:$color-text
      .bottom
				position: absolute
				bottom: 50px
				width: 100%
				.dot-wrapper
					text-align:center
					font-size: 0
					.dot
						display:inline-block
						vertical-align: middle
						margin: 0 4px
						width: 8px
						height: 8px
						border-radius: 50%
						background: $color-text-l
						&.active
							width: 20px
							border-radius: 5px
							background: $color-text-ll
				.progress-wrapper
					display: flex
					align-items: center
					width: 80%
					margin: 0 auto
					padding: 10px 0
					.time
						color: $color-text
						font-size: $font-size-small
						flex: 0 0 30px
						line-height: 30px
						width: 30px
						&.time-l
							text-align:left
						&.time-r
							text-align:right
					.progress-bar-wrapper
						flex: 1
				.operators
					display:flex
					align-items: center
					.icon
						flex: 1
						color: $color-theme
						&.disable
							color: $color-theme-d
						i
							font-size: 30px
					.i-left
						text-align:right
					.i-center
						pading: 0 20px
						text-align:center
					.i-right
						text-align:left
					.icon-favorite
						color: $color-sub-theme
		.mini-player
			display: flex
			align-items: center
			position: fixed
			bottom: 0
			left: 0
			width: 100%
			height: 60px
			background: $color-highlight-background
			z-index: 180
			&.mini-enter-active,&.mini-leave-active
				transition: all 0.4s
			&.mini-enter, &.mini-leave-to
				opacity: 0
			.icon
				flex: 0 0 40px
				width: 40px
				padding: 0 10px 0 20px
				img
					border-radius: 50%
					&.play
						animation: rotate 10s linear infinite
					&.pause
						animation-play-state: paused
			.text
				display: flex
				flex-direction: column
				justify-content: center
				flex: 1
				line-height: 20px
				overflow: hidden
				.name
					margin-bottom: 2px
					no-wrap()
					font-size: $font-size-medium
					color: $color-text
				.desc
					no-wrap()
					font-size: $font-size-small
					color: $color-text-d
			.control
				flex:  0 0 30px
				width: 30px
				padding: 0 10px
				.icon-play-mini, icon-pause-mini, .icon-playlist
					font-size: 30px
					color: $color-theme-d
				.icon-mini
					font-size: 32px
					position: absolute
					top: 0
					left: 0
		@keyframes rotate
			0%
				transfrom: rotate(0)
			100%
				transform: rotate(360deg)
</style>