<template>

  <div class="container">

    <img src="../../assets/icon-left-font-monochrome-white.png" alt="Groupomania logo" class="container_image">
    <div class="container_body">
      <form class="mb-4">
        <h2 class="container_body_title"> Inscription </h2>

        <div class="container_body_name mb-2">
          <div class="form-group mt-4">
            <label for="nom" class="mb-2"> Nom : </label>
            <input type="text" id="nom" class="form-control" v-model="formData.nom" @keyup="verifNom" required>
            <p class="nomError"></p>
          </div>

          <div class="form-group mt-4">
            <label for="prenom" class="mb-2"> Prenom : </label>
            <input type="text" id="prenom" class="form-control" v-model="formData.prenom" @keyup="verifPrenom" required>
            <p class="prenomError"></p>
          </div>
        </div>

        <div class="form-group mb-4 container_body_modify">
          <label for="bio" class="mb-2"> Bio : </label>
          <textarea v-model="formData.bio" class="container_body_textarea" id="bio"></textarea>
        </div>

        <div class="form-group mb-4">
          <label for="email" class="mb-2"> Votre adresse email : </label>
          <input type="email" id="email" class="form-control" v-model="formData.email" @keyup="verifEmail" required>
          <p class="emailError"></p>
        </div>

        <div class="form-group mb-5">
          <label for="password" class="mb-2"> Votre mot de passe : </label>
          <input type="password" id="password" class="form-control" v-model="formData.password" @keyup="verifPassword"
            required>
          <p class="passwordError"></p>
        </div>

        <button class="btn container_body_button" @click.prevent="sendData"> Créer mon compte </button>
        <p class="formError"></p>
      </form>

      <p> Vous avez deja un compte ? <router-link to="/"> Cliquez ici. </router-link>
      </p>
    </div>

    <div>
      <modale :registerModale="registerModale" :toggleRegisterModale="toggleRegisterModale"></modale>
    </div>
  </div>

</template>

<script>

import axios from 'axios'
import ModaleComponent from '@/components/RegisterModale/RegisterModale.vue'

export default {
  name: 'RegisterComponent',
  components: {
    'modale': ModaleComponent
  },
  data() {
    return {
      formData: {
        nom: '',
        prenom: '',
        bio: '',
        email: '',
        password: ''
      },
      axiosInstance: axios.create({
        baseURL: 'http://localhost:3000/api/'
      }),
      registerModale: false,
      form: null,
      errorNom: '',
      errorPrenom: '',
      errorEmail: '',
      errorPassword: '',
      testNom: null,
      testPrenom: null,
      testEmail: null,
      testPassword: null,
      nomRegExp: '',
      prenomRegExp: '',
      emailRegExp: '',
      passwordRegExp: ''
    }
  },
  methods: {
    verifNom() {
      this.form = document.querySelector("form");
      this.nomRegExp = /^[A-ZÀÂÇÉÈÊËÎÏÔÙÛÜŸÆŒ]{1,}([a-zàâæçéèêëîïôœùûüÿ]+)?([-'\s])?([A-ZÀÂÇÉÈÊËÎÏÔÙÛÜŸÆŒ]+)?([a-zàâæçéèêëîïôœùûüÿ]+)?$/;
      this.errorNom = document.querySelector('.nomError');
      this.testNom = this.nomRegExp.test(this.form.nom.value);
      if (this.testNom) {
        this.errorNom.textContent = "";
        return true;
      }
      else if (this.form.nom.value == '') {
        this.errorNom.textContent = "";
        return false;
      }
      else {
        this.errorNom.textContent = "Manque majuscule au début.";
        this.errorNom.style.color = "red";
        this.errorNom.style.marginTop = "5px";
        this.errorNom.style.marginBottom = "0";
        this.errorNom.style.fontSize = "16px";
      }
    },
    verifPrenom() {
      this.form = document.querySelector("form");
      this.prenomRegExp = /^[A-ZÀÂÇÉÈÊËÎÏÔÙÛÜŸÆŒ]{1,}([a-zàâæçéèêëîïôœùûüÿ]+)?([-'\s])?([A-ZÀÂÇÉÈÊËÎÏÔÙÛÜŸÆŒ]+)?([a-zàâæçéèêëîïôœùûüÿ]+)?$/;
      this.errorPrenom = document.querySelector('.prenomError');
      this.testPrenom = this.prenomRegExp.test(this.form.prenom.value);
      if (this.testPrenom) {
        this.errorPrenom.textContent = "";
        return true;
      }
      else if (this.form.prenom.value == '') {
        this.errorPrenom.textContent = "";
        return false;
      }
      else {
        this.errorPrenom.textContent = "Manque majuscule au début.";
        this.errorPrenom.style.color = "red";
        this.errorPrenom.style.marginTop = "5px";
        this.errorPrenom.style.marginBottom = "0";
        this.errorPrenom.style.fontSize = "16px";
      }
    },
    verifEmail() {
      this.form = document.querySelector("form");
      this.emailRegExp = /^[A-Za-z0-9.\-+%_]+[@]{1}[A-Za-z0-9.\-+%_]+\.[A-Za-z]{2,}/i;
      this.errorEmail = document.querySelector('.emailError');
      this.testEmail = this.emailRegExp.test(this.form.email.value);
      if (this.testEmail) {
        this.errorEmail.textContent = "";
        return true;
      }
      else if (this.form.email.value == '') {
        this.errorEmail.textContent = "";
        return false;
      }
      else {
        this.errorEmail.textContent = "Email Non Valide";
        this.errorEmail.style.color = "red";
        this.errorEmail.style.marginTop = "5px";
        this.errorEmail.style.marginBottom = "0";
        this.errorEmail.style.fontSize = "16px";
      }
    },
    verifPassword() {
      this.form = document.querySelector("form");
      this.passwordRegExp = /^(?=.*?[A-ZÀÂÇÉÈÊËÎÏÔÙÛÜŸÆŒ])(?=.*?[a-zàâæçéèêëîïôœùûüÿ])(?=.*?[0-9])(?=.*?[#.+?!@$%,:;^&*_-]).{6,}$/;
      this.errorPassword = document.querySelector('.passwordError');
      this.testPassword = this.passwordRegExp.test(this.form.password.value);
      if (this.testPassword) {
        this.errorPassword.textContent = "";
        return true;
      }
      else if (this.form.password.value == '') {
        this.errorPassword.textContent = "";
        return false;
      }
      else {
        this.errorPassword.textContent = "6 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial";
        this.errorPassword.style.color = "red";
        this.errorPassword.style.marginTop = "5px";
        this.errorPassword.style.marginBottom = "0";
        this.errorPassword.style.fontSize = "16px";
      }
    },
    sendData() {
      if (this.verifNom() && this.verifPrenom() && this.verifEmail() && this.verifPassword()) {
        this.axiosInstance.post('user/register', ({
          nom: this.formData.nom,
          prenom: this.formData.prenom,
          bio: this.formData.bio,
          email: this.formData.email,
          password: this.formData.password
        }))
          .then(reponse => {
            if (reponse.status == 400) {
              console.log(reponse);
            }
            else if (reponse.status == 201) {
              this.registerModale = !this.registerModale;
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
    },
    toggleRegisterModale() {
      this.registerModale = !this.registerModale;
      this.$router.push('/');
    }
  },
}
</script>

<style lang="scss" scoped src="./register.scss">
</style>