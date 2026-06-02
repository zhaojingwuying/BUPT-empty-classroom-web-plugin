# BUPT空教室查询网页插件

一个用于增强 BUPT 官方空闲教室查询页面的浏览器书签脚本。它会在你已经登录并打开官方空教室查询页面后，在本地页面上提供更方便的校区、教学楼和节次筛选。

> 推荐仓库名：`BUPT-empty-classroom-web-plugin`  
> 推荐 GitHub 地址：`https://github.com/zhaojingwuying/BUPT-empty-classroom-web-plugin`

## 它做什么

- 从当前页面已有的 Vue 数据或 `/todayClassrooms` 接口响应中读取空闲教室列表。
- 在本地页面上提供校区、教学楼、节次筛选。
- 针对西土城校区，把教学楼归类为教一、教二、教三、教四、未来学习大楼。
- 不需要 Tampermonkey / 篡改猴。
- 不接管登录流程，不保存账号密码。

## 使用前提

请先自行登录官方页面：

```text
http://jwglweixin.bupt.edu.cn/sjd/#
```

登录完成后，进入官方的“空教室查询”页面，并等待官方页面中的空教室数据加载完成。然后再运行本插件书签。

本插件不会帮你登录，也不会绕过学校系统的认证流程。它只增强你已经打开的官方查询结果页面。

## 使用方式

### 方式一：用 CDN 加载源码，推荐手机使用

把下面这一整行保存成浏览器书签 URL：

```js
javascript:(()=>{let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/zhaojingwuying/BUPT-empty-classroom-web-plugin@main/src/emptyclassroom.js';document.body.appendChild(s)})()
```

使用流程：

1. 在浏览器中打开并登录：`http://jwglweixin.bupt.edu.cn/sjd/#`。
2. 进入官方“空教室查询”页面。
3. 等待官方页面的空教室列表加载完成。
4. 打开浏览器书签，点击你保存的“BUPT空教室查询网页插件”。
5. 页面会显示增强版筛选界面。

为了安全，公开发布后建议把 `@main` 改成固定 commit 哈希，例如：

```js
javascript:(()=>{let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/zhaojingwuying/BUPT-empty-classroom-web-plugin@你的commit哈希/src/emptyclassroom.js';document.body.appendChild(s)})()
```

这样可以避免仓库后续改动导致用户加载到未审计的新版本。

### 方式二：生成完整 bookmarklet

```bash
npm run build
```

生成结果在：

```text
dist/bookmarklet.txt
```

因为完整 bookmarklet 很长，手机浏览器可能无法直接粘贴，推荐使用方式一。

## 隐私与安全

本脚本只在你的浏览器本地运行。

本脚本不会：

- 读取 `document.cookie`；
- 读取 `localStorage` / `sessionStorage`；
- 保存账号、密码、Cookie、Token；
- 主动向第三方服务器上传数据；
- 在页面中展示完整接口 URL 或 query 参数。

请不要在 Issue、截图、日志或 README 中公开任何包含 Cookie、Token、完整接口 URL、`chBKhbg9` 或其他 query 参数的内容。

## 开发与审计

查看潜在敏感字段：

```bash
npm run check:secrets
```

手动检查网络行为时，重点确认代码只读取当前页面数据和 `/todayClassrooms` 响应，不上传数据。

## 与 Jraaay/EmptyClassroom 的关系

本项目的功能思路参考了 Jraaay/EmptyClassroom，但本仓库不是其 fork，也不包含其 Go 后端或 React 前端源码。

原项目地址：<https://github.com/Jraaay/EmptyClassroom>

## 免责声明

本项目仅供学习交流和个人页面增强使用，不隶属于学校、教务系统或原项目。使用者应遵守学校系统使用规范，不得用于高频请求、绕过认证、批量抓取或其他不当用途。
