<template>
  <div>

    <div class="bloc_modale" v-if="deleteProfilModale">

      <div class="overlay"></div>
      <div class="modale card">
        <h2 class="modale_title"> Supprimer mon profil
          <hr>
        </h2>
        <div class="modale_content">
          <p class="modale_content_item"> Êtes-vous certain que vous voulez supprimer votre profil ? Il ne peut plus
            être
            récupéré ! </p>
        </div>
        <div class="modale_footer">
          <div class="modale_footer_cancel">
            <button class="btn btn modale_footer_cancel_button" @click="toggleDeleteProfilModale"> Annuler </button>
          </div>
          <div class="modale_footer_send">
            <button class="btn btn modale_footer_send_button" @click="deleteProfil"> Valider </button>
          </div>
        </div>
      </div>

    </div>
    <div class="bloc_modale" v-if="deleteAnyoneProfilModale">

      <div class="overlay"></div>
      <div class="modale card">
        <h2 class="modale_title"> Supprimer le profil de cet utilisateur
          <hr>
        </h2>
        <div class="modale_content">
          <p class="modale_content-item"> Êtes-vous certain que vous voulez supprimer le compte de cet
            utilisateur
            ? Il ne pourra plus être
            récupéré ! </p>
        </div>
        <div class="modale_footer">
          <div class="modale_footer_cancel">
            <button class="btn modale_footer_cancel_button" @click="toggleDeleteAnyoneProfilModale"> Annuler </button>
          </div>
          <div class="modale_footer_send">
            <button class="btn modale_footer_send_button" @click="deleteAnyoneProfil"> Valider </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

import axios from 'axios'
import { bus } from '../../main'

export default {
  name: 'DeleteProfilModale',
  props: ['deleteProfilModale', 'toggleDeleteProfilModale', 'deleteAnyoneProfilModale', 'toggleDeleteAnyoneProfilModale', 'user_id'],
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/',
      })
    }
  },
  methods: {
    deleteProfil() {
      this.axiosInstance.delete('user/delete-profil')
        .then(() => {
          this.$store.commit('REMOVE_USER_STATUS');
          this.$store.commit('REMOVE_USER_ID');
          this.$store.commit('REMOVE_ROLE_USER');
          this.toggleDeleteProfilModale();
          this.$router.replace('/');
        })
    },
    deleteAnyoneProfil() {
      this.axiosInstance.delete('user/delete-anyone-profil/' + this.user_id)
        .then(() => {
          bus.$emit('updateUsersList');
          this.toggleDeleteAnyoneProfilModale();
        })
    }
  },
}
</script>

<style lang="scss" scoped src="./deleteprofil.scss">
</style>