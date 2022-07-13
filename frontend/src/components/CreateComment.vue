<template>
  <div class="bloc-modale" v-if="commentModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale-title"> Ajouter un commentaire
        <hr>
      </h2>
      <div class="modale-content">
        <form>
          <div class="card-body-content">
            <textarea class="card-body-content-text" id="comment_content" v-model="formData.comment_content"
              placeholder="Que voulez-vous commenter ?" @keyup="verifCommentWrite" required></textarea>
          </div>

          <div class="card-body-footer">
            <div class="card-body-footer-upload">
              <input type="file" id="comment_image" @change="onFileSelect">
              <label for="comment_image"> <i class="fas fa-upload"></i> &nbsp; Ajouter une image </label>
            </div>
            <div class="card-body-footer-send">
              <button class="btn btn-color"> <i class="fas fa-paper-plane"></i> &nbsp; Valider
              </button>
            </div>
          </div>
        </form>
        <p class="comment_upload-image-name"></p>
        <p class="comment_error"></p>
      </div>
      <button class="btn btn-float" @click="toggleCommentModale"> X </button>
    </div>

  </div>
</template>

<script>

import axios from 'axios'
// import {bus} from '../main'

export default {
  name: 'CreateComment',
  props: ['commentModale', 'toggleCommentModale'],
  data() {
    return {
      formData: {
        comment_content: null,
        selectedFile: null
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
    onFileSelect(event) {
      this.formData.selectedFile = event.target.files[0];
      this.filename = event.target.files[0].name;
      this.paragraphe = document.querySelector('.comment_upload-image-name');
      if (this.formData.selectedFile) {
        this.paragraphe.textContent = `${this.filename}`;
      } else {
        this.paragraphe.textContent = '';
      }
    },
    verifCommentWrite() {
      this.paragrapheError = document.querySelector('.comment_error');
      this.paragrapheError.textContent = '';
    },
    sendData() {
      if (!this.formData.selectedFile) {
        this.axiosInstance.post('post/create-comment/', {
          post_content: this.formData.post_content
        })
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateList');
              // bus.$emit('takeProfil');
              this.formData.post_content = null;
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      else if (this.formData.post_content == null || this.formData.post_content == '') {
        const fb = new FormData();
        fb.append('image', this.formData.selectedFile, this.filename);
        this.axiosInstance.post('post/create-comment/', fb, this.config)
          .catch(() => {
            this.paragrapheError.textContent = 'Vous devez impérativement rédiger du texte !';
            this.paragrapheError.style.fontSize = '18px';
            this.paragrapheError.style.color = 'red';
          })
      }
      else {
        const fd = new FormData();
        fd.append('image', this.formData.selectedFile, this.filename);
        fd.append('post_content', this.formData.post_content);
        this.axiosInstance.post('post/create-comment/', fd, this.config)
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateList');
              // bus.$emit('takeProfil');
              this.formData.selectedFile = null;
              this.paragraphe.textContent = '';
              this.formData.post_content = null;
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
.bloc-modale {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modale {
  background: #f1f1f1;
  color: #333;
  height: 400px;
  width: 550px;
  padding: 20px;
  position: fixed;
  bottom: 30%;
  display: flex;
  justify-content: space-around;
  border-radius: 10px;
}

.modale-title {
  font-size: 25px;
  text-align: left;
}

.modale-content {
  font-size: 20px;
  text-align: left;
  position: relative;
}

.card-body-content {
  margin: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  padding-bottom: 15px;
  font-size: 20px;
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
  font-size: 18px;
  text-align: center;
  padding: 10px 0px;
  border-radius: 5px;
  margin: 0;
  cursor: pointer;
}

.btn-color {
  width: 100%;
  padding: 10px 0px;
  font-size: 18px;
  background: #D31027;
  color: white;
}

.btn-float {
  background: #203A43;
  position: absolute;
  top: 3px;
  right: 3px;
  color: white;
  border-radius: 6px;
}

p {
  text-align: center;
  font-size: center;
  margin-bottom: 0;
  font-size: 15px;
}
</style>