<template>
  <div class="bloc_modale" v-if="updatePostModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale_title"> Modifier le post
        <hr>
      </h2>
      <div class="modale_content">
        <form>
          <div class="modale_content_body">
            <img :src="userImage" class="modale_content_body_image">
            <textarea class="modale_content_body_text" id="post_content" v-model="formData.post_content"
              placeholder="Vous voulez modifier votre post. Que voulez écrire de nouveau ?"
              @keyup="verifWrite"></textarea>
          </div>

          <div class="modale_content_footer">
            <div class="modale_content_footer_upload">
              <input type="file" id="image" class="modale_content_footer_upload_input" @change="onFile">
              <label for="image" class="modale_content_footer_upload_label"> <i class="fas fa-upload"></i> &nbsp;
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
        <p class="modale_content_error"></p>
      </div>
      <button class="btn modale_btn" @click="togglePostModale"> X </button>
    </div>

  </div>
</template>

<script>

import axios from 'axios'
import { bus } from '../../main'

export default {
  name: 'PostUpdateModale',
  props: ['updatePostModale', 'togglePostModale', 'post_id'],
  data() {
    return {
      formData: {
        post_content: '',
        selectedFile: null,
      },
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/',
      }),
      config: {
        headers: { 'Content-Type': 'multipart/form-data' }
      },
      dataPost: '',
      old_post_content: '',
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
    getPostInfo() {
      this.axiosInstance.get('post/' + this.post_id)
        .then(reponse => {
          this.dataPost = reponse.data.result[0];
          this.formData.post_content = this.dataPost.post_content;
          this.old_post_content = this.formData.post_content;
        })
    },
    onFile(event) {
      this.formData.selectedFile = event.target.files[0];
      this.filename = event.target.files[0].name;
      this.paragraphe = document.querySelector('.modale_content_upload_image');
      if (this.formData.selectedFile) {
        this.paragraphe.textContent = `${this.filename}`;
        this.paragraphe.style.fontSize = '16px';
        this.paragraphe.style.textAlign = "center";
      } else {
        this.paragraphe.textContent = '';
      }
    },
    verifWrite() {
      this.paragrapheError = document.querySelector('.modale_content_error');
      this.paragrapheError.textContent = '';
    },
    sendData() {
      this.paragrapheError = document.querySelector('.modale_content_error');
      if (!this.formData.selectedFile && this.formData.post_content != this.old_post_content) {
        this.axiosInstance.patch('post/update-post/' + this.post_id, {
          post_content: this.formData.post_content
        })
          .then(reponse => {
            if (reponse.status == 201) {
              this.old_post_content = this.formData.post_content;
              this.$emit('updateList');
              bus.$emit('listAfterUpdate');
              this.togglePostModale();
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      else if (!this.formData.selectedFile && this.formData.post_content == this.old_post_content) {
        this.paragrapheError.textContent = "Aucune modification n'a été effectuée.";
        this.paragrapheError.style.fontSize = '16px';
        this.paragrapheError.style.textAlign = "center";
        this.paragrapheError.style.color = 'red';
      }
      else if (this.formData.selectedFile && this.formData.post_content == this.old_post_content) {
        const fd = new FormData();
        fd.append('image', this.formData.selectedFile, this.filename);
        this.axiosInstance.patch('post/update-post/' + this.post_id, fd, this.config)
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateList');
              bus.$emit('listAfterUpdate');
              this.formData.selectedFile = null;
              this.paragraphe.textContent = '';
              this.paragrapheError.textContent = '';
              this.togglePostModale();
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      else {
        const fd = new FormData();
        fd.append('image', this.formData.selectedFile, this.filename);
        fd.append('post_content', this.formData.post_content);
        this.axiosInstance.patch('post/update-post/' + this.post_id, fd, this.config)
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateList');
              bus.$emit('listAfterUpdate');
              this.old_post_content = this.formData.post_content;
              this.formData.selectedFile = null;
              this.paragraphe.textContent = '';
              this.paragrapheError.textContent = '';
              this.togglePostModale();
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
      () => this.post_id,
      () => {
        this.getPostInfo();
      }
    );
    this.getPostInfo();
    bus.$on('profilAfterUpdate', () => {
      this.getUserImage();
    });
  },
}
</script>

<style lang="scss" scoped src="./updatepost.scss">
</style>