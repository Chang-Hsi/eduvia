import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Home from '@/views/Home.vue'
import Search from '@/views/Search.vue'
import Teach from '@/views/Teach.vue'
import Class from '@/views/Class.vue'
import MyLearning from '@/views/MyLearning.vue'
import Profile from '@/views/Profile.vue'
import Resume from '@/views/Resume.vue'
import ResumeHome from '@/views/resume/ResumeHome.vue'
import ResumeCreate from '@/views/resume/ResumeCreate.vue'
import ResumeDetail from '@/views/resume/ResumeDetail.vue'
import ResumeEdit from '@/views/resume/ResumeEdit.vue'
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
        { path: 'profile', name: 'profile', component: Profile },
        {
          path: 'resume',
          component: Resume,
          children: [
            { path: '', name: 'resumeHome', component: ResumeHome },
            { path: 'create', name: 'resumeCreate', component: ResumeCreate },
            { path: ':id', name: 'resumeDetail', component: ResumeDetail },
            { path: ':id/edit', name: 'resumeEdit', component: ResumeEdit },
          ],
        },
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
