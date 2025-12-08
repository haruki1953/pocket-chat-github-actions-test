import { axiosConfig } from '@/config'
import { Collections, pb, type Create } from '@/lib'
import type { ReplacePropertyType } from '@/types'
import { fetchWithTimeoutPreferred } from '@/utils'
import type { UploadFile } from 'element-plus'
import axios, { type AxiosProgressEvent } from 'axios'

export const pbImageUploadApi = (uploadFile: UploadFile) => {
  // 未登录，抛出错误
  if (!pb.authStore.isValid || pb.authStore.record?.id == null) {
    throw new Error('!pb.authStore.isValid || pb.authStore.record?.id == null')
  }
  if (uploadFile.raw == null) {
    throw new Error('uploadFile.raw == null')
  }

  // 准备类型，pb图片这一块类型不太完善，用类型工具修改一下
  type DataType = Create<Collections.Images>
  type DataTypeWithFile = ReplacePropertyType<DataType, 'image', File>
  // 准备数据
  const data: DataTypeWithFile = {
    author: pb.authStore.record.id,
    image: uploadFile.raw,
    imageWidth: 10,
    imageHeight: 10,
    isDeleted: false,
  }

  const pbRes = pb.collection(Collections.Images).create(data, {
    // timeout为5000
    fetch: fetchWithTimeoutPreferred,
  })

  return pbRes
}

/*
将pbImageUploadApi从使用pocketbaseJsSdk实例，转为使用axios，因为axios好像能获得上传进度之类的
可能需要用到的值
axiosConfig.baseUrl // 开发环境时 http://127.0.0.1:58090/ ，生产环境时 /
pb.authStore.token

body 好像应该时如此的 FormData
Required image
	File 	File object.
Set to empty value (null, "" or []) to delete already uploaded file(s).
Required author
	String 	Relation record id.

这是 pbImageUploadApi 产生的http信息，有些信息你或许可以参考，例如 POST 路径 Authorization

POST /api/collections/images/records HTTP/1.1
Accept-Encoding: gzip, deflate, br, zstd
Accept-Language: en-US
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3NjU3OTMxMjcsImlkIjoibmltNjRxbjR4Yjc2YThzIiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.038bR-Sd3HhF9J3ZRF411IwSPJ9vkNNi8kFyibaNDYI
Connection: keep-alive
Content-Length: 136168
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryLErBwA4W7fthJY6V
Host: 127.0.0.1:58090
Origin: http://localhost:5173
Referer: http://localhost:5173/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: cross-site
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36
sec-ch-ua: "Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"

载荷
------WebKitFormBoundaryW20pCYht5UZ67kYZ
Content-Disposition: form-data; name="author"

nim64qn4xb76a8s
------WebKitFormBoundaryW20pCYht5UZ67kYZ
Content-Disposition: form-data; name="image"; filename="Snipaste_2025-11-26_19-35-09.png"
Content-Type: image/png

------WebKitFormBoundaryW20pCYht5UZ67kYZ--
*/

/**
 * 【251208 待测试】
 * 使用 Axios 上传图片到 PocketBase `images` 集合。
 *
 * 该函数会自动构造 `FormData`，并支持上传进度回调与请求中断。
 * 与 `pbImageUploadApi` 保持类型一致，但通过 Axios 提供更灵活的控制。
 *
 * @param uploadFile - Element Plus 的 `UploadFile` 对象，必须包含 `raw` 文件。
 * @param options - 上传配置选项。
 * @param options.onImageUploadProgress - 上传进度回调，接收 Axios 的 `AxiosProgressEvent`。
 * @param options.controller - 可选的 `AbortController`，用于中断上传请求。
 *
 * @returns 返回值类型与 `pbImageUploadApi` 相同，通常为 PocketBase 创建记录的响应数据。
 *
 * @throws 如果用户未登录（`pb.authStore.isValid` 为 false 或 `record.id` 为空），会抛出错误。
 * @throws 如果 `uploadFile.raw` 为空，会抛出错误。
 *
 * @example
 * ```ts
 * const controller = new AbortController()
 *
 * const res = await pbImageUploadWithAxios(file, {
 *   onImageUploadProgress: (e) => {
 *     if (e.total) {
 *       const percent = Math.round((e.loaded * 100) / e.total)
 *       console.log(`上传进度: ${percent}%`)
 *     }
 *   },
 *   controller,
 * })
 *
 * // 如果需要取消上传
 * controller.abort()
 *
 * console.log('上传成功:', res)
 * ```
 */
export const pbImageUploadWithAxios = async (
  uploadFile: UploadFile,
  options: {
    onImageUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    controller?: AbortController
  }
): ReturnType<typeof pbImageUploadApi> => {
  const { onImageUploadProgress, controller } = options

  // 未登录，抛出错误
  if (!pb.authStore.isValid || pb.authStore.record?.id == null) {
    throw new Error('!pb.authStore.isValid || pb.authStore.record?.id == null')
  }
  if (uploadFile.raw == null) {
    throw new Error('uploadFile.raw == null')
  }

  // 准备类型
  type DataType = Create<Collections.Images>
  type DataTypeWithFile = ReplacePropertyType<DataType, 'image', File>

  // 准备数据（类型安全）
  const data: DataTypeWithFile = {
    author: pb.authStore.record.id,
    image: uploadFile.raw,
  }

  // 将 data 转换为 FormData
  const formData = new FormData()
  for (const [key, value] of Object.entries(data)) {
    const processedValue = (() => {
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value)
      }
      if (value instanceof File) {
        return value as Blob
      }
      return value
    })()
    formData.append(key, processedValue)
  }

  // Axios 请求
  const res = await axios.post(
    `${axiosConfig.baseUrl}api/collections/${Collections.Images}/records`,
    formData,
    {
      headers: {
        Authorization: pb.authStore.token,
        'Content-Type': 'multipart/form-data',
      },
      // timeout: 5000,
      onUploadProgress: onImageUploadProgress,
      signal: controller?.signal,
    }
  )

  return res.data
}
