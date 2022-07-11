<template>
<div>
  <navbar></navbar>
  <mon-profil></mon-profil>

  <div class="card">
    <div class="card-body" :key="index" v-for="(post, index) in info">
      <div class="card-body-header">
        <p class="card-body-header-text bold" v-if="post.user_id == userId"> Par vous </p>
        <p class="card-body-header-text bold" v-else> Par {{ post.nom + ' ' + post.prenom }} </p>
        <p class="card-body-header-text"> {{ new Date(post.post_date).toLocaleString() }} </p>
      </div>
      <img :src="post.post_imageUrl" class="card-image">
      <p class="card-text"> {{ post.post_content }} </p>
      <div class="card-body-footer">
        <i class="fas fa-comment"> {{ post.totalComment }} </i>
        <i class="fas fa-heart"> {{ post.post_likes }} </i>
        <i class="fas fa-edit" v-if="post.user_id == userId"></i>
        <i class="fas fa-trash" @click="deletePost" v-if="post.user_id == userId"></i>
      </div>
    </div>
  </div>

  <create-comment :post_id="index"></create-comment>

  <comment :post_id="index"></comment>
  
  </div>
</template>

<script>

import NavbarComponent from '@/components/Navbar.vue'
import MyProfilComponent from '@/views/MyProfil.vue'
import CreationComment from '@/components/CreationComment.vue'
import CommentComponent from '@/components/Comment.vue'
import axios from 'axios'

export default {
  name: 'OnePost',
  components: {
    'navbar': NavbarComponent,
    'mon-profil': MyProfilComponent,
    'create-comment': CreationComment,
    'comment': CommentComponent
  },
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      info: null,
      index: this.$route.params.id,
      userId: this.$store.state.userId
    }
  },
  methods: {
    deletePost(){
      this.$emit('updateList');
    },
  },
  mounted() {
    this.axiosInstance.get('post/' + this.index)
      .then(reponse => {
        this.info = reponse.data;
        console.log(this.info);
      })
  },
}
</script>

<style scoped>

.card {
  padding: 10px;
  width: 43%;
  margin: auto;
  border: 0px;
  background: white;
}

.card-body {
  width: 100%;
  margin: auto;
}

.card-body-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-body-header-text {
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
</style>