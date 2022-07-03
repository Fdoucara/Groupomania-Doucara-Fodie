<template>

  <div>
    <div class="card">
      <div class="card-body">
        <div class="card-body-header">
          <i class="fab fa-angellist card-body-header-text"></i>
        </div>  
        <form>
          <div class="card-body-content">
            <img src="../assets/icon-above-font.png" class="card-image">
            <textarea class="card-body-content-text" id="content" v-model="formData.post_content" placeholder="Que voulez-vous nous raconter aujourd'hui ?" required></textarea>
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
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      filename: ''
    }
  },
  methods: {
    onFileSelected(event) {
      this.formData.selectedFile = event.target.files[0],
      this.filename = event.target.files[0].name
    },
    sendData() {
      const fd = new FormData();
      fd.append('image', this.formData.selectedFile, this.filename)
      fd.append('post_content', this.formData.post_content)

      this.axiosInstance.post('post/create', fd)
        .then(reponse => {
          if (reponse.status == 200) {
            console.log(reponse)
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
  }
}
</script>

<style scoped>
 .card {
   width: 40%;
   margin: auto;
   padding-top: 5px;
   border-radius: 0px;
   background: #C9D6FF;
   /* fallback for old browsers */
   background: -webkit-linear-gradient(to right, #E2E2E2, #C9D6FF);
   /* Chrome 10-25, Safari 5.1-6 */
   background: linear-gradient(to right, #E2E2E2, #C9D6FF);
   /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
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
   font-size: 35px;
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