import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import SessionsView from './views/SessionsView.vue'
import SessionDetails from './views/SessionDetails.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', name: 'home', component: Home},
    {path: '/sessions', name: 'sessions', component: SessionsView},
    {path: '/session/:id', name: 'session-details', component: SessionDetails, props: true}
  ]
})
