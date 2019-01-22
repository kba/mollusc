import {mapState, mapActions} from 'vuex'

import { GChart } from 'vue-google-charts'
import {bulmaAccordion} from 'bulma-extensions'

export default {
  name: 'SessionDetails',
  components: {
    GChart
  },
  props: {
    id: {type: String, required: true},
  },
  mounted() {
    this.fetchSessions()
    bulmaAccordion.attach()
  },
  computed: {
    ...mapState(['baseUrl', 'sessions']),
    session() {return this.sessions.find(session => session.id === this.id) || {epochs: []}},
    cerChartData() {return [
      ['Iteration', 'CER'],
      ...this.session.epochs
        .filter((_, idx) => idx < 100)
        .map(([dt, {iteration, error}]) => {
          return [iteration, error]
        })
    ]},
  },
  methods: {
    ...mapActions(['fetchSessions'])
  },
  data() {return {
    cerChartOptions: {
      chart: {
        title: 'CER per iteration',
        vAxis: {
          logScale: true
        }
      }
    }
  }}
}
