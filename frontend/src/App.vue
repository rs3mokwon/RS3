<template>
  <div id="app">
    <Header />
    <div id="content" class="content"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/layout/Header'

export default {
  name: 'app',
  components: {
    Header,
    
  },
}
</script>

<style>

</style>