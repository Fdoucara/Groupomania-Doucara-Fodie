<template>
  <div>
    <loader></loader>
    <navbar></navbar>
    <mon-profil></mon-profil>

    <div class="card mb-4">
      <div class="card_contain">
        <div class="card_contain_group">
          <div class="card_contain_group_img">
            <img :src="photo" class="card_contain_group_img_fluid" alt="`Photo de profil`">
          </div>
          <div class="card_contain_group_body">
            <h5 class="card_contain_group_body_name"> {{ nom }} </h5>
            <p class="card_contain_group_body_firstname"> {{ prenom }} </p>
            <p class="card_contain_group_body_email"> {{ email }} </p>
          </div>
        </div>
        <p class="card_contain_bio" v-if="bio != '' && bio != null"> <q> {{ bio }} </q> </p>
      </div>
    </div>

    <div class="activite mt-2">
      <h1> Activité </h1>
    </div>

    <h3 v-if="showCard == false && id == userId" class="none"> Vous n'avez aucun post pour le moment ! </h3>
    <h3 v-else-if="showCard == false && id != userId" class="none"> Cet utilisateur n'a aucun post pour le moment ! </h3>

    <div v-if="showCard">
      <div class="card_post my-4" :key="index" v-for="(post, index) in info">

        <div class="card_post_body">
          <router-link :to="`/post/${post.id}`" class="card_post_body_link">
            <div class="card_post_body_header">
              <p class="card_post_body_header_text bold" v-if="post.user_id == userId"> Par vous </p>
              <p class="card_post_body_header_text bold" v-else> Par {{ post.nom + ' ' + post.prenom }} </p>
              <p class="card_post_body_header_text"> Le {{ new Date(post.post_date).toLocaleDateString() }} </p>
            </div>
            <img :src="post.post_imageUrl" class="card_post_body_image">
            <p class="card_post_body_text"> {{ post.post_content }} </p>
          </router-link>
        </div>
      </div>
    </div>

    <profil-update-modale :profilModale="profilModale" :toggleProfilModale="toggleProfilModale"></profil-update-modale>
    <profil-delete-modale :deleteProfilModale="deleteProfilModale" :toggleDeleteProfilModale="toggleDeleteProfilModale">
    </profil-delete-modale>
  </div>
</template>

<script>

import LoaderComponent from '@/components/Loader/Loader.vue'
import NavbarComponent from '@/components/Navbar/Navbar.vue'
import MyProfilComponent from '@/views/MyProfil/MyProfil.vue'
import UpdateProfilModale from '@/components/ProfilUpdateModale/UpdateProfilModale.vue'
import DeleteProfilModale from '@/components/ProfilDeleteModale/DeleteProfilModale.vue'
import axios from 'axios'
import { bus } from '../../main'

export default {
  name: 'ProfilComponent',
  components: {
    'loader': LoaderComponent,
    'navbar': NavbarComponent,
    'mon-profil': MyProfilComponent,
    'profil-update-modale': UpdateProfilModale,
    'profil-delete-modale': DeleteProfilModale,
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
          this.info = reponse.data.result.reverse();
          console.log(this.info);
          if ((this.info[0].post_content == '' || this.info[0].post_content == null) && (this.info[0].post_imageUrl == '' || this.info[0].post_imageUrl == null)) {
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

<style lang="scss" scoped src="./profil.scss">
</style>