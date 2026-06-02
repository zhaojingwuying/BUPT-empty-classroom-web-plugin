# BUPT空教室查询网页插件

一个用于增强 BUPT 官方空教室查询页面的浏览器书签脚本。

本项目不是 Chrome / Edge 扩展，也不是独立 App。它是一个 **bookmarklet 书签脚本**：需要先自行登录官方教务页面，打开空教室查询页面并加载出数据，然后点击浏览器书签运行。

## 功能

* 在当前浏览器页面中增强官方空教室查询结果展示
* 支持按校区、教学楼、节次筛选空教室
* 针对西土城校区，将教学楼归类为教一、教二、教三、教四、未来学习大楼
* 不需要安装 Tampermonkey / 篡改猴
* 不接管登录流程，不保存账号密码
* 不读取 Cookie，不上传用户数据

## 使用前提

请先自行登录官方页面：

```text
http://jwglweixin.bupt.edu.cn/sjd/#
```

登录完成后，进入官方的“空教室查询”页面，并等待官方页面中的空教室数据加载完成。

本插件不会帮你登录，也不会绕过学校系统的认证流程。它只是在你已经打开的官方查询结果页面上做本地展示增强。

## 手机使用方式

### 1. 新建浏览器书签

在手机浏览器中新建一个书签，名称可以写：

```text
BUPT空教室查询网页插件
```

书签网址填写下面这一整行：

```javascript
javascript:(()=>{let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/zhaojingwuying/BUPT-empty-classroom-web-plugin@main/src/emptyclassroom.js';document.body.appendChild(s)})()
```

如果手机浏览器不方便直接编辑 `javascript:` 书签，可以先在电脑浏览器里创建书签，再同步到手机。

### 2. 打开官方页面

在同一个浏览器中打开：

```text
http://jwglweixin.bupt.edu.cn/sjd/#
```

先完成登录，然后进入官方“空教室查询”页面。

### 3. 等待数据加载

请等官方页面中的空教室列表加载完成后，再运行本插件。

如果官方页面还没有显示空教室数据，本插件可能无法读取到结果。

### 4. 点击书签运行

打开浏览器书签，点击刚才保存的“BUPT空教室查询网页插件”。

运行成功后，页面会显示增强版筛选界面。

## 电脑使用方式

电脑端使用方法和手机端一致：

1. 新建一个浏览器书签；
2. 将书签网址改为上面的 `javascript:` 代码；
3. 打开并登录官方教务页面；
4. 进入“空教室查询”页面；
5. 等待官方数据加载完成；
6. 点击书签运行插件。

## 隐私与安全说明

本脚本只在你的浏览器本地运行。

本脚本不会：

* 读取 `document.cookie`
* 读取 `localStorage` / `sessionStorage`
* 保存账号、密码、Cookie、Token
* 主动向第三方服务器上传数据
* 在页面中展示完整接口 URL 或 query 参数

请不要在 Issue、截图、日志或 README 中公开任何包含 Cookie、Token、完整接口 URL、`chBKhbg9` 或其他 query 参数的内容。

## 关于 CDN 加载

上面的书签脚本会从 jsDelivr 加载本仓库中的源码文件：

```text
https://cdn.jsdelivr.net/gh/zhaojingwuying/BUPT-empty-classroom-web-plugin@main/src/emptyclassroom.js
```

这里的 `@main` 表示加载 main 分支的最新代码。自己使用时这样比较方便。

如果你希望固定到某个已审计版本，可以把 `@main` 改成具体 commit 哈希，例如：

```text
https://cdn.jsdelivr.net/gh/zhaojingwuying/BUPT-empty-classroom-web-plugin@某个commit哈希/src/emptyclassroom.js
```

## 常见问题

### 点书签后没反应怎么办？

请确认：

1. 你是在官方空教室查询页面运行书签；
2. 官方页面已经加载出了空教室数据；
3. 书签网址完整保留了开头的 `javascript:`；
4. 浏览器没有自动删掉书签里的脚本内容。

### 为什么不是直接安装 App？

本项目是浏览器书签脚本，不是 Android / iOS App。它的目标是在不安装额外插件的情况下，增强官方网页的显示和筛选体验。

### 为什么不直接做成浏览器扩展？

手机浏览器对扩展支持有限。bookmarklet 的方式更轻量，也更适合手机端临时使用。

### 是否需要输入账号密码？

不需要。本插件不会要求你输入账号密码。请只在官方页面中完成登录。

## 开发与审计

安装依赖：

```bash
npm install
```

生成完整 bookmarklet：

```bash
npm run build
```

生成结果位于：

```text
dist/bookmarklet.txt
```

检查潜在敏感字段：

```bash
npm run check:secrets
```

手动检查网络行为时，重点确认代码只读取当前页面数据和 `/todayClassrooms` 响应，不上传数据。

## 与 Jraaay/EmptyClassroom 的关系

本项目的功能思路参考了 Jraaay/EmptyClassroom，但本仓库不是其 fork，也不包含其 Go 后端或 React 前端源码。

原项目地址：

```text
https://github.com/Jraaay/EmptyClassroom
```

## 免责声明

本项目仅供学习交流和个人页面增强使用，不隶属于学校、教务系统或原项目。

使用者应遵守学校系统使用规范，不得用于高频请求、绕过认证、批量抓取、绕过认证流程或其他不当用途。

## License

MIT
