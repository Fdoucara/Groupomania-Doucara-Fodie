<template>
  <div>

    <div class="big_contain">
      <div class="card mb-2">
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
        <button class="card_button_update btn mt-2" @click="updateProfil"> Modifier mon profil </button>
        <button class="card_button_delete btn mt-3" @click="deleteProfil"> Supprimer mon profil </button>
        <button class="card_button_update_phone btn mt-2" @click="updateProfilPhone"> Modifier mon profil </button>
        <button class="card_button_delete_phone btn mt-3" @click="deleteProfilPhone"> Supprimer mon profil </button>
      </div>

      <div class="activite mt-4 mb-1">
        <h1> Mon activité </h1>
      </div>

      <h3 v-if="!showCard" class="none"> Vous n'avez aucun post pour le moment ! </h3>

      <div class="post_scroll" v-if="showCard">
        <div class="post_scroll_card my-3" :key="index" v-for="(post, index) in info">
          <router-link :to="`/post/${post.id}`" class="post_scroll_card_link">
            <div class="post_scroll_card_body">
              <div class="post_scroll_card_body_header">
                <p class="post_scroll_card_body_header_text bold"> Par vous </p>
                <p class="post_scroll_card_body_header_text"> Le {{ new Date(post.post_date).toLocaleDateString() }}
                </p>
              </div>
              <img :src="post.post_imageUrl" class="post_scroll_card_body_image">
              <p class="post_scroll_card_body_text"> {{ post.post_content }} </p>
            </div>
          </router-link>
        </div>
      </div>
      
    <profil-update-modale :profilModale="updateProfilModale" :toggleProfilModale="updateProfilPhone"></profil-update-modale>
    <profil-delete-modale :deleteProfilModale="deleteProfilModale" :toggleDeleteProfilModale="deleteProfilPhone"></profil-delete-modale>
    </div>
  </div>
</template>

<script>

import UpdateProfilModale from '@/components/ProfilUpdateModale/UpdateProfilModale.vue'
import DeleteProfilModale from '@/components/ProfilDeleteModale/DeleteProfilModale.vue'
import axios from 'axios'
import { bus } from '../../main.js'

export default {
  name: 'MyProfilComponent',
  components: {
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
      bio: null,
      info: null,
      showCard: true,
      bigContain: null,
      updateProfilModale: false,
      deleteProfilModale: false
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
          if (this.info[0].post_content == null && !this.info[0].post_imageUrl) {
            this.showCard = false;
          } else {
            this.showCard = true;
          }
        })
    },
    getElement() {
      this.bigContain = document.querySelector('.big_contain')
    },
    updateProfil() {
      bus.$emit('updateProfil');
    },
    updateProfilPhone() {
      this.updateProfilModale = !this.updateProfilModale;
    },
    deleteProfil() {
      bus.$emit('deleteProfil');
    },
    deleteProfilPhone() {
      this.deleteProfilModale = !this.deleteProfilModale;
    }
  },
  mounted() {
    this.getProfile();
    this.getElement();
    bus.$on('takeProfil', () => {
      this.getProfile();
    });
    bus.$on('listAfterUpdate', () => {
      this.getProfile();
    });
    bus.$on('listAfterDelete', () => {
      this.getProfile();
    });
    bus.$on('profilAfterUpdate', () => {
      this.getProfile();
    });
    bus.$on('showProfil', () => {
      this.bigContain.classList.toggle('show');
    })
    bus.$on('hideProfil', () => {
      this.bigContain.classList.toggle('hide');
    });
  }
}
</script>

<style lang="scss" scoped src="./myprofil.scss">
</style>