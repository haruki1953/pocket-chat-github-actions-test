<script setup lang="ts">
import type {
  ImageQueryModeDesuwaType,
  ImageQueryModeMarkType,
} from './dependencies'
import { PanelImageUploader } from './components'
import { useAuthStore, useI18nStore } from '@/stores'
import { useImagePageListQuery } from '@/queries'
import { useAniStrIncreasingDecreasingSequentially } from '@/composables'

const props = defineProps<{
  imageQueryModeDesuwa: ImageQueryModeDesuwaType
}>()

const {
  imageQueryMode,
  canImageQueryModeSetToImageAll,
  imageQueryModeSetToImageAll,
  canImageQueryModeSetToImageMy,
  imageQueryModeSetToImageMy,
  imageQuerySearch,
  imageQuerySearchSet,
} = props.imageQueryModeDesuwa

const i18nStore = useI18nStore()

const searchInputContent = ref(imageQuerySearch.value)

// 是否能 搜索框开始查询
const canSearchInputContentSetToImageQuerySearch = computed(() => {
  if (imageQuerySearch.value === searchInputContent.value) {
    return false
  }
  return true
})
// 搜索框开始查询
const searchInputContentSetToImageQuerySearch = () => {
  if (canSearchInputContentSetToImageQuerySearch.value === false) {
    return
  }
  imageQuerySearchSet(searchInputContent.value)
}

// 搜索框清空
const searchInputContentClear = () => {
  searchInputContent.value = ''
  searchInputContentSetToImageQuerySearch()
}

// 图片数量查询

// 全部图片
const numAllImagePageListQuery = useImagePageListQuery({
  pageNum: computed(() => 1),
  authorId: computed(() => null),
  searchContent: computed(() => null),
  customStrId: computed(() => 'numAllImagePageListQuery'),
})

const authStore = useAuthStore()

// 我的图片
const numMyImagePageListQuery = useImagePageListQuery({
  pageNum: computed(() => {
    // 未登录则 pageNum 为 null 即不查询
    if (authStore.isValid === false || authStore.record?.id == null) {
      return null
    }
    return 1
  }),
  authorId: computed(() => {
    if (authStore.isValid === false || authStore.record?.id == null) {
      return null
    }
    return authStore.record.id
  }),
  searchContent: computed(() => null),
  customStrId: computed(() => 'numMyImagePageListQuery'),
})

// note\笔记251120\260104-关于 TanStack Vue Query 动态 queryKey 与 invalidateQueries 异常行为数据或缓存污染的分析笔记.md
// 【20260104-0915】
// 至于到底是否应该绝对不用 invalidateQueries ，应该也没到那个地步，在某些地方时还是很好用的
// 只是应该注意，在有多个useQuery的key相同且都是active时，此时用invalidateQueries就会导致问题
// 尽量只对非active的查询使用invalidateQueries吧，这应该是安全的

// 经过实验后确认了，在有多个useQuery的key相同且都是active时，此时用invalidateQueries就会导致问题
// 实验方法是，在 ImagePageControlPanel.vue 中注释掉了 numAllImagePageListQuery 、numMyImagePageListQuery
// src\views\image\components\image-page-control-panel\ImagePageControlPanel.vue
// 然后再进行测试，设置搜索、刷新、返回、再次进入图片选择页，发现是正常的，列表中正常显示着全部图片，
// 而在之前有问题时，设置搜索、刷新、返回、再次进入图片选择页后，列表中显示的是之前搜索的值，而且明明搜索框当前是空的，这就说明了数据或缓存污染异常行为

// 现在确认了，只要在invalidateQueries时，没有多个useQuery的key相同且都是active，就不会有问题
// 这样的话，图片选择页的刷新也不必都改为 refetch，只要让key别一样就行，改改 queryKeys.imagePageList 在最后加上一个可自定义的充当唯一标识的字符串即可

// 图片数字加载时的字符串动画
const { text: imgNumAniStr } = useAniStrIncreasingDecreasingSequentially()
</script>

