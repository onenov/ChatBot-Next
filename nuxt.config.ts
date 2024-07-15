// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-03",
  rootDir: "nuxt/",

  future: {
    compatibilityVersion: 4,
  },

  /**
   * Manually disable nuxt telemetry.
   * @see [Nuxt Telemetry](https://github.com/nuxt/telemetry) for more information.
   */
  telemetry: true,
  ssr: false,
  $development: {
    ssr: false,
    devtools: {
      enabled: false,
    },
  },

  $production: {
    ssr: false,
  },

  app: {
    head: {
      title: "Home",
      titleTemplate: "%s | ChatBotNext",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  routeRules: {
    "auth/verify": { ssr: false },
  },

  tailwindcss: {
    cssPath: "@/assets/css/main.css",
  },
  css: ["@/assets/css/style.min.css", "@/assets/css/dark.css"],
  /**
   * @see https://v3.nuxtjs.org/api/configuration/nuxt.config#modules
   */
  extends: ["@nuxt/ui-pro"],
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@pinia/nuxt",
    "dayjs-nuxt",
    "nuxt-security",
    "@nuxtjs/tailwindcss",
  ],

  ui: {
    icons: ["heroicons"],
  },

  image: {
    domains: [import.meta.env.APP_URL || "http://127.0.0.1:8000"],
    alias: {
      api: import.meta.env.APP_URL || "http://127.0.0.1:8000",
    },
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: "unsafe-none",
      crossOriginOpenerPolicy: "same-origin-allow-popups",
      contentSecurityPolicy: {
        "img-src": [
          "'self'",
          "data:",
          "https://*",
          import.meta.env.APP_URL || "http://127.0.0.1:8000",
        ],
      },
    },
  },

  dayjs: {
    locales: ["en", "zh-cn"], // 添加中文支持
    plugins: ["relativeTime", "utc", "timezone"],
    defaultLocale: "zh-cn", // 设置默认语言为中文
    defaultTimezone: "Asia/Shanghai", // 设置默认时区为上海
  },
  plugins: ["~/plugins/fetchSettings.ts"],
  typescript: {
    strict: false,
  },

  /**
   * @see https://v3.nuxtjs.org/guide/features/runtime-config#exposing-runtime-config
   */
  runtimeConfig: {
    apiLocal: import.meta.env.API_LOCAL_URL,
    public: {
      apiBase: import.meta.env.APP_URL,
      apiPrefix: "/api/v1",
      storageBase: import.meta.env.APP_URL + "/storage/",
      providers: {
        google: {
          name: "Google",
          icon: "",
          color: "gray",
        },
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // 单位为 KB
    analyze: true, // 这将打开包分析器
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/workflow"], // 添加需 prerender 的路径
    },
  },
});
