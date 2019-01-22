import {mapActions, mapState} from 'vuex'
export default {
  computed: {
    ...mapState(['baseUrl', 'sessions'])
  },
  mounted() {
    this.fetchSessions()
  },
  methods: {
    ...mapActions(['fetchSessions'])
  }
}
