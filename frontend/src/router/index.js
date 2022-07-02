import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginComponent from '@/views/Login.vue'
import RegisterComponent from '@/views/Register.vue'
import AccueilComponent from '@/views/Accueil.vue'
import ProfilComponent from '@/views/Profil.vue'
import CreationPost from '@/views/CreationPost.vue'

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
    path: '/profil',
    component: ProfilComponent
  },
  {
    path: '/creation',
    component: CreationPost
  },
]

const router = new VueRouter({
  routes
})

export default router
