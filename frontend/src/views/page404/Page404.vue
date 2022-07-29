<template>
  <div class="contain">
    <h1 class="contain_title"> PAGE </h1>
    <div class="contain_content">
      <p class="contain_content_item"> 4 </p>
      <p class="contain_content_item"> 0 </p>
      <p class="contain_content_item"> 4 </p>
    </div>   
    <p class="contain_text"> Sorry, page not found... </p>
  </div>
</template>

<script>
export default {
  name: 'PageError',
  data() {
    return {
      userId: this.$store.state.userId,
      connected: this.$store.state.connected
    }
  },
}
</script>

<style lang="scss" scoped src="./page404.scss">
</style>