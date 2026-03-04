<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'SvgIcon',
})
const {
  name,
  prefix = 'icon',
  size,
  color,
} = defineProps<{
  prefix?: string
  name?: string
  color?: string
  size?: number
}>()
const symbolId = computed(() => `#${prefix}-${name}`)
</script>

<template>
  <svg aria-hidden="true" class="svg-icon" :style="{ fontSize: `${size}px` }" v-bind="$attrs">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<style scoped lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
