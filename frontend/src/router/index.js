import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginComponent from '@/views/Login.vue'
import RegisterComponent from '@/views/Register.vue'
import AccueilComponent from '@/views/Accueil.vue'
import ProfilComponent from '@/views/Profil.vue'
import MyProfilComponent from '@/views/MyProfil.vue'
import OnePost from '@/views/OnePost.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: LoginComponent
  },
  {
    path: '/inscription',
    component: RegisterComponent
  },
  {
    path: '/accueil',
    component: AccueilComponent
  },
  {
    path: '/profil/:id',
    component: ProfilComponent
  },
  {
    path: '/monProfil',
    component: MyProfilComponent
  },
  {
    path: '/post/:id',
    component: OnePost
  }
]

const router = new VueRouter({
  routes
})

export default router
