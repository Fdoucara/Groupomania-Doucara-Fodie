<template>
  <div>

    <div class="bloc-modale" v-if="deleteProfilModale">

      <div class="overlay"></div>
      <div class="modale card">
        <h2 class="modale-title"> Supprimer mon profil
          <hr>
        </h2>
        <div class="modale-content">
          <p class="modale-content-item"> Êtes-vous certain que vous voulez supprimer votre profil ? Il ne peut plus
            être
            récupéré ! </p>
        </div>
        <div class="modale-body-footer">
          <div class="modale-body-footer-send">
            <button class="btn btn-color1" @click="toggleDeleteProfilModale"> Annuler </button>
          </div>
          <div class="modale-body-footer-send">
            <button class="btn btn-color2" @click="deleteProfil"> Valider </button>
          </div>
        </div>
      </div>

    </div>
    <div class="bloc-modale" v-if="deleteAnyoneProfilModale">

      <div class="overlay"></div>
      <div class="modale card">
        <h2 class="modale-title"> Supprimer le profil de cet utilisateur
          <hr>
        </h2>
        <div class="modale-content">
          <p class="modale-content-item"> Êtes-vous certain que vous voulez supprimer le compte de cet
            utilisateur
            ? Il ne pourra plus être
            récupéré ! </p>
        </div>
        <div class="modale-body-footer">
          <div class="modale-body-footer-send">
            <button class="btn btn-color1" @click="toggleDeleteAnyoneProfilModale"> Annuler </button>
          </div>
          <div class="modale-body-footer-send">
            <button class="btn btn-color2" @click="deleteAnyoneProfil"> Valider </button>
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
          this.$router.push('/');
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

<style scoped>
.bloc-modale {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modale {
  background: white;
  color: #333;
  height: 400px;
  width: 550px;
  padding: 20px;
  position: fixed;
  bottom: 30%;
  display: flex;
  justify-content: space-around;
}

.modale-title {
  font-size: 25px;
  text-align: left;
}

.modale-content {
  font-size: 20px;
  text-align: left;
  position: relative;
}

.modale-body-content {
  margin: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.modale-body-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 20px;
}

.modale-body-footer-send {
  width: 40%;
}

button {
  width: 100%;
  padding: 10px 0px;
  font-size: 18px;
}

.btn-color1 {
  background: #203A43;
  color: white;
}

.btn-color2 {
  background: #D31027;
  color: white;
}
</style>