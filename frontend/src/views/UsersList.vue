<template>
  <div>
    <loader></loader>
    <navbar></navbar>
    <mon-profil></mon-profil>

    <div class="card" v-if="roleId == '1'">
      <div class="card-body-content">
        <p class="card-body-content-text">
          Salut {{ adminName + ' ' + adminFirstname }}, tu es l'administrateur de ce réseau social. Sur cette page, vous pouvez changer les rôles des
          utilisateurs comme vous le souhaitez. En effet, vous avez la possibilité de les nommer modérateurs ou de les laisser utilisateurs simples.
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
                  <button class="btn btn-color" :id='user.id' v-if="roleId == '1' && user.id != userId" @click="changeRole"> Changer son role </button>
                  <button class="btn btn-color black" :id='user.id' v-if="roleId == '1' && user.id != userId" @click="deleteAnyoneProfil"> Supprmer cet utilisateur </button>
              </div> 
            </div>
          </div>
      </div>
    </div>

      <profil-update-modale :profilModale="profilModale" :toggleProfilModale="toggleProfilModale"></profil-update-modale>
      <profil-delete-modale :deleteProfilModale="deleteProfilModale" :deleteAnyoneProfilModale="deleteAnyoneProfilModale" :toggleDeleteProfilModale="toggleDeleteProfilModale" :toggleDeleteAnyoneProfilModale="toggleDeleteAnyoneProfilModale" :user_id="user_id"></profil-delete-modale>
  </div>
</template>

<script>

import LoaderComponent from '@/components/Loader.vue'
import NavbarComponent from '@/components/Navbar.vue'
import MyProfilComponent from '@/views/MyProfil.vue'
import UpdateProfilModale from '@/components/UpdateProfilModale.vue'
import DeleteProfilModale from '@/components/DeleteProfilModale.vue'
import axios from 'axios'
import {bus} from '../main'

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
      if(this.userId == 49) {
        this.axiosInstance.get('user/' + this.userId)
        .then(reponse => {
          this.adminName = reponse.data.result[0].nom;
          this.adminFirstname = reponse.data.result[0].prenom ;
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
      console.log(this.id_user);
      this.axiosInstance.post('user/change-role/' + this.id_user)
      .then(reponse => {
        if(reponse.status == 200) {
          this.usersInfoList();
          console.log('Soon ', reponse);
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

<style scoped>
.card {
  width: 43%;
  margin: auto;
  padding-top: 5px;
  border: 0;
  border-radius: 0px 0px 15px 15px;
  background: white;
}

.card-body {
  width: 100%;
}

.card-body-content {
  margin: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.card-body-content-text {
  font-size: 23px;
  padding: 40px;
}

.user_info_contain {
  padding: 4px;
}

.card_user {
  border-radius: 20px;
}

.card_link {
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: black;
  padding: 0;
  margin: auto;
}

.card-body {
  width: 100%;
}

.card-body-content {
  margin: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.card-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.card-text {
  text-align: left;
  font-size: 22px;
  margin: 0;
  width: 60%;
  padding-top: 25px;
  padding-bottom: 25px;
}

.bio {
  font-style: italic;
  font-size: 20px;
}

.role {
  font-style: oblique;
  font-size: 22px;
}

.btn_group {
  width: 100%;
  display: flex;
}

.btn-color {
  font-size: 20px;
  background: #D31027;
  color: white;
  width: 40%;
  margin: auto;
  margin-bottom: 5px;
  border-radius: 25px;
}

.black {
  background:  #203A43;
}
</style>