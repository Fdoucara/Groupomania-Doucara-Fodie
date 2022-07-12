<template>
  <div>

    <loader></loader>
    <navbar></navbar>
    <mon-profil></mon-profil>
    <creation :info="info" @updateList="newList"></creation>

    <div class="card my-4" :key="index" v-for="(post, index) in info">
      <div class="card-body">
        <router-link :to="`/post/${post.id}`" class="card_link">
          <div class="card-body-header">
            <router-link to="/monProfil" v-if="post.user_id == userId" class="card-body-header-text bold">
              <p> Par vous </p>
            </router-link>
            <router-link :to="`/profil/${post.user_id}`" v-else class="card-body-header-text bold">
              <p> Par {{ post.nom + ' ' + post.prenom }} </p>
            </router-link>
            <p class="card-body-header-text"> Le {{ new Date(post.post_date).toLocaleDateString() }} </p>
          </div>
          <img :src="post.post_imageUrl" class="card-image">
          <p class="card-text"> {{ post.post_content }} </p>
        </router-link>
        <div class="card-body-footer">
          <i class="fas fa-comment" :id="post.id" @click="commentPost"> {{ post.totalComment }}</i>
          <i class="fas fa-heart" :id="post.id" @click="likePost"> {{ post.post_likes }} </i>
          <i class="fas fa-edit" v-if="post.user_id == userId"></i>
          <i class="fas fa-trash" v-if="post.user_id == userId"></i>
        </div>
      </div>
    </div>

    <comment-modale :commentModale="commentModale" :toggleCommentModale="toggleCommentModale" :post_id="postId"
      @updateList="newList"></comment-modale>
  </div>
</template>

<script>

import LoaderComponent from '@/components/Loader.vue'
import NavbarComponent from '@/components/Navbar.vue'
import CreationPost from '@/components/CreationPost.vue'
import MyProfilComponent from '@/views/MyProfil.vue'
import CommentModale from '@/components/CommentModale.vue'
import axios from 'axios'

export default {
  name: 'AccueilComponent',
  components: {
    'loader': LoaderComponent,
    'navbar': NavbarComponent,
    'creation': CreationPost,
    'mon-profil': MyProfilComponent,
    'comment-modale': CommentModale
  },
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      info: undefined,
      userId: this.$store.state.userId,
      postId: null,
      commentModale: false,
    }
  },
  methods: {
    postList() {
      this.axiosInstance.get('post')
        .then(reponse => {
          this.info = reponse.data.result.reverse();
        })
    },
    toggleCommentModale() {
      this.commentModale = !this.commentModale;
    },
    commentPost(e) {
      this.commentModale = !this.commentModale;
      console.log(e.target.id);
      this.postId = e.target.id;
    },
    likePost(e) {
      console.log(e.target.id);
      this.postId = e.target.id;
      this.axiosInstance.post('post/like-post/' + this.postId)
        .then(reponse => {
          console.log('La rep ', reponse);
          this.postList();
        })
    },
    newList() {
      this.postList();
    },
  },
  mounted() {
    this.postList();
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
  font-weight: 700;
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
  font-size: 20px;
}
</style>