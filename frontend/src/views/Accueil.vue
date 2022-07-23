<template>
  <div>

    <loader></loader>
    <navbar></navbar>
    <mon-profil></mon-profil>
    <creation :info="info" @updateList="newList"></creation>

    <div class="card my-4" :key="index" v-for="(post, index) in info">
      <div class="card-body" v-if="showText != true">
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
          <i class="fas fa-comment" :id="post.id" @click="commentPost"> {{ post.totalComment1 + post.totalComment2 + post.totalComment3 }}</i>
          <i class="fas fa-heart" :id="post.id" @click="likePost"> {{ post.post_likes }} </i>
          <i class="fas fa-edit" :id="post.id" @click="updatePost" v-if="post.user_id == userId"></i>
          <i class="fas fa-trash" :id="post.id" @click="deletePost" v-if="post.user_id == userId && roleId == 3"></i>
          <i class="fas fa-trash" :id="post.id" @click="deleteAnyonePost" v-if="post.user_id == userId && roleId == 1 || roleId == 4"></i>
        </div>
      </div>
    </div>

    <h2 v-if="showText" class="none"> Il n'y a aucun post pour le moment. <br> Publier le premier post. </h2>

    <comment-modale :commentModale="commentModale" :toggleCommentModale="toggleCommentModale" :post_id="post_id"
      @updateList="newList"></comment-modale>
    <update-modale :updatePostModale="updatePostModale" :togglePostModale="togglePostModale" v-if="dataPost && post_id" :post_id="post_id"
      @updateList="newList" :dataPost="dataPost"></update-modale>
    <delete-modale :deletePostModale="deletePostModale" :deleteAnyonePostModale="deleteAnyonePostModale" :toggleDeletePostModale="toggleDeletePostModale" :toggleDeleteAnyonePostModale="toggleDeleteAnyonePostModale" :post_id="post_id"
      @updateList="newList"></delete-modale>
    <profil-update-modale :profilModale="profilModale" :toggleProfilModale="toggleProfilModale"></profil-update-modale>
    <profil-delete-modale :deleteProfilModale="deleteProfilModale" :toggleDeleteProfilModale="toggleDeleteProfilModale"></profil-delete-modale>
  </div>
</template>

<script>

import LoaderComponent from '@/components/Loader.vue'
import NavbarComponent from '@/components/Navbar.vue'
import CreationPost from '@/components/CreationPost.vue'
import MyProfilComponent from '@/views/MyProfil.vue'
import CommentModale from '@/components/CommentModale.vue'
import PostUpdateModale from '@/components/PostUpdateModale.vue'
import DeletePostModale from '@/components/DeletePostModale.vue'
import UpdateProfilModale from '@/components/UpdateProfilModale.vue'
import DeleteProfilModale from '@/components/DeleteProfilModale.vue'
import axios from 'axios'
import {bus} from '../main'

export default {
  name: 'AccueilComponent',
  components: {
    'loader': LoaderComponent,
    'navbar': NavbarComponent,
    'creation': CreationPost,
    'mon-profil': MyProfilComponent,
    'comment-modale': CommentModale,
    'update-modale': PostUpdateModale,
    'delete-modale': DeletePostModale,
    'profil-update-modale': UpdateProfilModale,
    'profil-delete-modale': DeleteProfilModale
  },
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      info: null,
      dataPost: null,
      userId: this.$store.state.userId,
      roleId: this.$store.state.roleUser,
      post_id: null,
      commentModale: false,
      updatePostModale: false,
      deletePostModale: false,
      deleteAnyonePostModale: false,
      profilModale: false,
      deleteProfilModale: false,
      totalComment: null,
      showText: false
    }
  },
  methods: {
    postList() {
      this.axiosInstance.get('post')
        .then(reponse => {
          this.info = reponse.data.result.reverse();
          if(this.info.length == 0){
            this.showText = true;
          } else {
            this.showText = false;
          }
        })
    },
    toggleCommentModale() {
      this.commentModale = !this.commentModale;
    },
    togglePostModale() {
      this.updatePostModale = !this.updatePostModale;
    },
    toggleDeletePostModale() {
      this.deletePostModale = !this.deletePostModale;
    },
    toggleDeleteAnyonePostModale() {
      this.deleteAnyonePostModale = !this.deleteAnyonePostModale;
    },
     toggleProfilModale() {
      this.profilModale = !this.profilModale;
    },
    toggleDeleteProfilModale() {
      this.deleteProfilModale = !this.deleteProfilModale;
    },
    commentPost(e) {
      this.post_id = e.target.id;
      this.commentModale = !this.commentModale;
    },
    likePost(e) {
      this.post_id = e.target.id;
      this.axiosInstance.post('post/like-post/' + this.post_id)
        .then(() => {
          this.postList();
        })
    },
    updatePost(e) {
      this.post_id = e.target.id;
      this.updatePostModale = !this.updatePostModale;
      this.axiosInstance.get('post/' + this.post_id)
        .then(reponse => {
          this.dataPost = reponse.data[0];
        })
    },
    deletePost(e) {
      this.post_id = e.target.id;
      this.deletePostModale = !this.deletePostModale;
    },
    deleteAnyonePost(e) {
      this.post_id = e.target.id;
      this.deleteAnyonePostModale = !this.deleteAnyonePostModale;
    },
    newList() {
      this.postList();
    },
  },
  mounted() {
    this.postList();
    bus.$on('updateProfil', () => {
      this.toggleProfilModale();
    });
    bus.$on('deleteProfil', () => {
      this.toggleDeleteProfilModale();
    });
  },
}
</script>

<style scoped>

.card {
  padding: 10px;
  width: 43%;
  margin: auto;
  border: 0;
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
  justify-content: space-between;
}

.card-body-header-text {
  text-decoration: none;
  color: black;
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

.none {
  color: white;
  margin-top: 150px;
}
</style>