<template>
  <div>
    <loader></loader>
    <navbar></navbar>
    <mon-profil></mon-profil>

    <div class="card" v-if="roleId == '1'">
      <div class="card-body-content">
        <p class="card-body-content-text">
          Bonjour, vous êtes l'administrateur de ce réseau social. Sur cette page, vous pouvez changer les rôles des
          utilisateurs comme vous le souhaitez. En effet, vous avez la possibilité de les nommer modérateurs afin qu'il
          puisse contrôler les différents posts et commentaires des autres utilisateurs afin d'assurer le bon respect
          des règles. Ou de les laisser utilisateurs simples où ils pourront seulement ajouter, commenter, supprimer et
          modifier leurs propres posts et commentaires.
        </p>
      </div>
    </div>

    <div class="user_info_contain">
      <div class="card card_user my-4" :key="index" v-for="(user, index) in info">
        <router-link :to="`/profil/${user.id}`" class="card_link">
          <div class="card-body">
            <div class="card-body-content">
              <img :src="user.user_imageUrl" class="card-image">
              <div class="card-text">
                <p> {{ user.nom + ' ' + user.prenom }} </p>
                <p class="bio" v-if="user.bio != '' && user.bio != null"><q> {{ user.bio }} </q></p>
                <p class="role" v-if="user.role_id == '1'"> Administrateur </p>
                <p class="role" v-if="user.role_id == '4'"> Modérateur </p>
                <p class="role" v-if="user.role_id == '3'"> Utilisateur </p>
              </div>

            </div>
          </div>
          <div class="card-body-footer" v-if="roleId == '1'">
            <button class="btn btn-color"> <i class="fas fa-check"></i> &nbsp; Changer son role </button>
          </div>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>

import LoaderComponent from '@/components/Loader.vue'
import NavbarComponent from '@/components/Navbar.vue'
import MyProfilComponent from '@/views/MyProfil.vue'
import axios from 'axios'

export default {
  name: 'UsersList',
  components: {
    'loader': LoaderComponent,
    'navbar': NavbarComponent,
    'mon-profil': MyProfilComponent,
  },
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      info: undefined,
      userId: this.$store.state.userId,
      roleId: this.$store.state.roleId
    }
  },
  methods: {
    usersInfoList() {
      this.axiosInstance.get('user')
        .then(reponse => {
          console.log(reponse);
          this.info = reponse.data.result;
        })
    },
  },
  mounted() {
    this.usersInfoList();
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

.card-text {
  text-align: left;
  font-size: 22px;
  margin: 0;
  padding-top: 25px;
  padding-bottom: 25px;
}

.card-body-content {
  margin: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body-content-text {
  font-size: 22px;
}

.user_info_contain {
  padding: 4px;
}

.card_user {
  border-radius: 15px;
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

.card-body-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.card-image {
  width: 20%;
}

.card-text {
  text-align: justify;
  font-size: 23px;
  margin: 0;
  width: 40%;
}

.bio {
  font-style: italic;
  font-size: 22px;
}

.role {
  font-style: oblique;
  font-size: 22px;
}

.card-body-footer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 22px;
}

.btn-color {
  background: #D31027;
  color: white;
  width: 100%;
}
</style>