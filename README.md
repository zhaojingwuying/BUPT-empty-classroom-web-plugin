# BUPT空教室查询网页插件

一个用于增强 BUPT 官方空教室查询页面的浏览器书签脚本。

本项目不是 Chrome / Edge 扩展，也不是独立 App。它是一个 **bookmarklet 书签脚本**：需要先自行登录官方教务页面，打开空教室查询页面并加载出数据，然后点击浏览器书签运行。

## 功能

- 在当前浏览器页面中增强官方空教室查询结果展示
- 支持按校区、教学楼、节次筛选空教室
- 针对西土城校区，将教学楼归类为教一、教二、教三、教四、未来学习大楼
- 默认使用更清爽的 **经典主题**，兼容电脑和手机
- 可点击界面右上角 **切换主题**，切换到更适合触屏操作的 **舒适主题**
- 不需要安装 Tampermonkey / 篡改猴
- 不接管登录流程，不保存账号密码
- 不读取 Cookie，不上传用户数据

## 使用前提

请先自行登录官方页面：

```text
http://jwglweixin.bupt.edu.cn/sjd/#
```

登录完成后，进入官方的“空教室查询”页面，并等待官方页面中的空教室数据加载完成。

本插件不会帮你登录，也不会绕过学校系统的认证流程。它只是在你已经打开的官方查询结果页面上做本地展示增强。

## 推荐使用环境

### 手机端

推荐使用 **Via 浏览器**。

手机端建议流程：

1. 在 Via 浏览器中把 UA / 浏览器标识切换为 **电脑 / PC / Chrome PC**。
2. 打开并登录官方页面：`http://jwglweixin.bupt.edu.cn/sjd/#`
3. 进入官方“空教室查询”页面。
4. 等待官方页面中的空教室数据加载完成。
5. 点击保存好的插件书签。

已知情况：

| 浏览器 | 情况 |
|---|---|
| Via 浏览器 | 推荐使用。UA 改成 PC 后可用 |
| 夸克浏览器 | 可能会把 `javascript:` 书签运行到 `about:blank`，导致白屏 |
| 小米浏览器 | 可能无法保存 `javascript:` 书签，或无法正常打开官方页面 |
| Edge / Chrome 手机端 | 可能无法正常打开官方教务页面，取决于 UA 和网络环境 |

如果点击书签后白屏，可以先用下面这个测试书签检查浏览器是否把脚本运行在当前页面：

```javascript
javascript:void(function(){alert('当前页面是：'+location.href.split('?')[0].split('#')[0])})()
```

如果弹出的地址是 `about:blank`，说明该浏览器没有在当前教务页面执行脚本，请更换支持 bookmarklet 当前页执行的浏览器，例如 Via。

### 电脑端

电脑端推荐使用 Chrome、Edge、Firefox 等现代浏览器。

电脑端不需要修改 UA。正常登录官方页面，进入空教室查询页面后点击书签即可。

## 主题说明

本插件现在有两个显示主题：

| 主题 | 说明 |
|---|---|
| 经典主题 | 默认主题。保留原先类似电脑端的表格布局，实测在电脑和手机 Via 中都比较清爽 |
| 舒适主题 | 触屏优化主题。按钮和结果项更适合手指点击，但相比上一版已经压缩了高度和间距 |

默认打开时使用 **经典主题**。

运行插件后，右上角会显示当前主题，并提供 **切换主题** 按钮。点击后会在经典主题和舒适主题之间切换。

## 推荐书签

新建一个书签，名称可以写：

```text
BUPT空教室查询
```

书签网址填写下面这一整行：

```javascript
javascript:void((()=>{try{document.getElementById('__bupt_empty_classroom_bookmarklet')?.remove();delete window.__BUPT_EMPTY_CLASSROOM_BOOKMARKLET__;window.__BUPT_EMPTY_CLASSROOM_FORCE_RELOAD__=Date.now();window.__BUPT_EMPTY_CLASSROOM_THEME='classic';let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/zhaojingwuying/BUPT-empty-classroom-web-plugin@main/src/emptyclassroom.js?v=20260602-v5-theme-switch&theme=classic';s.onerror=()=>alert('插件加载失败，请检查网络或 jsDelivr 是否能访问');document.documentElement.appendChild(s)}catch(e){alert('插件启动失败：'+e.message)}})())
```

这个书签默认打开 **经典主题**。如果想尝试舒适主题，可以打开插件后点击右上角 **切换主题**。

## 舒适主题直达书签

