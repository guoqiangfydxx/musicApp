<template>
  <div id="tab">
  	<router-link class="tab-item" tag="div" to='/recommend'>
  		<span class="tab-link">推荐</span>
  	</router-link>
  	<router-link class="tab-item" tag="div" to="/singer">
  		<span class="tab-link">歌手</span>
  	</router-link>
  	<router-link class="tab-item" tag="div" to="/rank">
  		<span class="tab-link">排行</span>
  	</router-link>
  	<router-link class="tab-item" tag="div" to="/search">
  		<span class="tab-link">搜索</span>
  	</router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {

}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
	@import '~common/stylus/variable'
	#tab
		height:44px
		line-height:44px
		overflow:hidden
		.tab-item
			float:left
			width:25%
			display:inline-block
			text-align:center
			span
				color:hsla(0,0%,100%,0.5)
				padding-bottom:5px
				border-bottom:1px solid transparent
			&.router-link-active
				.tab-link
					color: $color-theme
					border-bottom:2px solid $color-theme
</style>
