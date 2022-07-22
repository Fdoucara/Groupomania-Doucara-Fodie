<template>
  <div>
    <loader></loader>
    <navbar></navbar>
    <mon-profil></mon-profil>

    <div class="card_ mb-4">
      <div class="card_contain">
        <div class="card_img">
          <img :src="photo" class="img-fluid" alt="`Photo de profil`">
        </div>
        <div class="card_body">
          <h5 class="card-name"> {{ nom }} </h5>
          <p class="card-firstname"> {{ prenom }} </p>
          <p class="card-email"> {{ email }} </p>
          <p class="card-bio" v-if="bio != '' && bio != null"> <q> {{ bio }} </q> </p>
        </div>
      </div>
    </div>

    <div class="activite mt-2">
      <h1> Activité </h1>
    </div>

    <h3 v-if="showCard == false && id == userId" class="none"> Vous n'avez aucun post pour le moment ! </h3>
    <h3 v-else-if="showCard == false && id != userId" class="none"> Cet utilisateur n'a aucun post pour le moment ! </h3>

    <div v-if="showCard">
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

    <profil-update-modale :profilModale="profilModale" :toggleProfilModale="toggleProfilModale"></profil-update-modale>
    <profil-delete-modale :deleteProfilModale="deleteProfilModale" :toggleDeleteProfilModale="toggleDeleteProfilModale">
    </profil-delete-modale>
  </div>
</template>

<script>

import LoaderComponent from '@/components/Loader.vue'
import NavbarComponent from '@/components/Navbar.vue'
import MyProfilComponent from '@/views/MyProfil.vue'
import UpdateProfilModale from '@/components/UpdateProfilModale.vue'
import DeleteProfilModale from '@/components/DeleteProfilModale.vue'
import axios from 'axios'
import { bus } from '../main'

export default {
  name: 'ProfilComponent',
  components: {
    'loader': LoaderComponent,
    'navbar': NavbarComponent,
    'mon-profil': MyProfilComponent,
    'profil-update-modale': UpdateProfilModale,
    'profil-delete-modale': DeleteProfilModale
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
      bio: null,
      profilModale: false,
      deleteProfilModale: false,
      showCard: true
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
          this.bio = reponse.data.result[0].bio;
          this.info = reponse.data.result;
          if(this.info[0].post_content == '' || this.info[0].post_content == null) {
            this.showCard = false;
          } else {
            this.showCard = true;
          }
        })
    },
    toggleProfilModale() {
      this.profilModale = !this.profilModale;
    },
    toggleDeleteProfilModale() {
      this.deleteProfilModale = !this.deleteProfilModale;
    },
  },
  mounted() {
    this.getProfile();
    bus.$on('updateProfil', () => {
      this.toggleProfilModale();
    });
    bus.$on('deleteProfil', () => {
      this.toggleDeleteProfilModale();
    });
    bus.$on('profilAfterUpdate', () => {
      this.getProfile();
    });
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
  width: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  padding-top: 20px;
  padding-bottom: 10px;
}

.card_img {
  max-width: 150px;
}

.img-fluid {
  margin-bottom: 15px;
  padding: 0;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.card_body {
  width: 60%;
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
  background-color: #D31027;
  width: 43%;
  margin: auto;
  margin-bottom: 0;
}

.activite h1 {
  color: white;
  padding: 10px;
  font-size: 23px;
  margin: 0;
}

.none {
  margin-top: 100px;
  color: white;
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
}

.card-text {
  text-align: left;
  font-size: 23px;
  margin: 0;
  padding-top: 25px;
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