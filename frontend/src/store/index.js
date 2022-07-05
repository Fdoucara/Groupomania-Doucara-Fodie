import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    userId: null,
    roleUser: null
  },
  getters: {
  },
  mutations: {
    UPDATE_USER_ID(state, id) {
      state.userId = id;
    },
    UPDATE_ROLE_USER(state, role) {
      state.roleUser = role;
    },
    REMOVE_USER_ID(state) {
      state.userId = null;
    },
    REMOVE_ROLE_USER(state) {
      state.roleUser = null;
    },
  },
  actions: {
  },
  modules: {
  }
})
