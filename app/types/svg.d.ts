declare module '*.svg' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, never>>
  export default component
}
