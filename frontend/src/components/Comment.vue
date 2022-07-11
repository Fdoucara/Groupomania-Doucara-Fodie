<template>
  <div>

    <div class="card my-4" :key="index" v-for="(comment, index) in info">
        <div class="card-body">
          <div class="card-body-header">
            <router-link to="/monProfil" v-if="comment.user_id == userId" class="card-body-header-text bold">
              <p> Par vous </p>
            </router-link>
            <router-link :to="`/profil/${comment.user_id}`" v-else class="card-body-header-text bold">
              <p> Par {{ comment.nom + ' ' + comment.prenom }} </p>
            </router-link>
            <p class="card-body-header-text"> Le {{ new Date(comment.comment_date).toLocaleString() }} </p>
          </div>
          <img :src="comment.comment_imageUrl" class="card-image">
          <p class="card-text"> {{ comment.comment_content }} </p>
          <div class="card-body-footer">
            <i class="fas fa-comment"> {{ comment.totalComment }}</i>
            <i class="fas fa-heart"> {{ comment.post_likes }} </i>
            <router-link to="/" v-if="comment.user_id == userId" class="logo_link"> <i class="fas fa-edit"></i>
            </router-link>
            <router-link to="/" v-if="comment.user_id == userId" class="logo_link"> <i class="fas fa-trash"></i>
            </router-link>
          </div>
        </div>
    </div>

  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'CommentComponent',
  props: ['post_id'],
  components: {
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
    commentList() {
      this.axiosInstance.get('post/comment/' +  this.post_id)
        .then(reponse => {
          console.log('Les com ', reponse);
          this.info = reponse.data.result;
        })
    },
  },
  mounted() {
    this.commentList();
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

.card:hover {
  background: #eef2f3;
}

.card_link {
  text-decoration: none;
  color: black;
  padding: 0;
  margin: 0;
  transition: background 0.5s ease-in-out;
}

.card-body {
  width: 100%;
  margin: 0;
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
  font-size: 18px;
}

.bold {
  font-weight: bold;
}

img {
  width: 100%;
  height: auto;
  padding-bottom: 25px;
}

.card-text {
  text-align: left;
  font-size: 22px;
  margin: 0;
  padding-bottom: 25px;
}

.card-body-footer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 10px;
  font-size: 25px;
}

.logo_link {
  text-decoration: none;
  color: black;
}
</style>