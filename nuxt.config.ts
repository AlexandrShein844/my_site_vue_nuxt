// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   devtools: { enabled: true }
// })
export default {
  //target: 'static', //для билда
  devtools: { enabled: true },
  // routes: [
  //   {
  //     path: '/main',
  //     component: () => import('@/pages/index.vue')
  //   },
  //   {
  //     path: '/catalog',
  //     component: () => import('@/pages/catalog.vue')
  //   }
  // ],
  axios: {
    baseURL: 'https://api.example.com'
  },
  security: {
    csrf: true
  },
  head: {
    title: 'Магазин одежды',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans' }
  ],
  script: [
    { src: 'https://code.jquery.com/jquery-3.6.0.min.js' }
  ],
  //buildDir: 'dist' // для билда
}
