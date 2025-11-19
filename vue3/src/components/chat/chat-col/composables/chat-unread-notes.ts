import { useScroll } from '@vueuse/core'
import type {
  ChatColPageRecoverDataCheckType,
  ChatDisplayDependentDataInitializationChooseType,
  ChatRoomMessagesRealtimeType,
  PropsType,
} from './dependencies'
import { useAuthStore } from '@/stores'

// 未读实时消息统计
export const useChatRoomMessagesRealtimeUnReadNotes = (data: {
  //
  chatRoomMessagesRealtime: ChatRoomMessagesRealtimeType
  props: PropsType
  isChatBottomHasMore: ComputedRef<boolean>
  // 各种初始化情况的对应数据，决定使用哪种初始化
  chatDisplayDependentDataInitializationChoose: ChatDisplayDependentDataInitializationChooseType
  // “页面恢复数据”是否正确
  chatColPageRecoverDataCheck: ChatColPageRecoverDataCheckType
}) => {
  const {
    //
    chatRoomMessagesRealtime,
    props,
    isChatBottomHasMore,
    chatDisplayDependentDataInitializationChoose,
    chatColPageRecoverDataCheck,
  } = data
  const { chooseInitialization, chatColPageRecoverData } =
    chatDisplayDependentDataInitializationChoose

  const authStore = useAuthStore()

  // 去除自己发送的消息
  const chatRoomMessagesRealtimeWithoutSelfSend = computed(() => {
    if (authStore.isValid === false || authStore.record == null) {
      return chatRoomMessagesRealtime.value
    }
    const userId = authStore.record.id
    return chatRoomMessagesRealtime.value.filter((i) => i.author !== userId)
  })

  // 新消息提示
  // 已读的实时消息数量（定义）
  const chatRoomMessagesRealtimeReadNumber = ref(0)
  const chatRoomMessagesRealtimeReadNumberUpdateFn = () => {
    // 自己发送的消息不算
    chatRoomMessagesRealtimeReadNumber.value =
      chatRoomMessagesRealtimeWithoutSelfSend.value.length
  }
  // 已读的实时消息数量（初始化）
  // 根据“页面恢复数据”初始化
  if (
    chooseInitialization === 'chatColPageRecoverData' &&
    chatColPageRecoverData != null &&
    // 判断 “页面恢复数据” 是否正确，正确才进行此方式的初始化
    chatColPageRecoverDataCheck === true
  ) {
    chatRoomMessagesRealtimeReadNumber.value =
      chatColPageRecoverData.data.chatRoomMessagesRealtimeReadNumber
  }
  // 普通初始化
  else {
    chatRoomMessagesRealtimeReadNumberUpdateFn()
  }
  // TODO “页面恢复数据”初始化

  // 未读的实时消息数量
  const chatRoomMessagesRealtimeUnReadNumber = computed(() => {
    // 自己发送的消息不算
    return (
      chatRoomMessagesRealtimeWithoutSelfSend.value.length -
      chatRoomMessagesRealtimeReadNumber.value
    )
  })

  // 滚动到底部，且底部没有未显示的消息，就更新已读数量
  // 响应式的滚动位置数据
  const messagesWarpScroll = useScroll(() => {
    return props.refScrollWarp
  })
  watch(
    () => messagesWarpScroll.arrivedState.bottom,
    async () => {
      if (
        messagesWarpScroll.arrivedState.bottom === true &&
        isChatBottomHasMore.value === false
      ) {
        chatRoomMessagesRealtimeReadNumberUpdateFn()
      }
    }
  )

  return {
    chatRoomMessagesRealtimeUnReadNumber,
    chatRoomMessagesRealtimeReadNumber,
  }
}
