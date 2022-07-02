<template>
  <div>

    <div class="loader-container">
      <div class="loader"></div>
    </div>

    <navbar></navbar>
   
    <div class="card" :key="index" v-for="(post, index) in info">
      <div class="card-body">
        <img :src="post.post_imageUrl" class="card-image">
        <p class="card-text"> {{ post.post_content }} </p>
      </div>
      <div class="card-footer text-muted">
        {{ new Date(post.post_date).toLocaleString() }}
      </div>
    </div>
    
  </div>
</template>

<script>

import NavbarComponent from '@/components/Navbar.vue'
import axios from 'axios'

export default {
  name: 'AccueilComponent',
  components: {
    'navbar': NavbarComponent,  
  },
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      info: null
    }
  },
  mounted() {
    this.axiosInstance.get('post')
    .then(reponse => {
      this.info = reponse.data.result;
      console.log(this.info);
    })
  },
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
  background: #232526;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #414345, #232526);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #414345, #232526);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  animation: loader 0.01s 2.5s forwards;
}

.loader {
  display: block;
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 7px solid transparent;
  border-top-color: #606c88;
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
  border-top-color: #536976;
  animation: spin 1.5s linear infinite;
}

.card {
  width: 50%;
  margin: auto;
  padding-top: 30px;
background: #C9D6FF;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #E2E2E2, #C9D6FF);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #E2E2E2, #C9D6FF); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
.card-body {
  width: 100%;
  margin: auto;
}

img {
  width: 90%;
  height: auto;
}

.card-text {
  font-size: 25px;
  padding-top: 15px;
}
</style>