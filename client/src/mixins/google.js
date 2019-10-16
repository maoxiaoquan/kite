import { google } from '@utils'
const googleStartCode = {
  mounted () {
    this.initGoogleCode()
  },
  methods: {
    initGoogleCode () {
      if (this.website && this.website.config) {
        google.injectionGoogleCode(this.website.config.googleCode)
      }
    }
  }
}

export default googleStartCode
