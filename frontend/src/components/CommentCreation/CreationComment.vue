<template>

  <div>
    <div class="card mt-1 mb-3">
      <div class="card_body">
        <form>
          <div class="card_body_content">
            <img :src="userImage" class="card_body_content_image">
            <textarea class="card_body_content_text" id="comment_content" v-model="formData.comment_content"
              placeholder="Rédiger votre commentaire ici..." @keyup="verifWrite"></textarea>
          </div>

          <div class="card_body_footer">
            <div class="card_body_footer_upload">
              <input type="file" id="image_create_comment" class="card_body_footer_upload_input" @change="onFile">
              <label for="image_create_comment" class="card_body_footer_upload_label"> <i class="fas fa-upload"></i> &nbsp; <p class="card_body_footer_upload_label_text"> Ajouter une
                image </p> </label>
            </div>
            <div class="card_body_footer_send">
              <button class="btn card_body_footer_send_button" @click.prevent="sendData"> <i class="fas fa-paper-plane"></i>
                &nbsp; <p class="btn card_body_footer_send_button_text"> Publier </p>
              </button>
            </div>
          </div>
        </form>
        <p class="card_body_comment_upload_image mt-3"></p>
        <p class="card_body_comment_error"></p>
      </div>
    </div>
  </div>

</template>


<script>

import { bus } from '../../main'
import axios from 'axios'

export default {
  name: 'CreationComment',
  props: ['post_id'],
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
    onFile(event) {
      this.formData.selectedFile = event.target.files[0];
      this.filename = event.target.files[0].name;
      this.paragraphe = document.querySelector('.card_body_comment_upload_image');
      if (this.formData.selectedFile) {
        this.paragraphe.textContent = `${this.filename}`;
        this.paragraphe.style.textAlign = 'center'
        this.paragraphe.style.fontSize = '18px';
        this.paragraphe.style.marginBottom = '7px'
      } else {
        this.paragraphe.textContent = '';
      }
    },
    verifWrite() {
      this.paragrapheError = document.querySelector('.card_body_comment_error');
      this.paragrapheError.textContent = '';
    },
    sendData() {
      this.paragrapheError = document.querySelector('.card_body_comment_error');
      if (!this.formData.selectedFile && this.formData.comment_content !='') {
        this.axiosInstance.post('post/create-comment/' + this.post_id, {
          comment_content: this.formData.comment_content
        })
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updatePostInfo');
              bus.$emit('updateCommentList');
              this.formData.comment_content = '';
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      else if (!this.formData.selectedFile && this.formData.comment_content == '') {
        this.paragrapheError.textContent = 'Vous devez impérativement rédiger du texte ou ajouter une image !';
        this.paragrapheError.style.textAlign = 'center'
        this.paragrapheError.style.fontSize = '16px';
        this.paragrapheError.style.marginBottom = '10px'
        this.paragrapheError.style.color = 'red';
      }
      else if (this.formData.selectedFile && this.formData.comment_content == '') {
        const fd = new FormData();
        fd.append('image', this.formData.selectedFile, this.filename);
        this.axiosInstance.post('post/create-comment/' + this.post_id, fd, this.config)
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updatePostInfo');
              bus.$emit('updateCommentList');
              this.formData.selectedFile = null;
              this.paragraphe.textContent = '';
              this.formData.comment_content = '';
              this.paragrapheError.textContent = '';
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
        this.axiosInstance.post('post/create-comment/' + this.post_id, fd, this.config)
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updatePostInfo');
              bus.$emit('updateCommentList');
              this.formData.selectedFile = null;
              this.paragraphe.textContent = '';
              this.formData.comment_content = '';
              this.paragrapheError = document.querySelector('.comment_error');
              this.paragrapheError.textContent = '';
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
    bus.$on('profilAfterUpdate', () => {
      this.getUserImage();
    });
  }
}
</script>

<style lang="scss" scoped src="./createcomment.scss"></style>