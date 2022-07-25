<template>
  <div class="bloc_modale" v-if="registerModale">

    <div class="overlay"></div>

    <div class="modale card">
      <h2 class="modale_title"> Inscription réussie
        <hr>
      </h2>
      <div class="modale_content">
        <p> Votre compte a bien été créé. </p>
        <button class="btn modale_content_btn" @click="toggleRegisterModale"> Fermer </button>
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
  props: ['registerModale', 'toggleRegisterModale']
}
</script>

<style lang="scss" scoped src="./registermodale.scss">
</style>