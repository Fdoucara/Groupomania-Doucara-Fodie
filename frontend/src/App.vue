<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>


<script>


export default {
  name: 'App',
}

</script>


<style>

body  {
  background: #0F2027;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #2C5364, #203A43, #0F2027); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

#app {
  font-family: 'Nunito', sans-serif;
  text-align: center;
  color: black;
  padding: 0;
  margin: 0;
}

</style>
