<template>
  <div>

    <navbar></navbar>
    <mon-profil></mon-profil>

    <div class="user_info_contain">
      <div class="card mt-4" :key="index" v-for="(user, index) in info">
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

import NavbarComponent from '@/components/Navbar.vue'
import MyProfilComponent from '@/views/MyProfil.vue'
import axios from 'axios'

export default {
  name: 'UsersList',
  components: {
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
.user_info_contain {
  padding: 4px;
}

.card {
  padding: 10px;
  width: 35%;
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