<template>
  <div>
    <loader></loader>
    <navbar></navbar>
    <mon-profil></mon-profil>

    <div class="card" v-if="roleId == '1'">
      <div class="card-body-content">
        <p class="card-body-content-text">
          Salut {{ adminName + ' ' + adminFirstname }}, tu es l'administrateur de ce réseau social. Sur cette page, vous
          pouvez changer les rôles des
          utilisateurs comme vous le souhaitez. En effet, vous avez la possibilité de les nommer modérateurs ou de les
          laisser utilisateurs simples.
        </p>
      </div>
    </div>

    <div class="user_info_contain">
      <div class="card card_user my-4" :key="index" v-for="(user, index) in info">
        <div class="card-body">
          <div class="card-body-content">
            <router-link :to="`/profil/${user.id}`" class="card_link">
              <img :src="user.user_imageUrl" class="card-image">
              <div class="card-text">
                <p v-if="user.id == userId"> {{ user.nom + ' ' + user.prenom }} (Vous)</p>
                <p v-else> {{ user.nom + ' ' + user.prenom }} </p>
                <p class="bio" v-if="user.bio != '' && user.bio != null"><q> {{ user.bio }} </q></p>
                <p class="role" v-if="user.role_id == '1'"> Administrateur </p>
                <p class="role" v-if="user.role_id == '4'"> Modérateur </p>
                <p class="role" v-if="user.role_id == '3'"> Utilisateur </p>
              </div>
            </router-link>
            <div class="btn_group">
              <button class="btn btn-color" :id='user.id' v-if="roleId == '1' && user.id != userId" @click="changeRole">
                Changer son role </button>
              <button class="btn btn-color black" :id='user.id' v-if="roleId == '1' && user.id != userId"
                @click="deleteAnyoneProfil"> Supprmer cet utilisateur </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <profil-update-modale :profilModale="profilModale" :toggleProfilModale="toggleProfilModale"></profil-update-modale>
    <profil-delete-modale :deleteProfilModale="deleteProfilModale" :deleteAnyoneProfilModale="deleteAnyoneProfilModale"
      :toggleDeleteProfilModale="toggleDeleteProfilModale"
      :toggleDeleteAnyoneProfilModale="toggleDeleteAnyoneProfilModale" :user_id="user_id"></profil-delete-modale>
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
  name: 'UsersList',
  components: {
    'loader': LoaderComponent,
    'navbar': NavbarComponent,
    'mon-profil': MyProfilComponent,
    'profil-update-modale': UpdateProfilModale,
    'profil-delete-modale': DeleteProfilModale
  },
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      info: undefined,
      userId: this.$store.state.userId,
      roleId: this.$store.state.roleUser,
      adminName: null,
      adminFirstname: null,
      profilModale: false,
      deleteProfilModale: false,
      deleteAnyoneProfilModale: false,
      user_id: null
    }
  },
  methods: {
    getAdminInfo() {
      if (this.userId == 49) {
        this.axiosInstance.get('user/' + this.userId)
          .then(reponse => {
            this.adminName = reponse.data.result[0].nom;
            this.adminFirstname = reponse.data.result[0].prenom;
          })
      }
    },
    usersInfoList() {
      this.axiosInstance.get('user')
        .then(reponse => {
          this.info = reponse.data.result;
        })
    },
    toggleProfilModale() {
      this.profilModale = !this.profilModale;
    },
    toggleDeleteProfilModale() {
      this.deleteProfilModale = !this.deleteProfilModale;
    },
    changeRole(e) {
      this.id_user = e.target.id;
      this.axiosInstance.post('user/change-role/' + this.id_user)
        .then(reponse => {
          if (reponse.status == 201) {
            this.usersInfoList();
          }
        })
    },
    toggleDeleteAnyoneProfilModale() {
      this.deleteAnyoneProfilModale = !this.deleteAnyoneProfilModale;
    },
    deleteAnyoneProfil(e) {
      this.user_id = e.target.id;
      this.deleteAnyoneProfilModale = !this.deleteAnyoneProfilModale;
    }
  },
  mounted() {
    this.getAdminInfo();
    this.usersInfoList();
    bus.$on('updateProfil', () => {
      this.toggleProfilModale();
    });
    bus.$on('deleteProfil', () => {
      this.toggleDeleteProfilModale();
    });
    bus.$on('profilAfterUpdate', () => {
      this.usersInfoList();
    });
    bus.$on('updateUsersList', () => {
      this.usersInfoList();
    });
  },
}
</script>

<style lang="scss" scoped src="./userslist.scss"></style>