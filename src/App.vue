<template>
  <div id="app">
   <mheader></mheader>
   <tab></tab>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
  <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import Mheader from './components/m-header/m-header'
import Tab from './components/tab/tab'
import Player from 'components/player/player'
export default {
  components: {
    Mheader,
    Tab,
    Player
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgba(255,255,255,0.5);
}
</style>
