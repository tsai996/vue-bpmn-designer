/// <reference types="vite/client" />

export {}

declare global {
  interface ImportMetaEnv {
    readonly BASE_URL: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $tu: (source: string, english?: string) => string
  }
}
