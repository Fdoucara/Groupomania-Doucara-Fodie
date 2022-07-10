<template>
  <div>
    <nav class="navbar">
        <router-link to="/accueil"> <img src="../assets/logomodif1.png" alt="Logo Groupomania" class="navbar_logo"> </router-link>
        <div class="navbar_item">
          <i class="fas fa-home"></i>
          <router-link to="/accueil" class="navbar_link"> <p> Accueil </p> </router-link>
        </div>
        <div class="navbar_item">        
          <i class="fas fa-sign-out-alt"></i> 
          <p class="navbar_link" @click="deconnexion"> Deconnexion </p> 
        </div>
               
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
      .then(() => {
        this.$store.commit('REMOVE_USER_ID');
        this.$store.commit('REMOVE_ROLE_USER');
        this.$router.push('/');
      })
    }
  },
}
</script>

<style scoped>

.navbar {
  position: fixed;
  height: 100%;
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background: #D31027;
}

.navbar_logo{
  height: 100px;
  width: auto;
}

.navbar_item {
  width: 100%;
  text-align: left;
}

.fas {
  position: absolute;
  left: 30%;
  line-height: 40px;
}

.navbar_link {
  position: absolute;
  left: 40%;
  width: 20%;
  text-decoration: none;
  color: white;
  cursor: pointer;
}

p {
  width: 100%;
  margin: 0;
  font-size: 30px;
}

.fas {
  color: white;
  font-size: 30px;
}

</style>