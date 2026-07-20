<script setup lang="ts">
const props = defineProps<{
  text: string,
  size?: 'small' | 'medium' | 'big',
  type?: 'default' | 'success' | 'danger' | 'error'
  bgColor?: string,
  textColor?: string,
  hoverBgColor?: string,
}>();

const sizeClass =
  props.size === 'small'
    ? 'small'
    : props.size === 'big'
    ? 'big'
    : 'medium';

const typeClass =
  props.type === 'success'
    ? 'btn-success'
    : props.type === 'danger' || props.type === 'error'
    ? 'btn-danger'
    : 'btn-default';

const colorStyle = {
  '--pill-bg': props.bgColor,
  '--pill-hover-bg': props.hoverBgColor,
  '--pill-color': props.textColor,
};
</script>

<template>
  <div
    :class="['pill-link', sizeClass, typeClass, 'bg-translucent-light']"
    :style="colorStyle"
  >
    <slot name="left" />
    <div v-html="text" class="button-text" />
    <slot name="right" />
  </div>
</template>

<style scoped>
.pill-link {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  padding: 8px 20px;
  border-radius: 5em;
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: var(--pill-bg);
  color: var(--pill-color);
}

.pill-link:hover {
  background-color: var(--pill-hover-bg, var(--pill-bg));
}

/* Types — define default CSS vars consumed by .pill-link */
.btn-default {
  --pill-bg: var(--color-white-translucent);
  --pill-color: #222;
}
.btn-success {
  --pill-bg: var(--color-success);
  --pill-color: #fff;
}
.btn-danger {
  --pill-bg: var(--color-error);
  --pill-color: #fff;
}

/* Sizes */
.pill-link.small {
  font-size: 12px;
  padding: 4px 12px;
}

.pill-link.medium {
  font-size: 12px;
  padding: 8px 20px;
}

.pill-link.big {
  font-size: 18px;
  padding: 14px 32px;
}

.button-text {
  text-decoration: none;
  color: inherit;
  font-family: var(--font-family-colorbutton);
  font-weight: 700;
}

@media (min-width: 365px) {
  .pill-link.small {
    font-size: 13px;
    padding: 7px 16px;
  }
  .pill-link.medium {
    font-size: 14px;
    padding: 10px 24px;
  }
  .pill-link.big {
    font-size: 20px;
    padding: 18px 40px;
  }
}
</style>