<template>
  <div>
    <div class="overflow-hidden rounded-[24px] bg-color-background-soft">
      <!-- 上传图片 -->
      <div>
        <PanelImageUploader></PanelImageUploader>
      </div>
      <!-- 分割线 -->
      <div class="border-t-[3px] border-color-background"></div>
      <!-- 全部图片 我的图片 -->
      <div>
        <div class="flex items-stretch">
          <!-- 左 全部图片 -->
          <div class="flex-1 truncate">
            <div
              class="flow-root transition-colors"
              :class="{
                'bg-el-primary-light-6': imageQueryMode === 'image_all',
                'cursor-pointer': canImageQueryModeSetToImageAll,
                'cursor-not-allowed': !canImageQueryModeSetToImageAll,
              }"
              @click="imageQueryModeSetToImageAll"
            >
              <div class="mx-[10px] mb-[12px] mt-[10px]">
                <div
                  class="select-none truncate text-center text-[18px] font-bold text-color-text"
                >
                  {{
                    numAllImagePageListQuery.data.value?.totalItems ??
                    imgNumAniStr
                  }}
                </div>
                <div
                  class="select-none truncate text-center text-[12px] font-bold text-color-text"
                >
                  {{ i18nStore.t('imagePageAllImageText')() }}
                </div>
              </div>
            </div>
          </div>
          <div class="border-l-[3px] border-color-background"></div>
          <!-- 左 我的图片 -->
          <div class="flex-1">
            <div
              class="flow-root transition-colors"
              :class="{
                'bg-el-primary-light-6': imageQueryMode === 'image_my',
                'cursor-pointer': canImageQueryModeSetToImageMy,
                'cursor-not-allowed': !canImageQueryModeSetToImageMy,
              }"
              @click="imageQueryModeSetToImageMy"
            >
              <div class="mx-[10px] mb-[12px] mt-[10px]">
                <div
                  class="select-none truncate text-center text-[18px] font-bold text-color-text"
                >
                  {{
                    numMyImagePageListQuery.data.value?.totalItems ??
                    imgNumAniStr
                  }}
                </div>
                <div
                  class="select-none truncate text-center text-[12px] font-bold text-color-text"
                >
                  {{ i18nStore.t('imagePageMyImageText')() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="border-t-[3px] border-color-background"></div>
      <!-- 搜索栏 -->
      <div class="search-input-box">
        <div class="my-2 flex items-stretch">
          <!-- 左栏 输入框 -->
          <div class="ml-2 flow-root flex-1 truncate">
            <div>
              <ElInput
                v-model="searchInputContent"
                :placeholder="i18nStore.t('imagePageSearchPlaceholderText')()"
                @keydown.enter.exact.prevent="
                  searchInputContentSetToImageQuerySearch
                "
              >
                <template #suffix>
                  <div
                    v-if="searchInputContent !== ''"
                    class="cursor-pointer text-color-text-soft"
                    @click="searchInputContentClear"
                  >
                    <RiCloseCircleLine size="18px"></RiCloseCircleLine>
                  </div>
                </template>
              </ElInput>
            </div>
          </div>
          <!-- 右栏 按钮 -->
          <div class="mr-2 flex flex-col-reverse">
            <ElButton
              circle
              type="info"
              :disabled="!canSearchInputContentSetToImageQuerySearch"
              @click="searchInputContentSetToImageQuerySearch"
            >
              <template #icon>
                <RiSearchLine></RiSearchLine>
              </template>
            </ElButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-input-box {
  .el-input {
    :deep() {
      .el-input__wrapper {
        background-color: transparent;
        box-shadow: none;

        &:hover {
          box-shadow: none;
        }
        .el-input__inner {
          color: var(--color-text);
          font-size: 14px;
          font-weight: bold;
          // text-align: center;
          &::placeholder {
            color: var(--color-text-soft);
            font-size: 14px;
            font-style: italic;
          }
        }
      }
    }
  }
}
</style>
