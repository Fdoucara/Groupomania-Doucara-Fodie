<template>

<div class="contain">
  <div class="form">
    <form>
      <h3> Vous voulez publier ? Rédigez un post. </h3>

      <div class="form-group my-5">
        <label for="content" class="mb-2"> Contenu du post : </label>
        <textarea id="content" class="form-control" v-model="formData.post_content" ></textarea>
      </div>

      <div class="form-group mt-4">
        <label for="imageUrl" class="mb-2"> Ajouter une image : </label>
        <input type="file" id="imageUrl" class="form-control" accept=".jpg, .jpeg, .png, .gif" @change="valueInput">
      </div>

      <button class="btn btn-primary mt-5" @click.prevent="sendData"> Publier </button>
    </form>
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
        post_imageUrl: undefined,
      },
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/'
      }),
      info: null
    }
  },
  methods: {
    valueInput(e){
      console.log(e.target.files[0].name);
      this.post_imageUrl = e.target.files[0].name;
      // this.post_imageUrl = document.getElementById('post_imageUrl').value;
      // console.log(this.post_imageUrl);
    },
      sendData() {
      // this.axiosInstance.post('post/create', {
      //   post_content: this.formData.post_content,
      //   post_imageUrl: this.formData.post_imageUrl
      // })
      //   .then(reponse => {         
      //     if (reponse.status == 200) {
      //       console.log(reponse)
      //       this.$router.push('/accueil');
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   })
      console.log(this.formData);
    },
  }
}
</script>

<style scoped>

.contain {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  right: 10%;
  background: white;
  width: 500px;
  height: 550px;
  padding: 40px;
  border-radius: 20px;
  margin-top: 150px;
}

h2 {
  text-align: left;
}

.form-group {
  text-align: left;
}

</style>