<template>

  <div class="container">

    <img src="../../assets/icon-left-font-monochrome-white.png" alt="Groupomania logo">
    <div class="form-p">
      <form>
        <h2> Inscription </h2>

        <div class="form-group my-4">
          <label for="nom" class="mb-2"> Nom : </label>
          <input type="text" id="nom" class="form-control" v-model="formData.nom">
          <span>
            <p class="nomError"></p>
          </span>
        </div>

        <div class="form-group my-4">
          <label for="prenom" class="mb-2"> Prenom : </label>
          <input type="text" id="prenom" class="form-control" v-model="formData.prenom">
          <span>
            <p class="prenomError"></p>
          </span>
        </div>

        <div class="modify_css form-group my-4">
          <label for="bio" class="mb-2"> Bio : </label>
          <textarea v-model="formData.bio" id="bio"></textarea>
        </div>

        <div class="form-group mt-4">
          <label for="email" class="mb-2"> Votre adresse email : </label>
          <input type="email" id="email" class="form-control" v-model="formData.email" @keyup="verifEmail">
          <p class="emailError"></p>
        </div>

        <div class="form-group mt-4 mb-3">
          <label for="password" class="mb-2"> Votre mot de passe : </label>
          <input type="password" id="password" class="form-control" v-model="formData.password" @keyup="verifPassword">
          <p class="passwordError"></p>
        </div>

        <button class="btn mt-4" @click.prevent="sendData"> Créer mon compte </button>
      </form>

      <div>
        <p class="mt-4"> Vous avez deja un compte ? <router-link to="/"> Cliquez ici. </router-link>
        </p>
      </div>
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
      errorEmail: '',
      errorPassword: '',
      testEmail: null,
      testPassword: null,
      emailRegExp: '',
      passwordRegExp: ''
    }
  },
  methods: {
    verifEmail() {
      this.form = document.querySelector("form");
      this.emailRegExp = /^[A-Za-z0-9.\-+%_]+[@]{1}[A-Za-z0-9.\-+%_]+\.[A-Za-z]{2,}/i;
      this.errorEmail = document.querySelector('.emailError');
      this.testEmail = this.emailRegExp.test(this.form.email.value);
      if (this.testEmail) {
        this.errorEmail.textContent = "";
        return true;
      } else {
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
      } else {
        this.errorPassword.textContent = "Mot de passe non valide il doit contenir au minimum 6 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial";
        this.errorPassword.style.color = "red";
        this.errorPassword.style.marginTop = "5px";
        this.errorPassword.style.marginBottom = "0";
        this.errorPassword.style.fontSize = "16px";
      }
    },
    sendData() {
      if (this.verifEmail() && this.verifPassword()) {
        console.log(this.verifEmail() ,'  ', this.verifPassword())
        this.axiosInstance.post('user/register', ({
          nom: this.formData.nom,
          prenom: this.formData.prenom,
          bio: this.formData.bio,
          email: this.formData.email,
          password: this.formData.password
        }))
          .then(reponse => {
            if (reponse.status == 201) {
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

<style lang="scss" scoped src="./register.scss"></style>