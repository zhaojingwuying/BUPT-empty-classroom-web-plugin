# 快速开始

## 手机端推荐方式

推荐使用 Via 浏览器：

1. 将 Via 浏览器的 UA / 浏览器标识改成电脑 / PC / Chrome PC。
2. 打开并登录 `http://jwglweixin.bupt.edu.cn/sjd/#`。
3. 进入官方“空教室查询”页面。
4. 等官方空教室数据加载出来。
5. 点击手机版书签。

手机版书签：

```javascript
javascript:void((()=>{window.__BUPT_EMPTY_CLASSROOM_LAYOUT='mobile';let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/zhaojingwuying/BUPT-empty-classroom-web-plugin@main/src/emptyclassroom.js?v=20260602-v3-mobile&layout=mobile';s.onerror=()=>alert('插件加载失败，请检查网络或 jsDelivr 是否能访问');document.documentElement.appendChild(s)})())
```

## 电脑端推荐方式

电脑端正常登录官方页面后，进入空教室查询页面并点击电脑版书签。

电脑版书签：

```javascript
javascript:void((()=>{window.__BUPT_EMPTY_CLASSROOM_LAYOUT='desktop';let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/zhaojingwuying/BUPT-empty-classroom-web-plugin@main/src/emptyclassroom.js?v=20260602-v3-desktop&layout=desktop';s.onerror=()=>alert('插件加载失败，请检查网络或 jsDelivr 是否能访问');document.documentElement.appendChild(s)})())
```
