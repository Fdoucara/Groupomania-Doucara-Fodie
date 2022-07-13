<template>
  <div>

    <div class="card my-4" :key="index" v-for="(user, index) in info">
      <div class="card-body">
        <router-link :to="`/post/${user.id}`" class="card_link">
          <div class="card-body-header">
            <router-link to="/monProfil" v-if="user.user_id == userId" class="card-body-header-text bold">
              <p> Par vous </p>
            </router-link>
            <router-link :to="`/profil/${user.user_id}`" v-else class="card-body-header-text bold">
              <p> Par {{ user.nom + ' ' + user.prenom }} </p>
            </router-link>
            <p class="card-body-header-text"> Le {{ new Date(user.user_date).toLocaleDateString() }} </p>
          </div>
          <img :src="user.user_imageUrl" class="card-image">
          <p class="card-text"> {{ user.user_content }} </p>
        </router-link>
        <div class="card-body-footer">
          
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'UsersList',
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
    UserstList() {
      this.axiosInstance.get('user')
        .then(reponse => {
          this.info = reponse.data.result.reverse();
          console.log(this.info);
        })
    },
  },
  mounted() {
    this.UsersList();
  },
}
</script>

<style scoped>
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