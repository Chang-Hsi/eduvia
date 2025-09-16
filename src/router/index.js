import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Home from '@/views/Home.vue'
import Search from '@/views/Search.vue'
import Teach from '@/views/Teach.vue'
import Class from '@/views/Class.vue'
import MyLearning from '@/views/MyLearning.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', name: 'home', component: Home },
        { path: 'search', name: 'search', component: Search },
        { path: 'teach', name: 'teach', component: Teach },
        { path: 'class', name: 'class', component: Class },
        { path: 'mylearning', name: 'mylearning', component: MyLearning },
        { path: 'login', name: 'login', component: Login },
        { path: 'signup', name: 'signup', component: Signup },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
