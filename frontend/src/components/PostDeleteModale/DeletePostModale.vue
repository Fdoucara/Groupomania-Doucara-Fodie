<template>
<div>
  <div class="bloc-modale" v-if="deletePostModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale-title"> Supprimer ce post
        <hr>
      </h2>
      <div class="modale-content">
        <p class="modale-content-item"> Êtes-vous certain que vous voulez supprimer ce post ? Il ne peut plus être
          récupéré ! </p>
      </div>
      <div class="modale-body-footer">
        <div class="modale-body-footer-send">
          <button class="btn btn-color1" @click="toggleDeletePostModale"> Annuler </button>
        </div>
        <div class="modale-body-footer-send">
          <button class="btn btn-color2" @click="deletePost"> Valider </button>
        </div>
      </div>
    </div>

  </div>

 <div class="bloc-modale" v-if="deleteAnyonePostModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale-title"> Supprimer ce post
        <hr>
      </h2>
      <div class="modale-content">
        <p class="modale-content-item"> Êtes-vous certain que vous voulez supprimer ce post ? Il ne peut plus être
          récupéré ! </p>
      </div>
      <div class="modale-body-footer">
        <div class="modale-body-footer-send">
          <button class="btn btn-color1" @click="toggleDeleteAnyonePostModale"> Annuler </button>
        </div>
        <div class="modale-body-footer-send">
          <button class="btn btn-color2" @click="deleteAnyonePost"> Valider </button>
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
  props: ['deletePostModale', 'deleteAnyonePostModale', 'toggleDeletePostModale', 'toggleDeleteAnyonePostModale', 'post_id'],
  data() {
    return {
      formData: {
        post_content: null,
        selectedFile: null,
      },
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/',
      }),
      config: {
        headers: { 'Content-Type': 'multipart/form-data' }
      },
      filename: '',
      paragraphe: undefined,
      paragrapheError: undefined,
    }
  },
  methods: {
    deletePost() {
      this.axiosInstance.delete('post/delete-post/' + this.post_id)
        .then(() => {
          if(this.$route.path == `/post/${this.post_id}`) {
            this.$router.push('/accueil');
            this.toggleDeletePostModale(); 
          } else {
            this.$emit('updateList');
            bus.$emit('listAfterDelete');
            this.toggleDeletePostModale(); 
          }        
        })
    },
    deleteAnyonePost() {
      this.axiosInstance.delete('post/delete-anyone-post/' + this.post_id)
        .then(() => {
           if(this.$route.path == `/post/${this.post_id}`) {
            this.$router.push('/accueil');
            this.toggleDeleteAnyonePostModale(); 
          } else {
            this.$emit('updateList');
            bus.$emit('listAfterDelete');
            this.toggleDeleteAnyonePostModale();  
          }
           
        })
    }
  },
}
</script>

<style lang="scss" scoped src="./deletepost.scss"></style>