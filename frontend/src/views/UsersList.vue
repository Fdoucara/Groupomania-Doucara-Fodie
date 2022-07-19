<template>
  <div>

    <navbar></navbar>
    <mon-profil></mon-profil>

    <div class="user_info_contain">
      <div class="card mt-4" :key="index" v-for="(user, index) in info">
      <router-link :to="`/post/${user.id}`" class="card_link">
        <div class="card-body">
            <div class="card-body-content">
              <img :src="user.user_imageUrl" class="card-image">
              <p class="card-text"> {{ user.nom + ' ' + user.prenom}} </p>
            </div>          
            <div class="card-body-footer">

            </div>
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
    }
  },
  methods: {
    usersInfoList() {
      this.axiosInstance.get('user')
        .then(reponse => {
          this.info = reponse.data.result.reverse();
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
  padding: 4px;;
}
.card {
  padding: 10px;
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
  text-decoration: none;
  color: black;
  margin-bottom: 10px;
  font-size: 21px;
}

.bold {
  font-weight: 700;
}

img {
  width: 100%;
  height: auto;
  padding-bottom: 25px;
}

.card-text {
  text-align: left;
  font-size: 23px;
  margin: 0;
  padding-bottom: 25px;
}

.card-body-footer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 20px;
}
</style>