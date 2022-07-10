<template>
  <div>
    <navbar></navbar>

    <div class="card_ mb-3">
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
         <button class="card_button btn mt-2"> Modifier votre profil </button>
    </div>

    <div class="card my-4" :key="index" v-for="(post, index) in info">
      <router-link :to="`/post/${post.id}`" class="card_link">
        <div class="card-body">
          <div class="card-body-header">
            <p class="card-body-header-text bold"> Par vous </p>
            <p class="card-body-header-text"> Le {{ new Date(post.post_date).toLocaleString() }} </p>
          </div>
          <img :src="post.post_imageUrl" class="card-image">
          <p class="card-text"> {{ post.post_content }} </p>
          <div class="card-body-footer">
            <i class="fas fa-comment"></i>
            <i class="fas fa-heart"></i>
            <i class="fas fa-edit"></i>
            <i class="fas fa-trash"></i>
          </div>
        </div>
      </router-link>
    </div>

  </div>
</template>

<script>

import NavbarComponent from '@/components/Navbar.vue'
import axios from 'axios'

export default {
  name: 'MyProfilComponent',
  components: {
    'navbar': NavbarComponent,
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
      console.log(this.userId)
      this.axiosInstance.get(`user/${this.userId}`)
        .then(reponse => {
          console.log(reponse);
          this.nom = reponse.data.result[0].nom;
          this.prenom = reponse.data.result[0].prenom;
          this.email = reponse.data.result[0].email;
          this.photo = reponse.data.result[0].user_imageUrl;
          this.info = reponse.data.result;
          console.log(this.info);
        })
    }
  },
  mounted() {
    this.getProfile();
  },
}

</script>

<style scoped>

.card_contain {
  width: 70%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: auto;
  margin-top: 20px;
}

.card_ {
  padding: 15px;
  width: 43%;
  margin: auto;
  border: 0px;
  background: white;
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
  background-color: #D31027;
  color: white;
}

.activite {
  background-color: white;
  width: 43%;
  margin: auto;
  margin-bottom: 0;
  border-radius: 25px;
}

.activite h1 {
  padding: 15px;
  font-size: 30px;
  margin: 0;
}

.card {
  padding: 10px;
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
</style>