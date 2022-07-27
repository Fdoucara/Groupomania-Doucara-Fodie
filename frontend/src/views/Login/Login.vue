<template>
  <div>
    <div class="container">
      <img src="../../assets/icon-left-font-monochrome-white.png" alt="Groupomania logo" class="container_image">

      <div class="container_body">
        <form>
          <h2 class="container_body_title"> Connexion </h2>
          <div class="form-group my-4">
            <label for="email" class="mb-2"> Votre adresse email : </label>
            <input type="email" id="email" class="form-control" v-model="formData.email" @keyup="verifEmail">
            <p class="emailError"></p>
          </div>

          <div class="form-group mt-3">
            <label for="password" class="mb-2"> Votre mot de passe : </label>
            <input type="password" id="password" class="form-control" v-model="formData.password"
              @keyup="verifPassword">
            <p class="passwordError"></p>
          </div>

          <button class="btn container_body_button mt-5 mb-4" @click.prevent="sendData"> Se connecter </button>
          <p class="formError"></p>
        </form>

        <p> Vous n'avez pas encore de compte ? <router-link to="/inscription"> Cliquez ici.
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>


<script>

import axios from 'axios'

export default {
  name: 'LoginComponent',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      form: null,
      errorEmail: '',
      errorPassword: '',
      testEmail: null,
      testPassword: null,
      emailRegExp: '',
      passwordRegExp: '',
      formError: ''
    }
  },
  methods: {
    verifEmail() {
      this.formError = document.querySelector(".formError");
      this.formError.textContent = "";
      this.form = document.querySelector("form");
      this.emailRegExp = /^[A-Za-z0-9.\-+%_]+[@]{1}[A-Za-z0-9.\-+%_]+\.[A-Za-z]{2,}/i;
      this.errorEmail = document.querySelector('.emailError');
      this.testEmail = this.emailRegExp.test(this.form.email.value);
      if (this.testEmail) {
        this.errorEmail.textContent = "";
        return true;
      }
      else if (this.form.email.value == '') {
        this.errorEmail.textContent = "L'adresse email ne peut être vide !";
        this.errorEmail.style.color = "red";
        this.errorEmail.style.marginTop = "5px";
        this.errorEmail.style.marginBottom = "0";
        this.errorEmail.style.fontSize = "16px";
        return false;
      }
      else {
        this.errorEmail.textContent = "Email non valide";
        this.errorEmail.style.color = "red";
        this.errorEmail.style.marginTop = "5px";
        this.errorEmail.style.marginBottom = "0";
        this.errorEmail.style.fontSize = "16px";
      }
    },
    verifPassword() {
      this.formError = document.querySelector(".formError");
      this.formError.textContent = "";
      this.form = document.querySelector("form");
      this.passwordRegExp = /^(?=.*?[A-ZÀÂÇÉÈÊËÎÏÔÙÛÜŸÆŒ])(?=.*?[a-zàâæçéèêëîïôœùûüÿ])(?=.*?[0-9])(?=.*?[#.+?!@$%,:;^&*_-]).{6,}$/;
      this.errorPassword = document.querySelector('.passwordError');
      this.testPassword = this.passwordRegExp.test(this.form.password.value);
      if (this.testPassword) {
        this.errorPassword.textContent = "";
        return true;
      }
      else if (this.form.password.value == '') {
        this.errorPassword.textContent = "Le mot de passe ne peut être vide !";
        this.errorPassword.style.color = "red";
        this.errorPassword.style.marginTop = "5px";
        this.errorPassword.style.marginBottom = "0";
        this.errorPassword.style.fontSize = "16px";
        return false;
      }
      else {
        this.errorPassword.textContent = "Mot de passe non valide";
        this.errorPassword.style.color = "red";
        this.errorPassword.style.marginTop = "5px";
        this.errorPassword.style.marginBottom = "0";
        this.errorPassword.style.fontSize = "16px";
      }
    },
    sendData() {
      if (this.verifEmail() && this.verifPassword()) {
        this.axiosInstance.post('user/login', {
          email: this.formData.email,
          password: this.formData.password
        })
          .then(reponse => {
            if (reponse.status == 200) {
              this.$store.commit('UPDATE_USER_STATUS', true);
              this.$store.commit('UPDATE_USER_ID', reponse.data.userId);
              this.$store.commit('UPDATE_ROLE_USER', reponse.data.roleUser);
              this.$router.replace('/accueil');
            }
          })
          .catch(error => {
            this.formError = document.querySelector(".formError");
            this.formError.textContent = error.response.data.message;
            this.formError.style.textAlign = "center";
            this.formError.style.color = "red";
            this.formError.style.marginTop = "10px";
            this.formError.style.marginBottom = "10px";
            this.formError.style.fontSize = "16px";
          })
      }
    },
  }
}
</script>

<style lang="scss" scoped src="./login.scss">
</style>