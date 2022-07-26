<template>
  <div class="bloc_modale" v-if="profilModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale_title"> Modifier votre profil
        <hr>
      </h2>
      <div class="modale_content">
        <form>
          <div class="modale_content_body">
            <div class="modale_content_body_image">
              <img :src="userImage" class="modale_content_body_image_img">

              <div class="modale_content_body_image_button">
                <div class="form-group my-4">
                  <input type="file" id="profil_update_image" class="modale_content_body_image_button_input"
                    @change="changeFile">
                  <label for="profil_update_image" class="modale_content_body_image_button_label"> <i
                      class="fas fa-upload"></i> &nbsp; Modifier
                    l'image de profil
                  </label>
                </div>
                <p class="modale_content_body_image_button_upload"></p>
              </div>
            </div>

            <div class="modale_content_body_name">
              <div class="form-group mt-4 modale_content_body_name_group">
                <label for="profil_nom" class="mb-2"> Nom : </label>
                <input type="text" id="profil_nom" v-model="nom" class="form-control">
              </div>

              <div class="form-group mt-4 modale_content_body_name_group">
                <label for="profil_prenom" class="mb-2"> Prenom : </label>
                <input type="text" id="profil_prenom" v-model="prenom" class="form-control">
              </div>
            </div>

            <div class="form-group my-4 modale_content_body_modify">
              <label for="profil_bio" class="mb-2"> Bio : </label>
              <textarea id="profil_bio" v-model="bio"
                class="from-control modale_content_body_modify_textarea"></textarea>
            </div>

            <div class="form-group mt-4">
              <label for="profil_email" class="mb-2"> Votre adresse email : </label>
              <input type="email" id="profil_email" v-model="email" class="form-control" required>
            </div>
          </div>

          <div class="modale_content_footer">
            <button class="btn modale_content_footer_button" @click="sendData"> <i class="fas fa-check"></i> &nbsp;
              Valider </button>
          </div>

        </form>

        <p class="modale_content_error"></p>
      </div>
      <button class="btn modale_btn" @click="toggleProfilModale"> X </button>
    </div>

  </div>
</template>

<script>

import axios from 'axios'
import { bus } from '../../main'

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
      this.paragraphe = document.querySelector('.modale_content_body_image_button_upload');
      if (this.selectedFile) {
        this.paragraphe.textContent = `${this.filename}`;
      } else {
        this.paragraphe.textContent = '';
      }
    },
    sendData() {
      this.paragrapheError = document.querySelector('.modale_content_error');
      if (!this.selectedFile && this.nom != '' && this.prenom != '' && this.email != '') {
        this.axiosInstance.patch('user/update-profil', {
          nom: this.nom,
          prenom: this.prenom,
          bio: this.bio,
          email: this.email,
        })
          .then(reponse => {
            if (reponse.status == 201) {
              bus.$emit('profilAfterUpdate');
              this.toggleProfilModale();
              this.getUserInfo();
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      else if (!this.selectedFile && this.nom == '' || this.prenom == '' || this.email == '') {
        this.axiosInstance.patch('user/update-profil', {
          nom: this.nom,
          prenom: this.prenom,
          bio: this.bio,
          email: this.email,
        })
          .catch((error) => {
            console.log({ error });
            this.paragrapheError.textContent = error.response.data.message;
            this.paragrapheError.style.textAlign = 'center'
            this.paragrapheError.style.fontSize = '16px';
            this.paragrapheError.style.paddingBottom = '10px'
            this.paragrapheError.style.color = 'red';
          })
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
            if (reponse.status == 201) {
              bus.$emit('profilAfterUpdate');
              this.selectedFile = null;
              this.paragraphe.textContent = '';
              this.paragrapheError.textContent = '';
              this.toggleProfilModale();
              this.getUserInfo();
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

<style lang="scss" scoped src="./updateprofil.scss">
</style>