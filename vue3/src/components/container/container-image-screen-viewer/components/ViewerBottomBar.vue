<script setup lang="ts">
import { pbImageDataChooseBySmallestWithUrl } from '@/utils'
import type { ViewerControlDesuwaType } from './dependencise'

const props = defineProps<{
  viewerControlDesuwa: ViewerControlDesuwaType
}>()

const {
  //
  viewerImageList,
  viewerImageData,
  viewerImageSwitch,
  viewerClose,
} = props.viewerControlDesuwa
</script>

<template>
  <div>
    <div
      class="bar-box relative z-[3] flow-root overflow-hidden bg-color-background-soft pb-1"
    >
      <div class="my-2 flex items-center">
        <!-- 图片选择 -->
        <div class="mx-4">
          <div class="flex items-center">
            <div v-for="item in viewerImageList" :key="item.id">
              <div
                class="mx-[4px] cursor-pointer overflow-hidden rounded-[4px]"
                @click="viewerImageSwitch(item.id)"
              >
                <div
                  class="h-[30px] w-[30px] border-2 bg-cover bg-center"
                  :class="{
                    'border-el-primary': item.id === viewerImageData?.id,
                    'border-transparent': item.id !== viewerImageData?.id,
                  }"
                  :style="{
                    backgroundImage: `url(${pbImageDataChooseBySmallestWithUrl(item).url})`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 关闭按钮 -->
        <div class="mr-2">
          <ElButton circle type="info" @click="viewerClose">
            <template #icon>
              <RiCloseFill></RiCloseFill>
            </template>
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bar-box {
  border-radius: 24px 24px 0 0;
  box-shadow:
  // 外阴影
    0 0 6px 6px var(--color-background);
}
</style>
