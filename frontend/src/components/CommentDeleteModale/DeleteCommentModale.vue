<template>
<div>
  
  <div class="bloc-modale" v-if="deleteCommentModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale-title"> Supprimer ce post
        <hr>
      </h2>
      <div class="modale-content">
        <p class="modale-content-item"> Êtes-vous certain que vous voulez supprimer ce commentaire ? Il ne peut plus être
          récupéré ! </p>
      </div>
      <div class="modale-body-footer">
        <div class="modale-body-footer-send">
          <button class="btn btn-color1" @click="toggleDeleteCommentModale"> Annuler </button>
        </div>
        <div class="modale-body-footer-send">
          <button class="btn btn-color2" @click="deleteComment"> Valider </button>
        </div>
      </div>
    </div>

  </div>

   <div class="bloc-modale" v-if="deleteAnyoneCommentModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale-title"> Supprimer ce post
        <hr>
      </h2>
      <div class="modale-content">
        <p class="modale-content-item"> Êtes-vous certain que vous voulez supprimer ce commentaire ? Il ne peut plus être
          récupéré ! </p>
      </div>
      <div class="modale-body-footer">
        <div class="modale-body-footer-send">
          <button class="btn btn-color1" @click="toggleDeleteAnyoneCommentModale"> Annuler </button>
        </div>
        <div class="modale-body-footer-send">
          <button class="btn btn-color2" @click="deleteAnyoneComment"> Valider </button>
        </div>
      </div>
    </div>

  </div>

</div>
</template>

<script>

import axios from 'axios'
import { bus } from '../../main'

export default {
  name: 'DeletePostModale',
  props: ['deleteCommentModale', 'deleteAnyoneCommentModale', 'toggleDeleteCommentModale', 'toggleDeleteAnyoneCommentModale', 'comment_id'],
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/',
      })
    }
  },
  methods: {
    deleteComment() {
      this.axiosInstance.delete('post/delete-comment/' + this.comment_id)
        .then(() => {
          this.$emit('updateCommentList');
          bus.$emit('postAfterDelete');
          this.toggleDeleteCommentModale();
        })
    },
    deleteAnyoneComment() {
      this.axiosInstance.delete('post/delete-anyone-comment/' + this.comment_id)
        .then(() => {
          this.$emit('updateCommentList');
          bus.$emit('postAfterDelete');
          this.toggleDeleteAnyoneCommentModale();
        })
    }
  },
}
</script>

<style lang="scss" scoped src="./deletecomment.scss"></style>