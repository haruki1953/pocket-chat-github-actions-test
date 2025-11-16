<p align="center" style="margin-bottom: 5px;">
  <img src="./assets/message-3-fill-7899CC.svg" alt="cover" style="width: 128px; height: 128px;"></img>
</p>

<h1 align="center">
  PocketChat
</h1>

<p align="center" style="margin-bottom: 5px;">
  <!-- Vue.js -->
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js"></img>
  <!-- TailwindCSS -->
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"></img>
  <!-- TanStack Query -->
  <img src="https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query"></img>
  <!-- PocketBase -->
  <img src="https://img.shields.io/badge/PocketBase-0E83CD?style=for-the-badge&logo=pocketbase&logoColor=white" alt="PocketBase"></img>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License"></img>
  <img src="https://img.shields.io/github/release/haruki1953/pocket-chat.svg?style=for-the-badge" alt="GitHub Release"></img>
  <img src=" https://img.shields.io/github/commit-activity/m/haruki1953/pocket-chat.svg?style=for-the-badge" alt="GitHub Activity"></img>
</p>

<p align="center">
  <a href="./README.md">English</a> | 简体中文
</p>


- PocketChat 是一个基于 [PocketBase](https://github.com/pocketbase/pocketbase) 与 [Vue3](https://github.com/vuejs/vue) 的开源实时聊天平台。
- 跨平台支持 linux、windows、macos 。部署便捷，可在 windows 上解压后运行。
- 支持配置 Github、X/Twitter 等 OAuth2 登录/注册方式。
- 支持消息回复、编辑、删除等操作，支持通过消息链接定位访问消息。
- 项目地址 https://github.com/haruki1953/pocket-chat
- 预览 https://sakiko.top

![login](./assets/Snipaste_2025-11-16_16-03-05.png)

![chat](./assets/Snipaste_2025-11-16_16-00-27.png)

## 部署

在 linux 上部署前，建议先在 windows 上尝试以便了解 PocketChat

### 在 windows 上快速尝试

PocketChat 所有的版本更新都在 Github 以 release 形式发布，在 https://github.com/haruki1953/pocket-chat/releases 下载如 pocket_chat_0.0.1_windows_amd64.zip 这样的压缩包。

![alt text](assets/image.png)

解压，双击 start.bat 运行，会打开这样的命令行。

![alt text](assets/image-1.png)

与此同时，将会自动在浏览器打开 PocketBase 创建超级用户页面 也就是命令行中的链接如 `http://127.0.0.1:58090/_/#/pbinstal/eyJhbGciOiJI......`。

创建超级用户是 [**部署后的务必进行的操作**](#部署后的务必进行的操作)，详见 [根据日志中的链接创建用于后台管理的超级用户](#根据日志中的链接创建用于后台管理的超级用户)

![alt text](assets/image-3.png)


`http://127.0.0.1:58090/_/` 为 PocketChat 的后台管理页面，创建超级用户后即可访问

- users 选项（专业的来说是 集合），可查看所有用户
- config 集合，可查看或修改关于本项目的一些配置，详见 [config 集合配置](#config-集合配置)
- messages 集合，可查看所有用户发送的所有消息

![alt text](assets/image-4.png)

`http://127.0.0.1:58090` 为 PocketChat 的主页，在浏览器访问即可开始使用。

![alt text](assets/image-2.png)

关于 PocketChat 的更多配置请继续阅读此文档

### 在 linux 上完整部署

为了简单易懂地演示，这里使用 [1Panel](https://github.com/1Panel-dev/1Panel) linux面板来进行 PocketChat 的部署操作

准备域名：在自己的域名服务商解析域名，此次部署演示用的域名为 `uika.top`，且使用的是 cloudflare

准备反向代理：在 1Panel(OpenResty) 创建反向代理、配置https。反向代理地址即为 http://127.0.0.1:58090

> 要注意端口占用的情况，笔者因为在此之前就已经部署了一个 PocketChat ，端口 58090 已被使用了，所以这里设置的是 58091

TODO


## 部署后的务必进行的操作

### 根据日志中的链接创建用于后台管理的超级用户

### config 集合配置

### Application 信息配置

## 配置发送电子邮件的设置

## 配置 OAuth2 登录/注册

## 开发指南

**ps**: 
[PocketTogether](https://github.com/haruki1953/pocket-together) 是一个基于 PocketBase 与 Vue3 的实时群聊与同步观看平台（开发中），PocketChat 其实是 PocketTogether 的半成品。