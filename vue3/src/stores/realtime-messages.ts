import { type MessagesResponseWidthExpand } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/** 用于储存订阅的实时Messages */
export const useRealtimeMessagesStore = defineStore(
  'pocket-together-realtime-messages',
  () => {
    // 储存订实时阅得到的消息
    /** 创建的帖子 */
    const createListRef = ref<MessagesResponseWidthExpand[]>([])
    const createList = computed(() => createListRef.value)
    const createListCheckAndPush = (val: MessagesResponseWidthExpand) => {
      // TODO 检查是否已存在
      createListRef.value.push(val)
    }
    const createListSet = (val: MessagesResponseWidthExpand[]) => {
      createListRef.value = val
    }

    /** 更新的帖子 */
    const updateListRef = ref<MessagesResponseWidthExpand[]>([])
    const updateList = computed(() => updateListRef.value)
    const updateListPush = (val: MessagesResponseWidthExpand) => {
      updateListRef.value.push(val)
    }
    /* 删除的帖子 */
    const deleteListRef = ref<MessagesResponseWidthExpand[]>([])
    const deleteList = computed(() => deleteListRef.value)
    const deleteListPush = (val: MessagesResponseWidthExpand) => {
      deleteListRef.value.push(val)
    }

    // 是否已启动订阅
    const isSubscribeStartedRef = ref(false)
    const isSubscribeStarted = computed(() => isSubscribeStartedRef.value)
    const isSubscribeStartedSetTrue = () => {
      isSubscribeStartedRef.value = true
    }

    return {
      //
      createList,
      createListCheckAndPush,
      createListSet,
      updateList,
      updateListPush,
      deleteList,
      deleteListPush,
      isSubscribeStarted,
      isSubscribeStartedSetTrue,
    }
  },
  {
    persist: true, // 持久化
  }
)
