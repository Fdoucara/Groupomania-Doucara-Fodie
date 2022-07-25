<template>

  <div>
    <div class="card">
      <div class="card-body">
        <div class="card-body-header">
          <h1 class="card-body-header-text text1"> Accueil </h1>
          <i class="fab fa-angellist card-body-header-text"></i>
        </div>
        <form>
          <div class="card-body-content">
            <img :src="userImage" class="card-image">
            <textarea class="card-body-content-text" id="content" v-model="formData.post_content"
              placeholder="Que voulez-vous nous raconter aujourd'hui ?" @keyup="verifWrite"></textarea>
          </div>

          <div class="card-body-footer">
            <div class="card-body-footer-upload">
              <input type="file" id="image" @change="onFileSelected">
              <label for="image"> <i class="fas fa-upload"></i> &nbsp; Ajouter une image </label>
            </div>
            <div class="card-body-footer-send">
              <button class="btn btn-color" @click="sendData"> <i class="fas fa-paper-plane"></i> &nbsp; Publier
              </button>
            </div>
          </div>
        </form>
        <p class="upload-image-name mt-3"></p>
        <p class="error"></p>
      </div>
    </div>
  </div>

</template>


<script>

import axios from 'axios'
import { bus } from '../../main'

export default {
  name: 'CreationPost',
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
    onFileSelected(event) {
      this.formData.selectedFile = event.target.files[0];
      this.filename = event.target.files[0].name;
      this.paragraphe = document.querySelector('.upload-image-name');
      if (this.formData.selectedFile) {
        this.paragraphe.textContent = `${this.filename}`;
      } else {
        this.paragraphe.textContent = '';
      }
    },
    verifWrite() {
      this.paragrapheError = document.querySelector('.error');
      this.paragrapheError.textContent = '';
    },
    sendData() {
      this.paragrapheError = document.querySelector('.error');
      if (!this.formData.selectedFile && this.formData.post_content != '') {
        this.axiosInstance.post('post/create', {
          post_content: this.formData.post_content
        })
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateList');
              bus.$emit('takeProfil');
              this.formData.post_content = '';
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      else if (!this.formData.selectedFile && this.formData.post_content == '') {
        this.paragrapheError.textContent = 'Vous devez impérativement rédiger du texte ou ajouter une image !';
        this.paragrapheError.style.fontSize = '18px';
        this.paragrapheError.style.color = 'red';
      }
      else if (this.formData.selectedFile && this.formData.post_content == '') {
        const fd = new FormData();
        fd.append('image', this.formData.selectedFile, this.filename);
        this.axiosInstance.post('post/create', fd, this.config)
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateList');
              bus.$emit('takeProfil');
              this.formData.selectedFile = null;
              this.paragraphe.textContent = '';
              this.formData.post_content = '';
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
        fd.append('post_content', this.formData.post_content);
        this.axiosInstance.post('post/create', fd, this.config)
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateList');
              bus.$emit('takeProfil');
              this.formData.selectedFile = null;
              this.paragraphe.textContent = '';
              this.formData.post_content = '';
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
  },
}
</script>

<style lang="scss" scoped src="./createpost.scss"></style>