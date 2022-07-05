<template>
  <div>
    <navbar></navbar>
    <div class="card">
        <div class="card-body">
          <div class="card-body-header">
            <p class="card-body-header-text bold"> {{ nom }} </p>
            <p class="card-body-header-text"> {{ prenom }} </p>
          </div>
          <img :src="photo" class="card-image">
          <p class="card-text"> {{ email }} </p>
          <div class="card-body-footer">
            <i class="fas fa-comment"></i>
            <i class="fas fa-heart"></i>
            <i class="fas fa-edit"></i>
            <i class="fas fa-trash"></i>
          </div>
        </div>
    </div>
  </div>
</template>

<script>

import NavbarComponent from '@/components/Navbar.vue'
import axios from 'axios'

export default {
  name: 'ProfilComponent',
  components: {
    'navbar': NavbarComponent,
  },
  data() {
    return {
      userId: this.$store.state.userId,
        axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      nom: null,
      prenom: null,
      email: null,
      photo: null,
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
        })
    }
  },
  mounted() {
    this.getProfile();
  },
}

</script>

<style scoped>
.card {
  width: 40%;
  margin: auto;
  border: 0px;
  border-radius: 0px;
  background: #C9D6FF;
}

.card_link {
  text-decoration: none;
  color: black;
  padding: 0;
  margin: 0;
  transition: background 0.5s ease-in-out;
}

.card_link:hover {
  background: #eef2f3;
}

.card-body {
  width: 100%;
  margin: 0;
  border-top: 1px solid grey;
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
  padding-top: 10px;
  padding-bottom: 25px;
  font-size: 22px;
}
</style>