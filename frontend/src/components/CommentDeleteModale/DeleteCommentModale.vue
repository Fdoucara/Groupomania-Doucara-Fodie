<template>
<div>
  
  <div class="bloc_modale" v-if="deleteCommentModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale_title"> Supprimer ce commentaire
        <hr>
      </h2>
      <div class="modale_content">
        <p class="modale_content_item"> Êtes-vous certain que vous voulez supprimer ce commentaire ? Il ne peut plus être
          récupéré ! </p>
      </div>
      <div class="modale_footer">
        <div class="modale_footer_cancel">
          <button class="btn modale_footer_cancel_button" @click="toggleDeleteCommentModale"> Annuler </button>
        </div>
        <div class="modale_footer_send">
          <button class="btn modale_footer_send_button" @click.prevent="deleteComment"> Valider </button>
        </div>
      </div>
    </div>

  </div>

   <div class="bloc_modale" v-if="deleteAnyoneCommentModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale_title"> Supprimer ce commentaire
        <hr>
      </h2>
      <div class="modale_content">
        <p class="modale_content_item"> Êtes-vous certain que vous voulez supprimer ce commentaire ? Il ne peut plus être
          récupéré ! </p>
      </div>
      <div class="modale_footer">
        <div class="modale_footer_cancel">
          <button class="btn modale_footer_cancel_button" @click="toggleDeleteAnyoneCommentModale"> Annuler </button>
        </div>
        <div class="modale_footer_send">
          <button class="btn modale_footer_send_button" @click="deleteAnyoneComment"> Valider </button>
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