如果你更喜欢触屏优化的舒适主题，也可以另外建一个书签：

```text
BUPT空教室查询-舒适主题
```

书签网址填写下面这一整行：

```javascript
javascript:void((()=>{try{document.getElementById('__bupt_empty_classroom_bookmarklet')?.remove();delete window.__BUPT_EMPTY_CLASSROOM_BOOKMARKLET__;window.__BUPT_EMPTY_CLASSROOM_FORCE_RELOAD__=Date.now();window.__BUPT_EMPTY_CLASSROOM_THEME='comfortable';let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/zhaojingwuying/BUPT-empty-classroom-web-plugin@main/src/emptyclassroom.js?v=20260602-v5-theme-switch&theme=comfortable';s.onerror=()=>alert('插件加载失败，请检查网络或 jsDelivr 是否能访问');document.documentElement.appendChild(s)}catch(e){alert('插件启动失败：'+e.message)}})())
```

## 如何在手机 Via 浏览器中添加书签

1. 先随便打开一个网页。
2. 添加书签，名称写 `BUPT空教室查询`。
3. 保存后进入书签管理。
4. 编辑刚才的书签。
5. 把网址改成上面的“推荐书签”整行代码。
6. 保存。
7. 之后进入官方空教室页面并加载出数据后，点击这个书签运行。

注意：书签网址必须完整保留开头的 `javascript:`，不能只复制后半截。

## 使用步骤

### 手机端

1. 用 Via 浏览器打开设置，将 UA / 浏览器标识改成 **电脑 / PC / Chrome PC**。
2. 访问 `http://jwglweixin.bupt.edu.cn/sjd/#`。
3. 自行完成登录。
4. 进入官方“空教室查询”页面。
5. 等待官方页面中的空教室数据加载完成。
6. 点击 `BUPT空教室查询` 书签。
7. 默认会进入经典主题。
8. 如果想使用更适合触屏点击的布局，点击右上角 **切换主题**。

### 电脑端

1. 访问 `http://jwglweixin.bupt.edu.cn/sjd/#`。
2. 自行完成登录。
3. 进入官方“空教室查询”页面。
4. 等待官方页面中的空教室数据加载完成。
5. 点击 `BUPT空教室查询` 书签。
6. 默认会进入经典主题。

## 常见问题

### 点书签后提示没读到数据怎么办？

请确认：

1. 你已经进入官方“空教室查询”页面；
2. 官方页面中的空教室列表已经加载完成；
3. 不是在登录页、首页或空白页运行插件；
4. 可以先切换一次校区，让官方页面重新加载数据，然后再点插件书签。

### 点书签后白屏怎么办？

先用测试书签检查当前浏览器是否支持 bookmarklet 在当前页面执行：

```javascript
javascript:void(function(){alert('当前页面是：'+location.href.split('?')[0].split('#')[0])})()
```

如果弹出的是 `about:blank`，说明浏览器没有在当前教务页面运行脚本，请换 Via 浏览器。

如果弹出的是官方教务页面地址，但插件仍然异常，可以刷新页面，等官方数据加载完成后再试。

### 手机页面看起来太小怎么办？

默认的经典主题会保留表格布局，在手机 Via 中通常比较清爽。如果觉得按钮不够好点，可以点击右上角 **切换主题** 切到舒适主题。

舒适主题会让按钮和结果卡片更适合触屏，但页面会比经典主题占用更多垂直空间。

### 为什么手机要把 UA 改成 PC？

官方页面在部分手机浏览器中可能直接报服务器错误。实测将 UA / 浏览器标识改成 PC 后，Via 浏览器可以正常打开并登录官方页面。

### 为什么不是直接安装 App？

本项目是浏览器书签脚本，不是 Android / iOS App。它的目标是在不安装额外插件的情况下，增强官方网页的显示和筛选体验。

### 是否需要输入账号密码？

不需要。本插件不会要求你输入账号密码。请只在官方页面中完成登录。

## 隐私与安全说明

本脚本只在你的浏览器本地运行。

本脚本不会：

- 读取 `document.cookie`
- 读取 `localStorage` / `sessionStorage`
- 保存账号、密码、Cookie、Token
- 主动向第三方服务器上传数据
- 在页面中展示完整接口 URL 或 query 参数

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

更新代码后，如果 jsDelivr 缓存没有立即刷新，可以访问下面的地址清理缓存：

```text
https://purge.jsdelivr.net/gh/zhaojingwuying/BUPT-empty-classroom-web-plugin@main/src/emptyclassroom.js
```

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
