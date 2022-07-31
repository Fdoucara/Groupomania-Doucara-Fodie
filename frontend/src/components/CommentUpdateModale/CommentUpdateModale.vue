<template>
  <div class="bloc_modale" v-if="updateCommentModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale_title"> Modifier le commentaire
        <hr>
      </h2>
      <div class="modale_content">
        <form>
          <div class="modale_content_body">
            <img :src="userImage" class="modale_content_body_image">
            <textarea class="modale_content_body_text" id="comment_content" v-model="formData.comment_content"
              placeholder="Que voulez écrire de nouveau ?" @keyup="verifWrite"></textarea>
          </div>

          <div class="modale_content_footer">
            <div class="modale_content_footer_upload">
              <input type="file" id="image_update_comment" class="modale_content_footer_upload_input" @change="onFile">
              <label for="image_update_comment" class="modale_content_footer_upload_label"> <i class="fas fa-upload"></i> &nbsp;
                <p class="modale_content_footer_upload_label_text"> Ajouter une
                  image </p>
              </label>
            </div>
            <div class="modale_content_footer_send">
              <button class="btn modale_content_footer_send_button" @click.prevent="sendData"> <i
                  class="fas fa-paper-plane"></i>
                &nbsp; <p class="btn modale_content_footer_send_button_text"> Publier </p>
              </button>
            </div>
          </div>
        </form>
        <p class="modale_content_upload_image"></p>
        <p class="modale_content_commentModale_error"></p>
      </div>
      <button class="btn modale_btn" @click="toggleCommentModale"> X </button>
    </div>

  </div>
</template>

<script>

import axios from 'axios'
import { bus } from '../../main'

export default {
  name: 'CommentUpdateModale',
  props: ['updateCommentModale', 'toggleCommentModale', 'comment_id'],
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
      dataComment: '',
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
      this.axiosInstance.get('post/comment/' + this.comment_id)
        .then(reponse => {
          this.dataComment = reponse.data.result[0];
          this.formData.comment_content = this.dataComment.comment_content;
          this.old_comment_content = this.formData.comment_content;
        })
    },
    onFile(event) {
      this.formData.selectedFile = event.target.files[0];
      this.filename = event.target.files[0].name;
      this.paragraphe = document.querySelector('.modale_content_upload_image');
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
      this.paragrapheError = document.querySelector('.modale_content_commentModale_error');
      this.paragrapheError.textContent = '';
    },
    sendData() {
      this.paragrapheError = document.querySelector('.modale_content_commentModale_error');
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
        this.paragrapheError.style.textAlign = 'center'
        this.paragrapheError.style.fontSize = '16px';
        this.paragrapheError.style.marginBottom = '0'
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
    this.$watch(
      () => this.comment_id,
      () => {
        this.getCommentInfo();
      }
    );
    this.getCommentInfo();
    bus.$on('profilAfterUpdate', () => {
      this.getUserImage();
    });
  },
}
</script>

<style lang="scss" scoped src="./commentupdate.scss">
</style>