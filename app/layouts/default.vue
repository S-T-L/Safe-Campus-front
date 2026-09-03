<script setup lang="ts">
import SideNav from '~/components/SideNav.vue'

// Menu global : present sur toutes les pages qui utilisent ce layout.
const { themes } = await useThemes()
</script>

<template>
  <div class="layout">
    <SideNav :themes="themes" />
    <slot />
  </div>
</template>
