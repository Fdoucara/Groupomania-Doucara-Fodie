<template>
  <div>
    
    <div class="loader-container">
      <div class="loader"></div>
    </div>

  </div>
</template>

<script>
export default {
  name: "LoaderComponent",
}
</script>

<style scoped>

@keyframes loader {
  0% {
    z-index: 2;
  }

  100% {
    z-index: -1;
    opacity: 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loader-container {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background: #0F2027;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #2C5364, #203A43, #0F2027); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  animation: loader 0.01s 1.5s forwards;
}

.loader {
  display: block;
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 7px solid transparent;
  border-top-color: white;
  animation: spin 2s linear infinite;
}

.loader::before,
.loader::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  border: 7px solid transparent;
}

.loader::before {
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  border-top-color: white;
  animation: spin 3s linear infinite;
}

.loader::after {
  top: 40px;
  left: 40px;
  right: 40px;
  bottom: 40px;
  border-top-color: white;
  animation: spin 1.5s linear infinite;
}

</style>