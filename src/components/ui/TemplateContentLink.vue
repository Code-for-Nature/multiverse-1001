<script setup lang="ts">

const props = defineProps<{
  templateName: string
  slug: string
}>();

const viewName = props.templateName.toLowerCase();

</script>

<template>
  <RouterLink
    :to="{
      name: viewName,
      params: { slug: props.slug }
    }"
    class="card bg-translucent-light padding-medium"
  >
    <slot />
  </RouterLink>
</template>

<style scoped>
  .card {
    box-shadow: var(--box-shadow);
    width: 100%;
  }
</style>