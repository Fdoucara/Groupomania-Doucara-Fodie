<template>
  <div>
    <loader></loader>
    <navbar></navbar>
    <mon-profil></mon-profil>

    <div class="card">
      <div class="card-body" :key="index" v-for="(post, index) in info">
        <div class="card-body-header">
          <div class="card-body-header-back">
          </div>
          <p v-if="post.user_id == userId" class="card-body-header-text bold"> Par vous </p>
          <router-link :to="`/profil/${post.user_id}`" v-else class="card-body-header-text bold">
            <p> Par {{ post.nom + ' ' + post.prenom }} </p>
          </router-link>
          <p class="card-body-header-text"> Le {{ new Date(post.post_date).toLocaleDateString() }} </p>
        </div>
        <img :src="post.post_imageUrl" class="card-image">
        <p class="card-text"> {{ post.post_content }} </p>
        <div class="card-body-footer">
          <i class="fas fa-comment"> {{ post.totalComment }} </i>
          <i class="fas fa-heart" :id="post.id" @click="likePost"> {{ post.post_likes }} </i>
          <i class="fas fa-edit" :id="post.id" @click="updatePost" v-if="post.user_id == userId"></i>
          <i class="fas fa-trash" :id="post.id" @click="deletePost" v-if="post.user_id == userId"></i>
        </div>
      </div>
    </div>

    <create-comment :post_id="this.$route.params.id" @updatePostInfo="updatePostInfo"></create-comment>

    <comment :post_id="this.$route.params.id"></comment>

    <update-modale :updatePostModale="updatePostModale" :togglePostModale="togglePostModale" :post_id="postId"
      @updateList="updatePostInfo"></update-modale>
    <delete-modale :deletePostModale="deletePostModale" :toggleDeletePostModale="toggleDeletePostModale"
      :post_id="postId" @updateList="updatePostInfo"></delete-modale>


  </div>
</template>

<script>

import LoaderComponent from '@/components/Loader.vue'
import NavbarComponent from '@/components/Navbar.vue'
import MyProfilComponent from '@/views/MyProfil.vue'
import CreationComment from '@/components/CreationComment.vue'
import CommentComponent from '@/components/Comment.vue'
import PostUpdateModale from '@/components/PostUpdateModale.vue'
import DeletePostModale from '@/components/DeletePostModale.vue'
import axios from 'axios'

export default {
  name: 'OnePost',
  components: {
    'loader': LoaderComponent,
    'navbar': NavbarComponent,
    'mon-profil': MyProfilComponent,
    'create-comment': CreationComment,
    'comment': CommentComponent,
    'update-modale': PostUpdateModale,
    'delete-modale': DeletePostModale,
  },
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      info: null,
      userId: this.$store.state.userId,
      postId: null,
      updatePostModale: false,
      deletePostModale: false
    }
  },
  methods: {
    getPostInfo() {
      this.axiosInstance.get('post/' + this.$route.params.id)
        .then(reponse => {
          this.info = reponse.data;
        })
    },
    togglePostModale() {
      this.updatePostModale = !this.updatePostModale;
    },
    toggleDeletePostModale() {
      this.deletePostModale = !this.deletePostModale;
    },
    likePost(e) {
      this.postId = e.target.id;
      this.axiosInstance.post('post/like-post/' + this.postId)
        .then(() => {
          this.getPostInfo();
        })
    },
    updatePost(e) {
      this.postId = e.target.id;
      this.updatePostModale = !this.updatePostModale;
    },
    deletePost(e) {
      this.postId = e.target.id;
      this.deletePostModale = !this.deletePostModale;
    },
    updatePostInfo() {
      this.getPostInfo();
    }
  },
  mounted() {
    this.$watch(
      () => this.$route.params.id,
      () => {
        console.log(this.$route.params.id);
        this.getPostInfo();
      }
    ),
      this.getPostInfo();
  },
}
</script>

<style scoped>
.card {
  padding: 10px;
  width: 43%;
  margin: auto;
  border: 0px;
  border-radius: 0;
  background: white;
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
  font-size: 21px;
}
</style>