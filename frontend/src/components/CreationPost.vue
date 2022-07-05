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
            <img src="../assets/icon-above-font.png" class="card-image">
            <textarea class="card-body-content-text" id="content" v-model="formData.post_content"
              placeholder="Que voulez-vous nous raconter aujourd'hui ?" required></textarea>
          </div>

          <div class="card-body-footer">
            <input type="file" id="image" @change="onFileSelected">
            <div class="btn btn-primary" @click="sendData"> Publier </div>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>


<script>

import axios from 'axios'

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
      filename: ''
    }
  },
  methods: {
    onFileSelected(event) {
      this.formData.selectedFile = event.target.files[0],
        this.filename = event.target.files[0].name
    },
    sendData() {
      if (!this.formData.selectedFile) {
        this.axiosInstance.post('post/create', {
          post_content: this.formData.post_content
        })
          .then(reponse => {
            if (reponse.status == 201) {
              this.$emit('updateList')
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
              this.$emit('updateList')
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
    },
  }
}
</script>

<style scoped>
.card {
  width: 40%;
  margin: auto;
  padding-top: 5px;
  border: 0;
  border-radius: 0px;
  background: #C9D6FF;
}

.card-body {
  width: 100%;
  margin: auto;
}

.card-body-header {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid gray;
}

.card-body-header-text {
  margin-bottom: 10px;
  font-size: 40px;
}
.text1 {
  font-size: 30px;
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
}

.card-body-content-text::placeholder {
  font-size: 22px;
}

.card-body-content-text:focus {
  outline: 0;
}

.card-body-footer {
  display: flex;
  justify-content: space-evenly;
  border-top: 1px solid grey;
  padding-top: 20px;
  font-size: 22px;
}
</style>