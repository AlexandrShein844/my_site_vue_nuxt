// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   devtools: { enabled: true }
// })
export default {

  devtools: { enabled: true },
  // Роутинг
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
  // Загрузка данных
  axios: {
    baseURL: 'https://api.example.com'
  },
  // Настройки безопасности
  security: {
    csrf: true
  },
  // Заголовок и мета-теги
  head: {
    title: 'Магазин одежды',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  // Стили и скрипты
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans' }
  ],
  script: [
    { src: 'https://code.jquery.com/jquery-3.6.0.min.js' }
  ]
}
