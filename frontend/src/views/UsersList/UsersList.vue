<template>
  <div>
    <loader></loader>
    <navbar></navbar>
    <mon-profil></mon-profil>

    <div class="card mb-4" v-if="roleId == 1">
      <div class="card_body">
        <p class="card_body_text">
          Salut <b> {{ adminName + ' ' + adminFirstname }} </b>, tu es l'administrateur de ce réseau social. Sur cette page, tu
          pourras changer les rôles des
          utilisateurs. En effet, tu as la possibilité de les nommer modérateurs ou de les
          laisser utilisateurs simples.
        </p>
      </div>
    </div>

    <div class="user_contain">
      <div class="card user_contain_info mb-4" :key="index" v-for="(user, index) in info">
        <div class="user_contain_info_body">
          <div class="user_contain_info_body_content">
            <router-link :to="`/profil/${user.id}`" class="user_contain_info_body_link">
              <img :src="user.user_imageUrl" class="user_contain_info_body_content_image">
              <div class="user_contain_info_body_content_text">
                <p v-if="user.id == userId"> {{ user.nom + ' ' + user.prenom }} (Vous)</p>
                <p v-else> {{ user.nom + ' ' + user.prenom }} </p>
                <p class="user_contain_info_body_content_text_bio" v-if="user.bio != '' && user.bio != null"><q> {{ user.bio }} </q></p>
                <p class="user_contain_info_body_content_text_role" v-if="user.role_id == '1'"> Administrateur </p>
                <p class="user_contain_info_body_content_text_role" v-if="user.role_id == '4'"> Modérateur </p>
                <p class="user_contain_info_body_content_text_role" v-if="user.role_id == '3'"> Utilisateur </p>
              </div>
            </router-link>
            <div class="user_contain_info_body_content_btn">
              <button class="btn user_contain_info_body_content_btn_change" :id='user.id' v-if="roleId == '1' && user.id != userId" @click="changeRole">
                Changer son role </button>
              <button class="btn user_contain_info_body_content_btn_delete black" :id='user.id' v-if="roleId == '1' && user.id != userId"
                @click="deleteAnyoneProfil"> Supprimer le profil </button>
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