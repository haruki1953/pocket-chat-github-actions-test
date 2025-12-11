import { pbImageUploadWithAxios } from '@/api'
import {
  uploadImageMaxSimultaneousNumConfig,
  type UploadImageStoreRecordStatus,
} from '@/config'
import type { UploadFile } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 上传图片 最大同时上传数
// uploadImageMaxSimultaneousNumConfig

export interface UploadImageStoreRecord {
  uuid: string
  fileUid: number
  name: string
  type: string
  size: number
  addedAt: string
  status: UploadImageStoreRecordStatus
}

export interface UploadImageStoreFile {
  uuid: string
  uploadFile: UploadFile
}

export interface UploadImageStoreProgressInfo {
  uuid: string
  controller: AbortController
  loaded: number
  total?: number | null
  rate?: number // bytes/sec
  estimated?: number // seconds
}

export const useUploadImageStore = defineStore(
  'pocket-together-upload-image',
  () => {
    // 上传记录列表 持久化
    const uploadRecordList = ref<UploadImageStoreRecord[]>([])

    // 文件列表 不持久化
    const uploadFileList = ref<UploadImageStoreFile[]>([])

    // 上传进度列表 不持久化
    const uploadProgressInfoList = ref<UploadImageStoreProgressInfo[]>([])

    // 函数 获取，即通过uuid获取 上传记录-文件列表-上传进度列表
    const getRecordWithFileAndProgressInfo = (uuid: string) => {
      // uploadRecordList 必须要找到
      const findRecord = uploadRecordList.value.find((i) => i.uuid === uuid)
      if (findRecord == null) {
        return null
      }
      // uploadFileList uploadProgressInfoList 因其非持久化，所以可能没有
      const findFile = uploadFileList.value.find((i) => i.uuid === uuid)
      const findProgressInfo = uploadProgressInfoList.value.find(
        (i) => i.uuid === uuid
      )

      return {
        record: findRecord,
        file: findFile,
        progressInfo: findProgressInfo,
      }
    }

    //
    // AITODO 上传管理这一块的一些函数
    //
    // 函数 添加上传操作，即在 上传记录列表、文件列表 中添加
    //     参数 UploadFile
    //
    // 函数 是否能清除全部已完成的，存在已完成的才能进行
    // 函数 清除全部已完成的（即在 上传记录列表、文件列表 中移除）
    //
    // 函数 是否能清除全部中止的，存在中止的才能进行
    // 函数 清除全部中止的
    //
    // 函数 是否能清除全部错误或中断的，存在错误或中断的才能进行
    // 函数 清除全部错误或中断的

    //
    // AITODO 一些上传项目控制这一块的操作函数
    //
    // 函数 是否能删除某项（参数uuid），为 上传完成、中止、错误、中断 时才能删除
    // 函数 删除某项，上传记录列表、文件列表、上传进度列表 中都要删除
    //
    // 函数 是否能设置针对待上传的中止（参数uuid），只有 待上传 时才能进行
    // 函数 设置针对待上传的中止 将其对应 uploadRecord 状态改为aborted_while_pending即可
    //
    // 函数 是否能设置针对上传中的中止（参数uuid），只有 上传中 时才能进行
    // 函数 设置针对上传中的中止 找到参数uuid所指的 uploadProgressInfo 项，用其 controller 中止 然后返回即可
    //     没有 uploadProgressInfo 项的话，将其对应 uploadRecord 状态改为aborted_while_uploading即可
    //
    // 函数 是否能重新上传（参数uuid），为 中止、错误 时才能重新上传，有File时才能重新上传
    // 函数 重新上传，有File时才能重新上传，为中止或错误时才能重新上传
    //     找到参数uuid所指的 uploadRecord 将其状态设置为待上传即可

    //
    // AITODO 上传调度函数
    // 函数 上传调度函数，如果当前未达到最大同时上传数，find一个列表中待上传的项（还须有对应的uploadFile），启动其上传并await
    //    完成时，将其状态设置为已完成，并移除对应 uploadFile 项
    //    可能捕获到的错误有两种：中止、错误
    //    中止时，将其状态设置为中止（aborted_while_uploading）
    //    错误时，将其状态设置为错误
    //    最终无论什么结构，都要移除对应的 uploadProgressInfo 项
    //    启动上传时是调用 pbImageUploadWithAxios
    //    启动上传前会准备 controller 和 onImageUploadProgress ，将传入 pbImageUploadWithAxios
    //    onImageUploadProgress中，就是将从其参数得到的值，将其信息写入对应的 uploadProgressInfo 项，
    //    或需可以用某些办法，限制onImageUploadProgress最快一秒执行一次，以避免性能问题（lodash-es 的 throttle 可以实现吗）
    //    启动上传前，会在 uploadProgressInfoList 创建对应的项

    // AITODO 轮询驱动函数
    // 函数 轮询驱动函数，函数中有无限循环，循环中有 await setTimeout2秒 ，循环中会调用上传调度函数。
    //     前端启动后应开始运行

    // AITODO 上传记录初始处理函数
    // 函数 上传记录初始处理函数，处理上传记录列表，将所有 上传中、待上传 的状态改为 中断
    //     前端启动后应执行一次，在轮询驱动函数执行前执行

    // AITODO 统一的初始化函数
    // 函数 统一的初始化函数，其中将执行 上传记录初始处理函数 与 轮询驱动函数，将被store返回，将在app.vue调用
    //     需确保只执行一次

    return {
      //
      uploadRecordList,
    }
  },
  {
    persist: true, // 持久化
  }
)
