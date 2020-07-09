
const axios = require('axios')
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || 'Nuxt Blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans&display=swap'}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fa923f', duration: 5000 },
  loadingIndicator: {
    name: 'circle',
    color: '#fa923f'
  }, 
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/core-components.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  env: {
    fbAPIKey: 'AIzaSyDE3lm97Fa4bRHWBECWAPX3DiEAgP-s8Ls'
  },
  generate: {
    routes: function() {
      return axios.get('https://learn-nuxt-kj.firebaseio.com/posts.json')
      .then(res => {
        const routes = []
        for (const key in res.data) {
          routes.push({
            route: '/posts/'+key,
            payload: {postData: res.data[key]}
          })
        }
        return routes
      })
    }
  }
}
