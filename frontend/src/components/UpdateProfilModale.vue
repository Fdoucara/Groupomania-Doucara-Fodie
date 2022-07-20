<template>
  <div class="bloc-modale" v-if="profilModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale-title"> Modifier votre profil
        <hr>
      </h2>
      <div class="modale-content">

        <form>

          <div class="modale-body-content">
            <div class="modale-body-content-image">
              <img :src="userImage" class="modale-image">

              <div class="form-group my-4">
                <input type="file" id="profil_update_image">
                <label for="profil_update_image" class="label_image"> <i class="fas fa-upload"></i> &nbsp; Modifier
                  l'image de profil
                </label>
              </div>
            </div>

            <div class="modale-body-content-name">
              <div class="form-group mt-4 input_group_css">
                <label for="profil_nom" class="mb-2"> Nom : </label>
                <input type="text" id="profil_nom" v-model="nom" class="form-control">
              </div>

              <div class="form-group mt-4 input_group_css">
                <label for="profil_prenom" class="mb-2"> Prenom : </label>
                <input type="text" id="profil_prenom" v-model="prenom" class="form-control">
              </div>
            </div>

            <div class="modify_css form-group my-4">
              <label for="profil_bio" class="mb-2"> Bio : </label>
              <textarea id="profil_bio" v-model="bio" class="from-control"></textarea>
            </div>

            <div class="form-group mt-4">
              <label for="profil_email" class="mb-2"> Votre adresse email : </label>
              <input type="email" id="profil_email" v-model="email" class="form-control">
            </div>
          </div>

          <div class="modale-body-footer">
            <button class="btn btn-color"> <i class="fas fa-check" @click="sendData"></i> &nbsp; Valider </button>
          </div>

        </form>

        <p class="profilmodale_upload"></p>
        <p class="profilModale_error"></p>
      </div>
      <button class="btn-modale btn" @click="toggleProfilModale"> X </button>
    </div>

  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'UpdateProfilModale',
  props: ['profilModale', 'toggleProfilModale'],
  data() {
    return {
       axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/',
      }),
      userImage: null,
      nom: null,
      prenom: null,
      bio: null,
      email: null
    }
  },
  methods: {
    getUserInfo() {
      this.axiosInstance.get('user/' + this.$store.state.userId)
        .then(reponse => {
          console.log(reponse);
          this.userImage = reponse.data.result[0].user_imageUrl;
          this.nom = reponse.data.result[0].nom;
          this.prenom = reponse.data.result[0].prenom;
          this.bio = reponse.data.result[0].bio;
          this.email = reponse.data.result[0].email;
        })
    },
    sendData() {
      
    }
  },
  mounted() {
    this.getUserInfo();
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

form {
  font-size: 18px;
}

.modale {
  background: white;
  color: #333;
  height: 760px;
  width: 700px;
  padding: 20px;
  position: fixed;
  bottom: 8%;
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
}

.modale-body-content-image {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ced4da;
}

img {
  width: 25%;
  height: auto;
  border-radius: 50%;
}

input[type="file"] {
  display: none;
}

.label_image {
  display: block;
  background-color: #203A43;
  color: white;
  font-size: 18px;
  text-align: center;
  padding: 10px 15px;
  border-radius: 5px;
  margin: 0;
  cursor: pointer;
}

.modale-body-content-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input_group_css {
  width: 250px;
}

.modify_css {
  display: flex;
  flex-direction: column;
}

textarea {
  padding: 6px 12px;
  resize: none;
  border: 1px solid #ced4da;
  font-size: 18px;
}

textarea:focus {
  outline: 0;
}

.modale-body-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 20px;
}

button {
  width: 90%;
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
  top: 7px;
  right: 7px;
  background: #203A43;
  width: 10%;
  margin: auto;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 20px;
  color: white;
}
</style>