<template>
  <div>
    <nav class="navbar">
      <div class="navbar_right">
        <router-link to="/accueil"> <img src="../assets/logomodif.png" alt="Logo Groupomania" class="navbar_logo"> </router-link>
        <router-link to="/accueil" class="navbar_link"> <p> Accueil </p> </router-link>
        <router-link to="/profil" class="navbar_link"> <p> Profil </p> </router-link>
        <router-link to="/creation" class="navbar_link"> <p> Créer un post </p> </router-link>
      </div>
      <p class="navbar_link navbar_left" @click="deconnexion"> Deconnexion </p>
    </nav>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: "NavbarComponent",
  data() {
    return {
       axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
    }
  },
  methods: {
    deconnexion(){
      this.axiosInstance.get('user/logout')
      .then(reponse => {
        console.log('ok');
        console.log(reponse);
        this.$router.push('/');
      })
    }
  },
}
</script>

<style scoped>

.navbar {
  height: 80px;
  background-color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar_logo{
  height: 60px;
  width: auto;
}

.navbar_right {
  width: 20%;
  margin: 0px;
  margin-left: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 20px;
  list-style-type: none;
}

.navbar_link {
  text-decoration: none;
  color: white;
  cursor: pointer;
}

.navbar_link p {
  margin: 0;
}

.navbar_left {
  margin: 0px;
  margin-right: 80px;
  text-decoration: none;
  color: white;
  font-size: 20px;
  list-style-type: none;
}

</style>