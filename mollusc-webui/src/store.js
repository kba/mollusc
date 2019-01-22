import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: 'http://10.46.3.57:3434',
    sessions: []
  },
  mutations: {
    SET_SESSIONS(state, sessions) {
      state.sessions = [...sessions]
    }
  },
  actions: {
    fetchSessions({state, commit}) {
      const {baseUrl} = state
      fetch(`${baseUrl}/session/?full=1`)
        .then(resp => resp.json())
        .then(sessions => commit('SET_SESSIONS', sessions))
    }
  }
})
