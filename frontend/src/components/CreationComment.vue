<template>

  <div>
    <div class="card mt-1">
      <div class="card-body">
        <form>
          <div class="card-body-content">
            <img src="../assets/icon-above-font.png" class="card-image">
            <textarea class="card-body-content-text" id="comment_content" v-model="formData.comment_content"
              placeholder="Rédiger votre commentaire ici..." @keyup="verifWrite"></textarea>
          </div>

          <div class="card-body-footer">
            <div class="card-body-footer-upload">
              <input type="file" id="comment_image" @change="onFile">
              <label for="comment_image"> <i class="fas fa-upload"></i> &nbsp; Ajouter une image </label>
            </div>
            <div class="card-body-footer-send">
              <button class="btn btn-color" @click="sendData"> <i class="fas fa-paper-plane"></i> &nbsp; Envoyer
              </button>
            </div>
          </div>
        </form>
        <p class="comment_upload-image-name mt-3"></p>
        <p class="comment_error"></p>
      </div>
    </div>
  </div>

</template>


<script>

import { bus } from '../main'
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
      paragrapheError: undefined
    }
  },
  methods: {
    onFile(event) {
      this.formData.selectedFile = event.target.files[0];
      this.filename = event.target.files[0].name;
      this.paragraphe = document.querySelector('.comment_upload-image-name');
      if (this.formData.selectedFile) {
        this.paragraphe.textContent = `${this.filename}`;
      } else {
        this.paragraphe.textContent = '';
      }
    },
    verifWrite() {
      this.paragrapheError = document.querySelector('.comment_error');
      this.paragrapheError.textContent = '';
    },
    sendData() {
      this.paragrapheError = document.querySelector('.comment_error');
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
        this.paragrapheError.style.fontSize = '18px';
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
}
</script>

<style scoped>
.card {
  width: 43%;
  margin: auto;
  border: 0;
  border-radius: 0px 0px 15px 15px;
  background: white;
}

.card-body {
  width: 100%;
}

.card-body-content {
  margin: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  width: 13%;
  height: auto;
  border-radius: 50%;
}

.card-body-content-text {
  width: 80%;
  height: 90px;
  border: 0;
  padding: 7px;
  background: transparent;
  resize: none;
  font-size: 22px;
}

.card-body-content-text::placeholder {
  font-size: 22px;
}

.card-body-content-text:focus {
  outline: 0;
}

.card-body-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 10px;
  font-size: 22px;
}

.card-body-footer-upload,
.card-body-footer-send {
  width: 40%;
}

input[type="file"] {
  display: none;
}

label {
  display: block;
  background-color: #203A43;
  color: white;
  font-size: 20px;
  text-align: center;
  padding: 10px 0px;
  border-radius: 5px;
  margin: 0;
  cursor: pointer;
}

button {
  width: 100%;
  padding: 10px 0px;
  font-size: 20px;
}

.btn-color {
  background: #D31027;
  color: white;
}
</style>