<template>

  <div>
    <div class="card">
      <div class="card-body">
        <div class="card-body-header">
          <h1 class="card-body-header-text text1"> Ajout d'un commentaire </h1>
          <i class="fab fa-angellist card-body-header-text"></i>
        </div>
        <form>
          <div class="card-body-content">
            <img src="../assets/icon-above-font.png" class="card-image">
            <textarea class="card-body-content-text" id="comment_content" v-model="formData.comment_content"
              placeholder="Que voulez-vous nous raconter aujourd'hui ?" @keyup="verifWrite" required></textarea>
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
        <p class="comment_upload-image-name"></p>
        <p class="comment_error"></p>
      </div>
    </div>
  </div>

</template>


<script>

import {bus} from '../main'
import axios from 'axios'

export default {
  name: 'CreationComment',
  props: ['post_id'],
  data() {
    return {
      formData: {
        comment_content: null,
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
      if(this.formData.selectedFile) {
        this.paragraphe.textContent = `${this.filename}`;
      } else {
        this.paragraphe.textContent = '';
      }
    },
    verifWrite(){
      this.paragrapheError = document.querySelector('.comment_error');
      this.paragrapheError.textContent = '';
    },
    sendData() {
      if (!this.formData.selectedFile) {
        this.axiosInstance.post('post/create-comment/' + this.post_id, {
          comment_content: this.formData.comment_content
        })
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updatePostInfo');
              bus.$emit('updateCommentList');
              this.formData.comment_content = null;
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      else if (this.formData.comment_content == null || this.formData.comment_content == '') {
        const fb = new FormData();
        fb.append('image', this.formData.selectedFile, this.filename);
        this.axiosInstance.post('post/create-comment/' + this.post_id, fb, this.config)
          .catch(() => {
            this.paragrapheError.textContent = 'Vous devez impérativement rédiger du texte !';
            this.paragrapheError.style.fontSize = '18px';
            this.paragrapheError.style.color = 'red';
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
              this.formData.comment_content = null;
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
    console.log(this.post_id);
  },
}
</script>

<style scoped>
.card {
  width: 43%;
  margin: auto;
  padding-top: 15px;
  border: 0;
  border-radius: 0px 0px 15px 15px;
  background: white;
}

.card-body {
  width: 100%;
  margin: auto;
}

.card-body-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  margin: auto;
}

.card-body-header-text {
  margin-bottom: 5px;
  font-size: 40px;
}

.text1 {
  font-size: 25px;
  font-weight: bold;
}

.card-text {
  text-align: left;
  font-size: 22px;
  margin: 0;
  padding-top: 25px;
  padding-bottom: 25px;
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
  font-size: 20px;
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
  padding-top: 20px;
  padding-bottom: 25px;
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