<template>
  <div id="header">
  	<span class="icon"></span>
  	<span class="text">Chicken Music</span>
  	<router-link to="/user" class="mine" tag="div">
  		<i class="icon-mine"></i>
  	</router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {

}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
	@import '~common/stylus/mixin.styl'
	#header
		height: 44px
		line-height: 44px
		color:#ffcd32
		text-align: center;
		.icon
			display:inline-block
			width:30px
			height:32px
			margin-top: 6px
			background-size:30px 32px
			background-repeat:no-repeat
			bg-image('logo')
		.text
			height: 44px
			line-height: 44px
			vertical-align: top
			display:inline-block
		.mine
			position: absolute
			top: 0
			right: 0
			.icon-mine
				display: block
				padding: 12px
				font-size: 20px
				color: $color-theme
</style>
