<template>
  <div>

    <loader :visible="visible"></loader>
    <navbar></navbar>
    <creation :info="info" @updateList="newList"></creation>

    <div class="card my-4" :key="index" v-for="(post, index) in info">
      <router-link :to="`/post/${post.id}`" class="card_link">
        <div class="card-body" :user_id="post.user_id">
          <div class="card-body-header">
            <router-link to="/monProfil" v-if="post.user_id == userId" class="card-body-header-text bold"> <p> Par vous </p> </router-link>
            <router-link :to="`/profil/${post.user_id}`" v-else class="card-body-header-text bold"> <p> Par {{ post.nom + ' ' + post.prenom }} </p> </router-link>
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
import LoaderComponent from '@/components/Loader.vue'
import axios from 'axios'

export default {
  name: 'AccueilComponent',
  components: {
    'navbar': NavbarComponent,
    'creation': CreationPost,
    'loader': LoaderComponent
  },
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      info: undefined,
      userId: this.$store.state.userId,
      visible: true,
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
  text-decoration: none;
  color: black;
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