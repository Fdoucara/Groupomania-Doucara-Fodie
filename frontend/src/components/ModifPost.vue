<template>
  <div>

    <div class="bloc-modale" v-if="registerModale">
      <div class="overlay"></div>

      <div class="modale card">
        <h2 class="modale-title"> Modification du post
          <hr>
        </h2>
        <div class="modale-content">
          <form>
            <div class="form-group my-4">
              <label for="nom" class="mb-2"> Contenu du post : </label>
              <input type="text" id="nom" class="form-control" v-model="formData.nom">
            </div>

            <div class="form-group my-4">
              <label for="prenom" class="mb-2"> : </label>
              <input type="text" id="prenom" class="form-control" v-model="formData.prenom">
            </div>

            <div class="card-body-footer-upload">
              <input type="file" id="image" @change="onFileSelected">
              <label for="image"> <i class="fas fa-upload"></i> &nbsp; Ajouter une image </label>
            </div>
            <div class="card-body-footer-send">
    <button class="btn-modale btn btn-secondary" @click="toggleRegisterModale"> Valider les modifications
          </button>
          <button class="btn-modale btn btn-secondary" @click="toggleRegisterModale"> Annuler </button>
          </form>
          <p> Le post a bien été modifié. </p>
          <button class="btn-modale btn btn-secondary" @click="toggleRegisterModale"> Valider les modifications
          </button>
          <button class="btn-modale btn btn-secondary" @click="toggleRegisterModale"> Annuler </button>
        </div>
      </div>
    </div>

    <div class="bloc-modale" v-if="registerModale">
      <div class="overlay"></div>

      <div class="modale card">
        <h2 class="modale-title"> Modification réussie
          <hr>
        </h2>
        <div class="modale-content">
          <p> Le post a bien été modifié. </p>
          <button class="btn-modale btn btn-secondary" @click="toggleRegisterModale"> Fermer </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModifPost',
  data() {
    return {
    }
  },
  methods: {
  },
  props: ['registerModale', 'loginModale', 'toggleRegisterModale', 'toggleLoginModale']
}
</script>

<style>
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
  height: 250px;
  width: 500px;
  padding: 20px;
  position: fixed;
  bottom: 40%;
  display: flex;
  justify-content: space-around;
}

.modale-title {
  font-size: 30px;
  text-align: left;
}

.modale-content {
  font-size: 20px;
  text-align: left;
  position: relative;
}

.btn-modale {
  width: 40%;
  margin: auto;
  margin-top: 0;
  margin-bottom: 0;
}
</style>