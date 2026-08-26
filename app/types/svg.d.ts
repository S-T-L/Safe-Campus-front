declare module '*.svg' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, never>>
  export default component
}

declare module '*.svg?url' {
  const url: string
  export default url
}
