<template>
  <div>
    <loader></loader>
    <navbar></navbar>
    <mon-profil></mon-profil>

    <div class="card">
      <div class="card-body" :key="index" v-for="(post, index) in info">
        <div class="card-body-header">
          <p v-if="post.user_id == userId" class="card-body-header-text bold"> Par vous </p>
          <router-link :to="`/profil/${post.user_id}`" v-else class="card-body-header-text bold">
            <p> Par {{ post.nom + ' ' + post.prenom }} </p>
          </router-link>
          <p class="card-body-header-text"> Le {{ new Date(post.post_date).toLocaleDateString() }} </p>
        </div>
        <img :src="post.post_imageUrl" class="card-image">
        <p class="card-text"> {{ post.post_content }} </p>
        <div class="card-body-footer">
          <i class="fas fa-comment"> {{ post.totalComment1 + post.totalComment2 + post.totalComment3 }} </i>
          <i class="fas fa-heart" :id="post.id" @click="likePost"> {{ post.post_likes }} </i>
          <i class="fas fa-edit" :id="post.id" @click="updatePost" v-if="post.user_id == userId"></i>
          <i class="fas fa-trash" :id="post.id" @click="deletePost" v-if="post.user_id == userId && roleId == 3"></i>
          <i class="fas fa-trash" :id="post.id" @click="deleteAnyonePost"
            v-if="post.user_id == userId && roleId == 1 || roleId == 4"></i>
        </div>
      </div>
    </div>

    <create-comment :post_id="this.$route.params.id" @updatePostInfo="updatePostInfo"></create-comment>

    <comment :post_id="this.$route.params.id"></comment>

    <update-modale :updatePostModale="updatePostModale" :togglePostModale="togglePostModale" v-if="dataPost && post_id"
      :post_id="post_id" @updateList="updatePostInfo" :dataPost="dataPost"></update-modale>
    <delete-modale :deletePostModale="deletePostModale" :deleteAnyonePostModale="deleteAnyonePostModale"
      :toggleDeletePostModale="toggleDeletePostModale" :toggleDeleteAnyonePostModale="toggleDeleteAnyonePostModale"
      :post_id="post_id" @updateList="updatePostInfo"></delete-modale>
    <profil-update-modale :profilModale="profilModale" :toggleProfilModale="toggleProfilModale"></profil-update-modale>
    <profil-delete-modale :deleteProfilModale="deleteProfilModale" :toggleDeleteProfilModale="toggleDeleteProfilModale">
    </profil-delete-modale>

  </div>
</template>

<script>

import LoaderComponent from '@/components/Loader/Loader.vue'
import NavbarComponent from '@/components/Navbar/Navbar.vue'
import MyProfilComponent from '@/views/MyProfil/MyProfil.vue'
import CreationComment from '@/components/CommentCreation/CreationComment.vue'
import CommentComponent from '@/components/Comment/Comment.vue'
import PostUpdateModale from '@/components/PostUpdateModale/PostUpdateModale.vue'
import DeletePostModale from '@/components/PostDeleteModale/DeletePostModale.vue'
import UpdateProfilModale from '@/components/ProfilUpdateModale/UpdateProfilModale.vue'
import DeleteProfilModale from '@/components/ProfilDeleteModale/DeleteProfilModale.vue'
import { bus } from '../../main'
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
      updatePostModale: false,
      deletePostModale: false,
      profilModale: false,
      deleteProfilModale: false,
      deleteAnyonePostModale: false
    }
  },
  methods: {
    getPostInfo() {
      this.axiosInstance.get('post/' + this.$route.params.id)
        .then(reponse => {
          this.info = reponse.data.result;
        })
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
    likePost(e) {
      this.post_id = e.target.id;
      this.axiosInstance.post('post/like-post/' + this.post_id)
        .then(() => {
          this.getPostInfo();
        })
    },
    updatePost(e) {
      this.post_id = e.target.id;
      this.updatePostModale = !this.updatePostModale;
      this.axiosInstance.get('post/' + this.post_id)
        .then(reponse => {
          this.dataPost = reponse.data.result[0];
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
    updatePostInfo() {
      this.getPostInfo();
    }
  },
  mounted() {
    this.$watch(
      () => this.$route.params.id,
      () => {
        this.getPostInfo();
      }
    ),
      this.getPostInfo();
    bus.$on('postAfterUpdate', () => {
      this.getPostInfo();
    });
    bus.$on('postAfterDelete', () => {
      this.getPostInfo();
    });
    bus.$on('updateProfil', () => {
      this.toggleProfilModale();
    });
    bus.$on('deleteProfil', () => {
      this.toggleDeleteProfilModale();
    });
  },
}
</script>

<style lang="scss" scoped src="./onepost.scss"></style>