<template>
  <div class="contain">
    <div class="overlay"></div>
    <div class="top_navbar">
      <div class="burger" @click="burgerMenu">
        <span></span>
      </div>
      <img :src="userImage" alt="Photo de profil" class="burger_logo" @click="showProfil">
    </div>
    <nav class="navbar">
      <router-link to="/accueil" class="navbar_logo"> <img src="../../assets/logomodif1.png" alt="Logo Groupomania">
      </router-link>
      <div class="navbar_item">
        <router-link to="/accueil"> <i class="fas fa-home"></i> </router-link>
        <router-link to="/accueil" class="navbar_link">
          <p class="navbar_link_p"> Accueil </p>
        </router-link>
      </div>
      <div class="navbar_item">
        <router-link to="/utilisateurs"> <i class="fas fa-users"></i> </router-link>
        <router-link to="/utilisateurs" class="navbar_link">
          <p class="navbar_link_p"> Utilisateurs </p>
        </router-link>
      </div>
      <div class="navbar_item">
        <i class="fas fa-sign-out-alt" @click="deconnexion"></i>
        <p class="navbar_link navbar_link_p" @click="deconnexion"> Deconnexion </p>
      </div>

    </nav>
  </div>
</template>

<script>

import axios from 'axios'
import { bus } from '../../main'

export default {
  name: "NavbarComponent",
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      userId: this.$store.state.userId,
      overlay: null,
      burger: null,
      navbar: null,
      big_contain: null,
      userImage: null
    }
  },
  methods: {
    getUserImage() {
      this.axiosInstance.get('user/' + this.$store.state.userId)
        .then(reponse => {
          this.userImage = reponse.data.result[0].user_imageUrl;
        })
    },
    burgerMenu() {
      this.overlay = document.querySelector('.overlay');
      this.burger = document.querySelector('.burger');
      this.navbar = document.querySelector('.navbar');
      this.overlay.classList.toggle('black');
      this.burger.classList.toggle('active');
      this.navbar.classList.toggle('show');
    },
    showProfil() {
      bus.$emit('showProfil');
    },
    deconnexion() {
      this.axiosInstance.get('user/logout')
        .then(() => {
          this.$store.commit('REMOVE_USER_STATUS');
          this.$store.commit('REMOVE_USER_ID');
          this.$store.commit('REMOVE_ROLE_USER');
          this.$router.replace('/');
        })
    }
  },
  mounted() {
    this.getUserImage();
    bus.$on('profilAfterUpdate', () => {
      this.getUserImage();
    });
  },
}
</script>

<style lang="scss" scoped src="./navbar.scss">
</style>