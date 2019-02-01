import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: 'http://10.46.3.57:3434',
    gtBags: [],
    sessions: []
  },
  mutations: {
    SET_SESSION_LIST(state, sessions) {
      state.sessions = [...sessions]
    },
    SET_GT_BAGS(state, gtBags) {
      state.gtBags = [...gtBags]
    }
  },
  actions: {
    fetchSessions({state, commit}) {
      const {baseUrl} = state
      fetch(`${baseUrl}/session/?full=1`)
        .then(resp => resp.json())
        .then(sessions => commit('SET_SESSION_LIST', sessions))
    },
    fetchGtBags({state, commit}) {
      const {baseUrl} = state
      fetch(`${baseUrl}/gt`)
        .then(resp => resp.json())
        .then(sessions => commit('SET_GT_BAGS', sessions))
    }
  }
})
