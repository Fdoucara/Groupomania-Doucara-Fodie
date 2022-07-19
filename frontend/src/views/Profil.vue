<template>
  <div>
    <loader></loader>
    <navbar></navbar>
    <mon-profil></mon-profil>

    <div class="card_ mb-4">
      <div class="card_contain">
        <div class="card_img">
          <img :src="photo" class="img-fluid rounded-start" alt="`Photo de profil`">
        </div>
        <div class="card_body">
          <h5 class="card-name"> {{ nom }} </h5>
          <p class="card-firstname"> {{ prenom }} </p>
          <p class="card-email"> {{ email }} </p>
        </div>
      </div>
      <button class="card_button btn btn-primary mt-2" v-if="userId == id"> Modifier votre profil </button>
    </div>

    <div class="activite mt-2">
      <h1> Activité </h1>
    </div>

    <div class="card my-4" :key="index" v-for="(post, index) in info">

      <div class="card-body">
        <router-link :to="`/post/${post.id}`" class="card_link">
          <div class="card-body-header">
            <p class="card-body-header-text bold" v-if="post.user_id == userId"> Par vous </p>
            <p class="card-body-header-text bold" v-else> Par {{ post.nom + ' ' + post.prenom }} </p>
            <p class="card-body-header-text"> Le {{ new Date(post.post_date).toLocaleString() }} </p>
          </div>
          <img :src="post.post_imageUrl" class="card-image">
          <p class="card-text"> {{ post.post_content }} </p>
        </router-link>
        <div class="card-body-footer">
          <i class="fas fa-comment"></i>
          <i class="fas fa-heart"></i>
          <i class="fas fa-edit" v-if="post.user_id == userId"></i>
          <i class="fas fa-trash" v-if="post.user_id == userId"></i>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

import LoaderComponent from '@/components/Loader.vue'
import NavbarComponent from '@/components/Navbar.vue'
import MyProfilComponent from '@/views/MyProfil.vue'
import axios from 'axios'

export default {
  name: 'ProfilComponent',
  components: {
    'loader': LoaderComponent,
    'navbar': NavbarComponent,
    'mon-profil': MyProfilComponent
  },
  data() {
    return {
      userId: this.$store.state.userId,
      id: this.$route.params.id,
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      nom: null,
      prenom: null,
      email: null,
      photo: null,
      info: null,
    }
  },
  methods: {
    getProfile() {
      this.axiosInstance.get(`user/${this.id}`)
        .then(reponse => {
          this.nom = reponse.data.result[0].nom;
          this.prenom = reponse.data.result[0].prenom;
          this.email = reponse.data.result[0].email;
          this.photo = reponse.data.result[0].user_imageUrl;
          this.info = reponse.data.result;
        })
    }
  },
  mounted() {
    this.getProfile();
  },
}

</script>

<style scoped>
.card_ {
  width: 43%;
  margin: auto;
  border: 0px;
  border-radius: 0px;
  background: white;
}

.card_contain {
  width: 70%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: auto;
  padding-top: 20px;
}

.img-fluid {
  width: 100%;
  height: auto;
}

.card_body {
  font-size: 20px;
  text-align: left;
}

.card_button {
  font-size: 20px;
  width: 100%;
  border-radius: 0;
}

.activite {
  background-color: #D31027;
  width: 43%;
  margin: auto;
  margin-bottom: 0;
}

.activite h1 {
  color: white;
  padding: 15px;
  font-size: 30px;
  margin: 0;
}

.card {
  width: 43%;
  margin: auto;
  border: 0px;
  border-radius: 15px;
  background: white;
}

.card_link {
  text-decoration: none;
  color: black;
  padding: 0;
  margin: 0;
}

.card-body {
  width: 100%;
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
  font-weight: 700;
}

img {
  width: 100%;
  height: auto;
  padding-bottom: 25px;
}

.card-text {
  text-align: left;
  font-size: 23px;
  margin: 0;
  padding-bottom: 25px;
}

.card-body-footer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 21px;
}

</style>