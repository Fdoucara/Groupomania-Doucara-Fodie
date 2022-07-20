<template>
  <div class="container">
    <img src="../assets/icon-left-font-monochrome-white.png" alt="Groupomania logo">

    <div class="form-p">
      <form>
        <h2> Connexion </h2>
        <div class="form-group my-5">
          <label for="email" class="mb-2"> Votre adresse email : </label>
          <input type="email" id="email" class="form-control" v-model="formData.email">
        </div>

        <div class="form-group mt-4">
          <label for="password" class="mb-2"> Votre mot de passe : </label>
          <input type="password" id="password" class="form-control" v-model="formData.password">
        </div>

        <button class="btn mt-5" @click.prevent="sendData"> Se connecter </button>
      </form>

      <div>
        <p class="mt-5"> Vous n'avez pas encore de compte ? <router-link to="/inscription"> Cliquez ici.
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
    }
  },
  methods: {
    sendData() {
      this.axiosInstance.post('user/login', {
        email: this.formData.email,
        password: this.formData.password
      })
        .then(reponse => {
          if (reponse.status == 200) {
            this.$store.commit('UPDATE_USER_STATUS', true);
            this.$store.commit('UPDATE_USER_ID', reponse.data.userId);
            this.$store.commit('UPDATE_ROLE_USER', reponse.data.roleUser);
            this.$router.push('/accueil');
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
  }
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
  right: 10%;
  background: white;
  width: 530px;
  height: 550px;
  padding: 40px;
  border-radius: 20px;
  margin-top: 150px;
  font-size: 20px;
}

h2 {
  text-align: left;
}

.form-group {
  text-align: left;
}

.btn {
  display: block;
  width: 60%;
  margin: auto;
  color: white;
  background: #D31027;
  font-size: 20px;
  padding: 10px 0px 10px 0px;
}
</style>