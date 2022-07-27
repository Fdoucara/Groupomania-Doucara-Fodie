<template>
  <div class="contain">
    <div class="contain_emoji">
      <p class="contain_emoji_item"> &#10067; </p>
      <p class="contain_emoji_item"> &#10067; </p>
      <p class="contain_emoji_item"> &#10067; </p>
      <p class="contain_emoji_item"> &#10067; </p>
    </div>
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