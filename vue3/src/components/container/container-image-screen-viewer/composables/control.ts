import { imageGetDprFn } from '@/config'
import type { ViewerPropsType } from './dependencise'
import { useWindowSize } from '@vueuse/core'
import {
  pbImageDataChooseByLargest,
  pbImageDataChooseByLargestWithUrl,
} from '@/utils'

export const useViewerControlDesuwa = (data: {
  //
  props: ViewerPropsType
}) => {
  const {
    //
    props,
  } = data

  // 展开alt
  const isAltOpen = ref(false)
  const altOpen = () => {
    isAltOpen.value = true
  }
  const altClose = () => {
    isAltOpen.value = false
  }

  const controlReset = () => {
    isAltOpen.value = false
  }

  watch(
    () => props.dialogVisible,
    (val) => {
      if (val === true) {
        // 每次打开时reset
        controlReset()
      }
    }
  )

  const viewerImageList = computed(() => props.imageList)

  // 当前显示图片
  const viewerImageCurrentId = ref('')
  const viewerImageData = computed(() => {
    return viewerImageList.value.find(
      (i) => i.id === viewerImageCurrentId.value
    )
  })

  watch(
    () => props.imageCurrentId,
    (val) => {
      viewerImageCurrentId.value = val
    },
    { immediate: true }
  )

  // 切换显示图片
  const viewerImageSwitch = (imageId: string) => {
    controlReset()
    viewerImageCurrentId.value = imageId
  }

  const viewerClose = () => {
    props.dialogCloseFn()
  }

  // export const imageGetDprFn = () => {
  //   const rawDpr = window.devicePixelRatio
  //   return Math.min(3, Math.max(1, rawDpr))
  // }
  const drp = imageGetDprFn()

  // import { useWindowSize } from '@vueuse/core'
  const windowSize = useWindowSize()

  const imageSizeAndUrl = computed(() => {
    if (viewerImageData.value == null) {
      return null
    }
    return pbImageDataChooseByLargestWithUrl(viewerImageData.value)
    // 返回值是像这样的
    // {
    //   image: string;
    //   width: number;
    //   height: number;
    //   url: string;
    // }
  })

  // 计算内容初始尺寸
  // 根据图片最大尺寸、屏幕尺寸、分辨率
  // 长宽和不能小于200
  // 图片长或宽无尺寸时（任意值为0），按长宽都为 1000 算
  // 图片无数据时（imageSize为null），返回null
  // 先将图片长宽除以drp
  // 情况1 长宽和 小于200，按比例放大长宽值，让和为200，返回长与宽的值
  // 情况2 长大于屏幕长 或 宽大于屏幕宽，按比例缩放，返回长与宽的值
  // 请款3 到这里说明正好合适，返回长与宽的值
  const viewerContentSize = computed(() => {
    const img = imageSizeAndUrl.value
    if (!img) {
      return null
    }

    // 1. 处理 0 尺寸 → 1000
    const rawW = img.width > 0 ? img.width : 1000
    const rawH = img.height > 0 ? img.height : 1000

    // 2. 除以 dpr 得到基础尺寸（不可变）
    const baseW = rawW / drp
    const baseH = rawH / drp

    // 3. 情况1：长宽和 < 200 → 放大
    const baseSum = baseW + baseH
    if (baseSum < 200) {
      const scale = 200 / baseSum
      return {
        width: baseW * scale,
        height: baseH * scale,
      }
    }

    // 4. 情况2：超过屏幕 → 缩小
    const maxW = windowSize.width.value
    const maxH = windowSize.height.value

    const scaleW = maxW / baseW
    const scaleH = maxH / baseH
    const scale = Math.min(scaleW, scaleH, 1)

    if (scale < 1) {
      return {
        width: baseW * scale,
        height: baseH * scale,
      }
    }

    // 5. 情况3：正好合适
    return {
      width: baseW,
      height: baseH,
    }
  })

  // 内容大小与数据的整合
  const viewerContentData = computed(() => {
    if (imageSizeAndUrl.value == null) {
      return null
    }
    if (viewerContentSize.value == null) {
      return null
    }
    const { url } = imageSizeAndUrl.value
    const { width, height } = viewerContentSize.value
    return {
      url,
      width,
      height,
    }
  })

  return {
    isAltOpen,
    altOpen,
    altClose,
    controlReset,
    viewerImageList,
    viewerImageData,
    viewerImageSwitch,
    viewerClose,
    viewerContentData,
  }
}

export type ViewerControlDesuwaType = ReturnType<typeof useViewerControlDesuwa>
