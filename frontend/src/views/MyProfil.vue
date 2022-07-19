<template>
  <div class="big_contain">

    <div class="card_ mb-2">
      <div class="card_contain">
        <div class="card_img">
          <img :src="photo" class="img-fluid rounded-start" alt="`Photo de profil`">
        </div>
        <div class="card_body">
          <h5 class="card-name"> {{ nom }} </h5>
          <p class="card-firstname"> {{ prenom }} </p>
          <p class="card-email"> {{ email }} </p>
          <p class="card-bio"> {{ bio }} </p>
        </div>
      </div>
      <button class="card_button btn mt-2"> Modifier votre profil </button>
    </div>

    <div class="activite mt-3 mb-2">
      <h1> Mon activité </h1>
    </div>

    <div class="post_scroll" v-if="showCard">
      <div class="card my-2" :key="index" v-for="(post, index) in info">
        <router-link :to="`/post/${post.id}`" class="card_link">
          <div class="card-body">
            <div class="card-body-header">
              <p class="card-body-header-text bold"> Par vous </p>
              <p class="card-body-header-text"> Le {{ new Date(post.post_date).toLocaleDateString() }} </p>
            </div>
            <img :src="post.post_imageUrl" class="card-image">
            <p class="card-text"> {{ post.post_content }} </p>
          </div>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>

import axios from 'axios'
import { bus } from '../main.js'

export default {
  name: 'MyProfilComponent',
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
      bio: null,
      info: null,
      showCard: true,
    }
  },
  methods: {
    getProfile() {
      this.axiosInstance.get(`user/${this.userId}`)
        .then(reponse => {
          this.nom = reponse.data.result[0].nom;
          this.prenom = reponse.data.result[0].prenom;
          this.email = reponse.data.result[0].email;
          this.photo = reponse.data.result[0].user_imageUrl;
          this.bio = reponse.data.result[0].bio;
          this.info = reponse.data.result.reverse();
          if(this.info[0].post_content == null && !this.info[0].post_imageUrl) {
            this.showCard = false;
          } else {
            this.showCard = true;
          }
        })
    }
  },
  mounted() {
    this.getProfile();
    bus.$on('takeProfil', () => {
      this.getProfile();
    });
    bus.$on('listAfterUpdate', () => {
      this.getProfile();
    });
    bus.$on('listAfterDelete', () => {
      this.getProfile();
    });
  },
}
</script>

<style scoped>
.big_contain {
  position: fixed;
  background: #D31027;
  width: 25%;
  height: 100%;
  padding: 20px 0px;
  right: 0;
}

.card_contain {
  width: 90%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: auto;
  margin-top: 20px;
}

.card_ {
  padding: 15px;
  width: 95%;
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
  width: 95%;
  margin: auto;
  margin-bottom: 0;
}

.activite h1 {
  color: black;
  padding: 10px;
  font-size: 23px;
  margin: 0;
}

.post_scroll {
  overflow-y: scroll;
  height: 600px;
  scrollbar-width: none;
}

.post_scroll::-webkit-scrollbar {
  width: 0px;
}

.card {
  padding: 10px;
  width: 95%;
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
  font-weight: 700;
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