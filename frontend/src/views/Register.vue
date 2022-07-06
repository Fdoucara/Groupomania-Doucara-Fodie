<template>

  <div class="container">

    <img src="../assets/icon-left-font-monochrome-white.png" alt="Groupomania logo">
    <div class="form-p">
      <form>
        <h2> Inscription </h2>

        <div class="form-group my-4">
          <label for="nom" class="mb-2"> Nom : </label>
          <input type="text" id="nom" class="form-control" v-model="formData.nom">
        </div>

        <div class="form-group my-4">
          <label for="prenom" class="mb-2"> Prenom : </label>
          <input type="text" id="prenom" class="form-control" v-model="formData.prenom">
        </div>

        <div class="modify_css form-group my-4">
          <label for="bio" class="mb-2"> Bio : </label>
          <textarea v-model="formData.bio" id="bio"></textarea>
        </div>

        <div class="form-group mt-4">
          <label for="email" class="mb-2"> Votre adresse email : </label>
          <input type="email" id="email" class="form-control" v-model="formData.email">
        </div>

        <div class="form-group mt-4">
          <label for="password" class="mb-2"> Votre mot de passe : </label>
          <input type="password" id="password" class="form-control" v-model="formData.password">
        </div>

        <button class="btn btn-primary mt-4" @click.prevent="sendData"> Créer mon compte </button>
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
import ModaleComponent from '@/components/Modale.vue'

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
      registerModale: false
    }
  },
  methods: {
    sendData() {
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
    },
    toggleRegisterModale() {
      this.registerModale = !this.registerModale;
      this.$router.push('/');
    }
  },
}
</script>

<style scoped>
.container {
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: end;
}

img {
  position: absolute;
  left: 10%;
  top: 10%;
  width: 650px;
  height: 650px;
}

.form-p {
  background: white;
  width: 500px;
  height: 710px;
  padding: 40px;
  border-radius: 20px;
  margin-top: 100px;
}

h2 {
  text-align: left;
}

.form-group {
  text-align: left;
}

.modify_css {
  display: flex;
  flex-direction: column;
}

textarea {
  padding: 5px;
  resize: none;
}
</style>