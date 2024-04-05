import SentryPlugin from '@sentry/webpack-plugin'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    TRACCAR_SERVER: process.env.TRACCAR_SERVER
  },
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Fleetmap ETA ' + process.env.npm_package_version,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'mapbox-gl/dist/mapbox-gl.css', '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  plugins: [
    '~/plugins/fontawesome.js',
    '~/plugins/sentry.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/i18n',
    '@nuxtjs/proxy'
  ],
  i18n: {
    locales: ['pt', 'es'],
    defaultLocale: 'es',
    vueI18n: {
      messages: {
        pt: {
          Obscuro: 'Escuro',
          Calles: 'Ruas'
        }
      }
    }
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: '/api',
    credentials: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config, { isDev }) {
      if (!isDev) {
        config.devtool = 'source-map'
        config.plugins.push(new SentryPlugin({
          org: 'pinme-97',
          project: 'fleetmap',
          release: process.env.npm_package_version
        }))
      }
    }
  },
  proxy: [[
    '/api', 'http://traccar-eu.fleetmap.pt'
  ]]
}
