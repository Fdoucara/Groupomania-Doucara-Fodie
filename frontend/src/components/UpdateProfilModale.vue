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

              <div class="modale-content-image-button">
                <div class="form-group my-4">
                  <input type="file" id="profil_update_image" @change="changeFile">
                  <label for="profil_update_image" class="label_image"> <i class="fas fa-upload"></i> &nbsp; Modifier
                    l'image de profil
                  </label>
                </div>
                <p class="profilmodale_upload"></p>
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
            <button class="btn btn-color" @click="sendData"> <i class="fas fa-check"></i> &nbsp; Valider </button>
          </div>

        </form>

        <p class="profilModale_error"></p>
      </div>
      <button class="btn-modale btn" @click="toggleProfilModale"> X </button>
    </div>

  </div>
</template>

<script>

import axios from 'axios'
import { bus } from '../main'

export default {
  name: 'UpdateProfilModale',
  props: ['profilModale', 'toggleProfilModale'],
  data() {
    return {
      axiosInstance: axios.create({
        withCredentials: true,
        baseURL: 'http://localhost:3000/api/',
      }),
      config: {
        headers: { 'Content-Type': 'multipart/form-data' }
      },
      userImage: null,
      nom: null,
      prenom: null,
      bio: null,
      email: null,
      selectedFile: null,
      paragraphe: null,
      paragrapheError: null
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
    changeFile(e) {
      this.selectedFile = e.target.files[0];
      this.filename = e.target.files[0].name;
      this.paragraphe = document.querySelector('.profilmodale_upload');
      if (this.selectedFile) {
        this.paragraphe.textContent = `${this.filename}`;
      } else {
        this.paragraphe.textContent = '';
      }
    },
    sendData() {
      this.paragrapheError = document.querySelector('.profilModale_error');
      if (!this.selectedFile && this.nom != '' && this.prenom != '' && this.email != '') {
        this.axiosInstance.patch('user/update-profil', {
          nom : this.nom,
          prenom : this.prenom,
          bio : this.bio,
          email : this.email,
        })
          .then(reponse => {
            if (reponse.status == 200) {
              console.log(reponse);
              bus.$emit('profilAfterUpdate');
              this.toggleProfilModale();
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      else if (!this.selectedFile && this.nom == '' || this.prenom == '' || this.email == '') {
        console.log('connard')
        this.axiosInstance.patch('user/update-profil', {
          nom : this.nom,
          prenom : this.prenom,
          bio : this.bio,
          email : this.email,
        })
        .then(reponse => {
          console.log(reponse);
        })
        // this.paragrapheError.textContent = "Aucune modification n'a été effectuée.";
        // this.paragrapheError.style.fontSize = '20px';
        // this.paragrapheError.style.color = 'red';
      }
      else {
        const fd = new FormData();
        fd.append('image', this.selectedFile, this.filename);
        fd.append('nom', this.nom);
        fd.append('prenom', this.prenom);
        fd.append('bio', this.bio);
        fd.append('email', this.email);
        this.axiosInstance.patch('user/update-profil', fd, this.config)
          .then(reponse => {
            if (reponse.status == 200) {
              console.log(reponse);
              bus.$emit('profilAfterUpdate');
              this.selectedFile = null;
              this.paragraphe.textContent = '';
              this.paragrapheError.textContent = '';
              this.toggleProfilModale();
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
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

.modale-content-image-button {
  width: 60%;
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