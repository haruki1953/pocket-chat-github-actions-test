<script setup lang="ts">
import { UserInfoAndLinkButton } from './components'
import type { ImageInfoQueryDesuwaType } from './dependencies'

const props = defineProps<{
  imageInfoQueryDesuwa: ImageInfoQueryDesuwaType
}>()

const {
  //
  imagesGetOneQuery,
  imageInfoQueryStatus,
} = props.imageInfoQueryDesuwa
</script>

<template>
  <div>
    <!-- 用户信息 与 图片链接按钮 -->
    <!-- UserInfoAndLinkButton -->
    <div>
      <UserInfoAndLinkButton
        :imageInfoQueryDesuwa="imageInfoQueryDesuwa"
      ></UserInfoAndLinkButton>
    </div>
    <!-- 操作面板 -->
    <div>
      <!-- 修改alt -->
      <!-- 修改关键词 -->
      <!-- 图片为当前用户的时为修改，非当前用户的时文本域只读 -->
    </div>
    <!-- 消息列表 -->
    <div></div>
  </div>
</template>

<style lang="scss" scoped></style>
