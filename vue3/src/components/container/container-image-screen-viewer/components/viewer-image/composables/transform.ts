import { ref, computed, type ComputedRef } from 'vue'

export const useViewerImageTransformDesuwa = (data: {
  allSize: ComputedRef<{
    windowWidth: number
    windowHeight: number
    contentWidth: number
    contentHeight: number
  }>
}) => {
  const { allSize } = data

  const scale = ref(1)
  const translateX = ref(0)
  const translateY = ref(0)

  // ---------------------------
  // 计算当前图片边界（缩放 + 位移后）
  // ---------------------------
  const boundariesFn = () => {
    const { windowWidth, windowHeight, contentWidth, contentHeight } =
      allSize.value

    const w = contentWidth * scale.value
    const h = contentHeight * scale.value

    const left = (windowWidth - w) / 2 + translateX.value
    const right = windowWidth - (left + w)
    const top = (windowHeight - h) / 2 + translateY.value
    const bottom = windowHeight - (top + h)

    return { left, right, top, bottom }
  }
  const boundaries = computed(boundariesFn)

  // ---------------------------
  // 负责位移
  // ---------------------------
  const clampTranslate = (newX: number, newY: number) => {
    const { windowWidth, windowHeight, contentWidth, contentHeight } =
      allSize.value

    const w = contentWidth * scale.value
    const h = contentHeight * scale.value

    const halfW = w / 2
    const halfH = h / 2

    const minLeft = 50
    const minRight = 50
    const minTop = 100
    const minBottom = 100

    const screenCenterX = windowWidth / 2
    const screenCenterY = windowHeight / 2

    // 用传入的新位移计算图片中心
    const imgCenterX = screenCenterX + newX
    const imgCenterY = screenCenterY + newY

    const left = imgCenterX - halfW
    const right = windowWidth - (imgCenterX + halfW)
    const top = imgCenterY - halfH
    const bottom = windowHeight - (imgCenterY + halfH)

    let finalX = newX
    let finalY = newY

    // 容差
    const toleranceX = 10
    const toleranceY = 14

    // ---------------------------
    // X 方向
    // ---------------------------
    const leftTooBig = left >= minLeft + toleranceX
    const rightTooBig = right >= minRight + toleranceX

    if (leftTooBig && rightTooBig) {
      finalX = 0
    } else if (leftTooBig) {
      const targetCenterX = minLeft + halfW
      finalX = targetCenterX - screenCenterX
    } else if (rightTooBig) {
      const targetCenterX = windowWidth - minRight - halfW
      finalX = targetCenterX - screenCenterX
    }

    // ---------------------------
    // Y 方向
    // ---------------------------
    const topTooBig = top >= minTop + toleranceY
    const bottomTooBig = bottom >= minBottom + toleranceY

    if (topTooBig && bottomTooBig) {
      finalY = 0
    } else if (topTooBig) {
      const targetCenterY = minTop + halfH
      finalY = targetCenterY - screenCenterY
    } else if (bottomTooBig) {
      const targetCenterY = windowHeight - minBottom - halfH
      finalY = targetCenterY - screenCenterY
    }

    // 直接设置位移
    translateX.value = finalX
    translateY.value = finalY
    // return { x: finalX, y: finalY }
  }

  // ---------------------------
  // 缩放限制：是否允许继续缩小
  // ---------------------------
  const canScaleDown = computed(() => {
    const b = boundaries.value
    return !(b.left >= 50 && b.right >= 50 && b.top >= 100 && b.bottom >= 100)
  })

  // ---------------------------
  // 应用缩放（带鼠标中心补偿）
  // ---------------------------
  const applyScale = (newScale: number, centerX: number, centerY: number) => {
    const oldScale = scale.value

    // 限制缩小
    if (newScale < oldScale && !canScaleDown.value) return

    // 限制最大最小
    if (newScale > 3) newScale = 3
    if (newScale < 0.5) newScale = 0.5

    const { windowWidth, windowHeight } = allSize.value

    // 图片中心点（缩放前）
    const imgCenterX = windowWidth / 2 + translateX.value
    const imgCenterY = windowHeight / 2 + translateY.value

    // 鼠标相对图片中心的偏移
    const offsetX = centerX - imgCenterX
    const offsetY = centerY - imgCenterY

    const ratio = newScale / oldScale

    // 位移补偿：模拟以鼠标为中心缩放
    const newX = translateX.value - offsetX * (ratio - 1)
    const newY = translateY.value - offsetY * (ratio - 1)

    scale.value = newScale

    clampTranslate(newX, newY)
    // const clamped = clampTranslate(newX, newY)
    // translateX.value = clamped.x
    // translateY.value = clamped.y
  }

  // ---------------------------
  // 滚轮缩放
  // ---------------------------
  const onWheel = (e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = scale.value + delta
    applyScale(newScale, e.clientX, e.clientY)
  }

  // ---------------------------
  // 鼠标拖动
  // ---------------------------
  let dragging = false
  let lastX = 0
  let lastY = 0

  const onMouseDown = (e: MouseEvent) => {
    dragging = true
    lastX = e.clientX
    lastY = e.clientY
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return

    const dx = e.clientX - lastX
    const dy = e.clientY - lastY

    lastX = e.clientX
    lastY = e.clientY

    const newX = translateX.value + dx
    const newY = translateY.value + dy

    clampTranslate(newX, newY)
    // const clamped = clampTranslate(newX, newY)
    // translateX.value = clamped.x
    // translateY.value = clamped.y
  }

  const onMouseUp = () => {
    dragging = false
  }

  // ---------------------------
  // 双指触摸
  // ---------------------------
  let touchStartDist = 0
  let touchStartCenter = { x: 0, y: 0 }
  let touchStartScale = 1
  let touchStartTranslate = { x: 0, y: 0 }

  const getTouchDist = (t: TouchList) => {
    const dx = t[0].clientX - t[1].clientX
    const dy = t[0].clientY - t[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getTouchCenter = (t: TouchList) => ({
    x: (t[0].clientX + t[1].clientX) / 2,
    y: (t[0].clientY + t[1].clientY) / 2,
  })

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      touchStartDist = getTouchDist(e.touches)
      touchStartCenter = getTouchCenter(e.touches)
      touchStartScale = scale.value
      touchStartTranslate = { x: translateX.value, y: translateY.value }
    }
  }

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 2) return

    const newDist = getTouchDist(e.touches)
    const center = getTouchCenter(e.touches)

    // 缩放
    const ratio = newDist / touchStartDist
    const newScale = touchStartScale * ratio
    applyScale(newScale, center.x, center.y)

    const newX = touchStartTranslate.x + (center.x - touchStartCenter.x)
    const newY = touchStartTranslate.y + (center.y - touchStartCenter.y)

    clampTranslate(newX, newY)
    // const clamped = clampTranslate(newX, newY)
    // translateX.value = clamped.x
    // translateY.value = clamped.y
  }

  // ---------------------------
  // 重置
  // ---------------------------
  const reset = () => {
    scale.value = 1
    translateX.value = 0
    translateY.value = 0
  }

  return {
    scale,
    translateX,
    translateY,

    transform: computed(() => {
      return `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`
    }),

    onWheel,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onTouchStart,
    onTouchMove,

    reset,
  }
}
