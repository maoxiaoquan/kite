import { google } from '@utils'
const googleStartCode = {
  mounted () {
    console.log(1111111111)
    this.initGoogleCode()
  },
  // watch: {
  //   $route (to, from) {
  //     this.initGoogleCode()
  //   }
  // },
  // beforeRouteUpdate (to, from, next) {
  //   this.initGoogleCode()
  //   next()
  // },
  methods: {
    initGoogleCode () {
      if (this.website && this.website.config) {
        console.log(22222222)
        google.injectionGoogleCode(this.website.config.googleCode)
      }
    }
  }
}

export default googleStartCode
