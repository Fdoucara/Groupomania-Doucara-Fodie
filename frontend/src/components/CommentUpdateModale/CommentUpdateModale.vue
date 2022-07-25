<template>
  <div class="bloc-modale" v-if="updateCommentModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale-title"> Modifier le commentaire
        <hr>
      </h2>
      <div class="modale-content">
        <form>
          <div class="modale-body-content">
            <img :src="userImage" class="modale-image">
            <textarea class="modale-body-content-text" id="comment_content" v-model="formData.comment_content"
              placeholder="Que voulez écrire de nouveau ?" @keyup="verifWrite"></textarea>
          </div>

          <div class="modale-body-footer">
            <div class="modale-body-footer-upload">
              <input type="file" id="comment_update_image" @change="onFile">
              <label for="comment_update_image"> <i class="fas fa-upload"></i> &nbsp; Ajouter une image </label>
            </div>
            <div class="modale-body-footer-send">
              <button class="btn btn-color" @click="sendData"> <i class="fas fa-check"></i> &nbsp; Valider </button>
            </div>
          </div>
        </form>
        <p class="commentmodale_upload"></p>
        <p class="commentModale_error"></p>
      </div>
      <button class="btn-modale btn" @click="toggleCommentModale"> X </button>
    </div>

  </div>
</template>

<script>

import axios from 'axios'
import { bus } from '../../main'

export default {
  name: 'CommentUpdateModale',
  props: ['updateCommentModale', 'toggleCommentModale', 'comment_id', 'dataComment'],
  data() {
    return {
      formData: {
        comment_content: '',
        selectedFile: null,
      },
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/',
      }),
      config: {
        headers: { 'Content-Type': 'multipart/form-data' }
      },
      old_comment_content: '',
      filename: '',
      paragraphe: undefined,
      paragrapheError: undefined,
      userImage: null
    }
  },
  methods: {
    getUserImage() {
      this.axiosInstance.get('user/' + this.$store.state.userId)
        .then(reponse => {
          this.userImage = reponse.data.result[0].user_imageUrl;
        })
    },
    getCommentInfo() {
      this.formData.comment_content = this.dataComment.comment_content;
      this.old_comment_content = this.formData.comment_content;
    },
    onFile(event) {
      this.formData.selectedFile = event.target.files[0];
      this.filename = event.target.files[0].name;
      this.paragraphe = document.querySelector('.commentmodale_upload');
      if (this.formData.selectedFile) {
        this.paragraphe.textContent = `${this.filename}`;
      } else {
        this.paragraphe.textContent = '';
      }
    },
    verifWrite() {
      this.paragrapheError = document.querySelector('.commentModale_error');
      this.paragrapheError.textContent = '';
    },
    sendData() {
      this.paragrapheError = document.querySelector('.commentModale_error');
      if (!this.formData.selectedFile && this.formData.comment_content != this.old_comment_content) {
        this.axiosInstance.patch('post/update-comment/' + this.comment_id, {
          comment_content: this.formData.comment_content
        })
          .then(reponse => {
            if (reponse.status == 201) {
              this.old_comment_content = this.formData.comment_content;
              this.$emit('updateCommentList');
              bus.$emit('postAfterUpdate');
              this.toggleCommentModale();
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      else if (!this.formData.selectedFile && this.formData.comment_content == this.old_comment_content) {
        this.paragrapheError.textContent = "Aucune modification n'a été effectuée.";
        this.paragrapheError.style.fontSize = '20px';
        this.paragrapheError.style.color = 'red';
      }
      else if (this.formData.selectedFile && this.formData.comment_content == this.old_comment_content) {
        const fd = new FormData();
        fd.append('image', this.formData.selectedFile, this.filename);
        this.axiosInstance.patch('post/update-comment/' + this.comment_id, fd, this.config)
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateCommentList');
              bus.$emit('postAfterUpdate');
              this.formData.selectedFile = null;
              this.paragraphe.textContent = '';
              this.paragrapheError.textContent = '';
              this.toggleCommentModale();
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      else {
        const fd = new FormData();
        fd.append('image', this.formData.selectedFile, this.filename);
        fd.append('comment_content', this.formData.comment_content);
        this.axiosInstance.patch('post/update-comment/' + this.comment_id, fd, this.config)
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateCommentList');
              bus.$emit('postAfterUpdate');
              this.old_comment_content = this.formData.comment_content;
              this.formData.selectedFile = null;
              this.paragraphe.textContent = '';
              this.paragrapheError.textContent = '';
              this.toggleCommentModale();
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
    },
  },
  mounted() {
    this.getUserImage();
    this.getCommentInfo();
    bus.$on('profilAfterUpdate', () => {
      this.getUserImage();
    });
  },
}
</script>

<style lang="scss" scoped src="./commentupdate.scss"></style>