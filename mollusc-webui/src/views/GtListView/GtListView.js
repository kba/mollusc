import {mapActions, mapState} from 'vuex'

export default {
  name: 'GtListView',
  components: {},
  computed: {
    ...mapState(['baseUrl', 'gtBags'])
  },
  mounted() {
    this.fetchGtBags()
  },
  methods: {
    ...mapActions(['fetchGtBags'])
  }
}
