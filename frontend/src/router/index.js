import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import LoginComponent from '@/views/Login/Login.vue'
import RegisterComponent from '@/views/Register/Register.vue'
import AccueilComponent from '@/views/Accueil/Accueil.vue'
import MyProfilComponent from '@/views/MyProfil/MyProfil.vue'
import ProfilComponent from '@/views/Profil/Profil.vue'
import OnePost from '@/views/OnePost/OnePost.vue'
import UsersList from '@/views/UsersList/UsersList.vue'
import PageError from '@/views/Page404/Page404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: {
      name: 'connexion'
    }
  },
  {
    path: '/connexion',
    name: 'connexion',
    component: LoginComponent
  },
  {
    path: '/inscription',
    name: 'inscription',
    component: RegisterComponent
  },
  {
    path: '/accueil',
    name: 'accueil',
    component: AccueilComponent,
    beforeEnter: (to, from, next) => {
      if(store.state.connected == true) {
        next();
      }
      else {
        next(false);
      }
    }
  },
  {
    path: '/my-profil/:id',
    name: 'mon-profil',
    component: MyProfilComponent,
    beforeEnter: (to, from, next) => {
      if(store.state.connected == true) {
        next();
      }
      else {
        next(false);
      }
    }
  },
  {
    path: '/profil/:id',
    name: 'utilisateur-profil',
    component: ProfilComponent,
    beforeEnter: (to, from, next) => {
      if(store.state.connected == true) {
        next();
      }
      else {
        next(false);
      }
    }
  },
  {
    path: '/post/:id',
    name: 'utilisateur-post',
    component: OnePost,
    beforeEnter: (to, from, next) => {
      if(store.state.connected == true) {
        next();
      }
      else {
        next(false);
      }
    }
  },
  {
    path: '/utilisateurs',
    name: 'utilisateurs',
    component: UsersList,
    beforeEnter: (to, from, next) => {
      if(store.state.connected == true) {
        next();
      }
      else {
        next(false);
      }
    }
  },
  {
    path: '*',
    name: 'page404',
    component: PageError
  },
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router
