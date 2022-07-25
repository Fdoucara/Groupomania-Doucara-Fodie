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
      if (!this.formData.selectedFile && this.formData.comment_content != '') {
        this.axiosInstance.patch('post/update-comment/' + this.comment_id, {
          comment_content: this.formData.comment_content
        })
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateCommentList');
              bus.$emit('postAfterUpdate');
              this.formData.comment_content = '';
              this.toggleCommentModale();
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      else if (!this.formData.selectedFile && this.formData.comment_content == '') {
        this.paragrapheError.textContent = "Aucune modification n'a été effectuée.";
        this.paragrapheError.style.fontSize = '20px';
        this.paragrapheError.style.color = 'red';
      }
      else if (this.formData.selectedFile && this.formData.comment_content == '') {
        const fd = new FormData();
        fd.append('image', this.formData.selectedFile, this.filename);
        this.axiosInstance.patch('post/update-comment/' + this.comment_id, fd, this.config)
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateCommentList');
              bus.$emit('postAfterUpdate');
              this.formData.selectedFile = null;
              this.paragraphe.textContent = '';
              this.formData.comment_content = '';
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
              this.formData.selectedFile = null;
              this.paragraphe.textContent = '';
              this.formData.comment_content = '';
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
    bus.$on('profilAfterUpdate', () => {
      this.getUserImage();
    });
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
  background: white;
  color: #333;
  height: 400px;
  width: 550px;
  padding: 20px;
  position: fixed;
  bottom: 30%;
  display: flex;
  justify-content: space-around;
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

.modale-body-content {
  margin: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  margin-right: 10px;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
}

.modale-body-content-text {
  width: 80%;
  height: 90px;
  border: 0;
  padding: 7px;
  background: transparent;
  resize: none;
  font-size: 20px;
}

.modale-body-content-text::placeholder {
  font-size: 22px;
}

.modale-body-content-text:focus {
  outline: 0;
}

.modale-body-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 20px;
}

.modale-body-footer-upload,
.modale-body-footer-send {
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

button {
  width: 100%;
  padding: 10px 0px;
  font-size: 18px;
}

.btn-color {
  background: #D31027;
  color: white;
}

p {
  font-size: 16px;
  text-align: center;
}

.btn-modale {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #203A43;
  width: 10%;
  margin: auto;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 20px;
  color: white;
}
</style>