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

<style lang="scss" scoped src="./registermodale.scss"></style>