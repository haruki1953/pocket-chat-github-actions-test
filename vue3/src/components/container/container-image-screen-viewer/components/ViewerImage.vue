<script setup lang="ts">
import { useImage } from '@vueuse/core'

const props = defineProps<{
  imageSrc: string
}>()

const refImgEl = ref<HTMLImageElement | null>(null)
const { isLoading: isImageLoading } = useImage(() => {
  return {
    src: props.imageSrc,
  }
})

defineExpose({
  isImageLoading,
})
</script>

<template>
  <img
    ref="refImgEl"
    :src="imageSrc"
    class="h-full w-full select-none object-cover object-center"
    draggable="false"
  />
</template>

<style lang="scss" scoped></style>
