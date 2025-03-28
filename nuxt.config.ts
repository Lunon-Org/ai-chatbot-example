import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
    head: {
      // Set default charset and viewport (important!)
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',

      // Default Title and Title Template
      titleTemplate: 'Lunon | %s', // Example: Page Title - Site Name
      title: 'Lunon | The Magic Box', // Default title if none is set on the page

      // Default Meta Tags (will be overridden by useHead on the page)
      meta: [
        // Provide a fallback description
        { name: 'description', content: 'The Magic Box. An AI Chatbot demo showcasing "lunon.com"\'s features.' },
        { name: "keywords", content: 'Lunon, AI, Chatbot, Magic Box, Demo, Features, AI, chatbot, Severence, Severance-inspired, LLM, Severence, Severance-inspired AI, AI demo, AI chatbot demo, Magic Box demo, Lunon features, lunon.com, AI technology, Artificial Intelligence, Natural Language Processing, Machine Learning, AI applications, AI chatbot applications, AI chatbot features, AI chatbot technology, AI chatbot demo, AI chatbot example, AI chatbot use cases, AI chatbot benefits, AI chatbot for business, AI chatbot for customer service, AI chatbot for sales, AI chatbot for marketing, AI chatbot for lead generation, AI chatbot for support, AI chatbot for engagement, AI chatbot for conversion, AI chatbot for retention, AI chatbot for growth, AI chatbot for innovation, AI chatbot for efficiency, AI chatbot for productivity, AI chatbot for automation, AI chatbot for scalability, AI chatbot for personalization, AI chatbot for user experience, AI chatbot for satisfaction, AI chatbot for feedback, AI chatbot for insights, AI chatbot for data analysis, AI chatbot for reporting' },
        // Add any other site-wide meta tags here
      ],

      // Default Link Tags (e.g., favicons if not handled elsewhere)
      link: [
        {
          rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'
        },
        {
          rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180'
        },
        {
          rel: 'icon', href: '/favicon-96x96.png', type: 'image/png', sizes: '96x96'
        },
        {
          rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml'
        },
        {
          rel: 'manifest', href: '/site.webmanifest'
        }

      ],

      // Default HTML Attributes
      htmlAttrs: {
        lang: 'en' // Default language
      },
    },
  },

  devtools: { enabled: true },
  routeRules: {
    '/api/**': { proxy: 'https://api.lunon.com/**' }
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    'nuxt-svgo'
  ],
  css: [
    "~/assets/css/main.css"
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  }
})