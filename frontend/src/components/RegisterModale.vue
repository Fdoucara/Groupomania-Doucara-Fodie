<template>
  <div class="bloc-modale" v-if="registerModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale-title"> Inscription réussie <hr></h2>
      <div class="modale-content">
        <p> Votre compte a bien été créé. </p>
        <button class="btn-modale btn" @click="toggleRegisterModale"> Fermer </button>
      </div>  
    </div>

  </div>
</template>

<script>
export default {
  name: 'ModaleComponent',
  data() {
    return {
    }
  },
  methods: {
  },
  props: ['registerModale', 'toggleRegisterModale' ]
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
  background-color: #D31027;
  color: white;
}
</style>