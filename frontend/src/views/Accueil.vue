<template>
  <div>

    <!-- <div class="loader-container">
      <div class="loader"></div>
    </div> -->

    <navbar></navbar>
    <creation :info="info" @updateList="newList"></creation>

    <div class="card my-4" :key="index" v-for="(post, index) in info">
      <router-link :to="`/post/${post.id}`" class="card_link">
        <div class="card-body" :user_id="post.user_id">
          <div class="card-body-header">
            <router-link :to="`/profil/${post.user_id}`" v-if="post.user_id == userId"> <p class="card-body-header-text bold"> Crée par vous </p> </router-link>
            <router-link :to="`/profil/${post.user_id}`" v-else> <p class="card-body-header-text bold" > {{ post.nom + ' ' + post.prenom }} </p> </router-link>
            <p class="card-body-header-text"> Le {{ new Date(post.post_date).toLocaleString() }} </p>
          </div>
          <img :src="post.post_imageUrl" class="card-image">
          <p class="card-text"> {{ post.post_content }} </p>
          <div class="card-body-footer">
            <router-link to="/" class="logo_link"> <i class="fas fa-comment"></i> </router-link>
            <i class="fas fa-heart"></i>
            <router-link to="/" v-if="post.user_id == userId" class="logo_link"> <i class="fas fa-edit" ></i> </router-link>
            <router-link to="/" v-if="post.user_id == userId" class="logo_link"> <i class="fas fa-trash" ></i> </router-link>
          </div>
        </div>
      </router-link>
    </div>

  </div>
</template>

<script>

import NavbarComponent from '@/components/Navbar.vue'
import CreationPost from '@/components/CreationPost.vue'
import axios from 'axios'

export default {
  name: 'AccueilComponent',
  components: {
    'navbar': NavbarComponent,
    'creation': CreationPost
  },
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      info: undefined,
      userId: this.$store.state.userId,
      showYou: false,
    }
  },
  methods: {
    postList() {
      this.axiosInstance.get('post')
        .then(reponse => {
          this.info = reponse.data.result
        })
    },
    newList() {
      this.postList();
    },
  },
  mounted() {
    this.postList();
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
  padding: 10px;
  width: 43%;
  margin: auto;
  border: 0px;
  border-radius: 15px;
  background: white;
}

.card:hover {
  background: #eef2f3;
}

.card_link {
  text-decoration: none;
  color: black;
  padding: 0;
  margin: 0;
  transition: background 0.5s ease-in-out;
}

.card-body {
  width: 100%;
  margin: 0;
}

.card-body-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-body-header-text {
  margin-bottom: 10px;
  font-size: 18px;
}

.bold {
  font-weight: bold;
}

img {
  width: 100%;
  height: auto;
  padding-bottom: 25px;
}

.card-text {
  text-align: left;
  font-size: 22px;
  margin: 0;
  padding-bottom: 25px;
}

.card-body-footer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 10px;
  font-size: 25px;
}

.logo_link {
  text-decoration: none;
  color: black;
}
</style>