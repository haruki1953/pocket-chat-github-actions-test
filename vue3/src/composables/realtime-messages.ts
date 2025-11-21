import {
  pbMessagesSubscribeAllApi,
  type MessagesResponseWidthExpand,
} from '@/api'
import { appUserDefaultAvatar, routerDict } from '@/config'
import { pb } from '@/lib'
import { useRealtimeMessagesStore } from '@/stores'
import { useWebNotification } from '@vueuse/core'
import { useRoute } from 'vue-router'

export const useRealtimeMessagesSubscribe = () => {
  const realtimeMessagesStore = useRealtimeMessagesStore()
  const route = useRoute()

  // // 实验页面可见性
  // ;(async () => {
  //   while (true) {
  //     await new Promise((resolve) => setTimeout(resolve, 1000))
  //     console.log('document.visibilityState', document.visibilityState)
  //   }
  // })()

  // 收到新消息时调用，根据情况决定是否通知
  const newMessageCheckAndNotif = (newMessage: MessagesResponseWidthExpand) => {
    // 消息为自己发送，不显示通知
    if (
      pb.authStore.record != null &&
      newMessage.author === pb.authStore.record.id
    ) {
      return
    }
    // 页面可见，并且当前为聊天页（pocket-together且消息房间为当前房间），不显示通知
    if (
      document.visibilityState === 'visible' &&
      route.name === routerDict.ChatHome.name
      // && newMessage.room
    ) {
      return
    }

    // 准备要显示的数据
    /** 标题-头像 */
    const title = (() => {
      // author == null是不正常的
      if (newMessage.expand.author == null) {
        console.error('newMessage.expand.author == null')
        return ''
      }
      // 无名称，返回用户名
      if (newMessage.expand.author.name === '') {
        return newMessage.expand.author.username
      }
      // 正常，返回名称
      return newMessage.expand.author.name
    })()
    /** 内容 */
    const body = newMessage.content
    /** 图标-头像 */
    const icon = (() => {
      // author == null是不正常的，返回默认头像
      if (newMessage.expand.author == null) {
        console.error('newMessage.expand.author == null')
        return appUserDefaultAvatar
      }
      // 无头像，返回默认头像
      if (newMessage.expand.author.avatar === '') {
        return appUserDefaultAvatar
      }
      // 有头像，返回头像url
      return pb.files.getURL(
        newMessage.expand.author,
        newMessage.expand.author.avatar
      )
    })()

    // 显示通知
    useWebNotification({
      title,
      body,
      icon,
      tag: newMessage.id,
    })
      .show()
      .catch(() => {})
  }

  // 启动订阅，将在App.vue调用
  const startSubscribe = async () => {
    // 防止多次调用
    if (realtimeMessagesStore.isSubscribeStarted) {
      return 'realtimeMessagesStore.isSubscribeStarted' as const
    }
    realtimeMessagesStore.isSubscribeStartedSetTrue()

    // PB_CONNECT，断线重连消息补偿
    await pb.realtime.subscribe('PB_CONNECT', (e) => {
      console.log('PB_CONNECT', e)
    })
    await pbMessagesSubscribeAllApi(async (e) => {
      // // 模拟延迟
      // await new Promise((resolve) => setTimeout(resolve, 6000))

      if (e.action === 'create') {
        realtimeMessagesStore.createListCheckAndPush(e.record)
        // 判断是否进行通知
        newMessageCheckAndNotif(e.record)
      }
      if (e.action === 'update') {
        realtimeMessagesStore.updateListPush(e.record)
      }
      if (e.action === 'delete') {
        realtimeMessagesStore.deleteListPush(e.record)
      }
      // console.log(e)
    })

    return 'startSubscribe'
  }

  return {
    startSubscribe,
  }
}
