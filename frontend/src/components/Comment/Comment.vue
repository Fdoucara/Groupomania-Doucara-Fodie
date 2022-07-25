<template>
  <div>

    <div class="card my-4" :key="index" v-for="(comment, index) in info">
      <div class="card-body">
        <div class="card-body-header">
          <p v-if="comment.user_id == userId" class="card-body-header-text bold"> Par vous </p>
          <router-link :to="`/profil/${comment.user_id}`" v-else class="card-body-header-text bold">
            <p> Par {{ comment.nom + ' ' + comment.prenom }} </p>
          </router-link>
          <p class="card-body-header-text"> Le {{ new Date(comment.comment_date).toLocaleDateString() }} </p>
        </div>
        <img :src="comment.comment_imageUrl" class="card-image">
        <p class="card-text"> {{ comment.comment_content }} </p>
        <div class="card-body-footer">
          <i class="fas fa-heart" :id="comment.id" @click="likeComment"> {{ comment.comment_likes }} </i>
          <i class="fas fa-edit" :id="comment.id" @click="updateComment" v-if="comment.user_id == userId"></i>
          <i class="fas fa-trash" :id="comment.id" @click="deleteComment"
            v-if="comment.user_id == userId && roleId == 3"></i>
          <i class="fas fa-trash" :id="comment.id" @click="deleteAnyoneComment"
            v-if="comment.user_id == userId && roleId == 1 || roleId == 4"></i>
        </div>
      </div>
    </div>

    <update-modale :updateCommentModale="updateCommentModale" :toggleCommentModale="toggleCommentModale"
      :comment_id="comment_id" @updateCommentList="updateCommentList"></update-modale>
    <delete-modale :deleteCommentModale="deleteCommentModale" :deleteAnyoneCommentModale="deleteAnyoneCommentModale"
      :toggleDeleteCommentModale="toggleDeleteCommentModale"
      :toggleDeleteAnyoneCommentModale="toggleDeleteAnyoneCommentModale" :comment_id="comment_id"
      @updateCommentList="updateCommentList"></delete-modale>

  </div>
</template>

<script>

import CommentUpdateModale from '@/components/CommentUpdateModale/CommentUpdateModale.vue'
import DeleteCommentModale from '@/components/CommentDeleteModale/DeleteCommentModale.vue'
import { bus } from '../../main'
import axios from 'axios'

export default {
  name: 'CommentComponent',
  props: ['post_id'],
  components: {
    'update-modale': CommentUpdateModale,
    'delete-modale': DeleteCommentModale,
  },
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      info: undefined,
      userId: this.$store.state.userId,
      roleId: this.$store.state.roleUser,
      comment_id: null,
      updateCommentModale: false,
      deleteCommentModale: false,
      deleteAnyoneCommentModale: false
    }
  },
  methods: {
    commentList() {
      this.axiosInstance.get('post/comment/' + this.$route.params.id)
        .then(reponse => {
          this.info = reponse.data.result.reverse();
        })
    },
    toggleCommentModale() {
      this.updateCommentModale = !this.updateCommentModale;
    },
    toggleDeleteCommentModale() {
      this.deleteCommentModale = !this.deleteCommentModale;
    },
    toggleDeleteAnyoneCommentModale() {
      this.deleteAnyoneCommentModale = !this.deleteAnyoneCommentModale;
    },
    likeComment(e) {
      this.comment_id = e.target.id;
      this.axiosInstance.post('post/like-comment/' + this.comment_id)
        .then(() => {
          this.commentList();
        })
    },
    updateComment(e) {
      this.comment_id = e.target.id;
      this.updateCommentModale = !this.updateCommentModale;
    },
    deleteComment(e) {
      this.comment_id = e.target.id;
      this.deleteCommentModale = !this.deleteCommentModale;
    },
    deleteAnyoneComment(e) {
      this.comment_id = e.target.id;
      this.deleteAnyoneCommentModale = !this.deleteAnyoneCommentModale;
    },
    updateCommentList() {
      this.commentList();
    }
  },
  mounted() {
    this.$watch(
      () => this.$route.params.id,
      () => {
        this.commentList();
      }
    ),
      this.commentList();
    bus.$on('updateCommentList', () => {
      this.commentList();
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
  border-radius: 15px;
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