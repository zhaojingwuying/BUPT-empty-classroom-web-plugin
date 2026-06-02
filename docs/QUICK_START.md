# Quick Start

1. 手机端推荐使用 Via 浏览器，并把 UA / 浏览器标识改成 PC / Chrome PC。
2. 打开并登录：`http://jwglweixin.bupt.edu.cn/sjd/#`
3. 进入官方“空教室查询”页面，等待官方数据加载完成。
4. 点击 bookmarklet 书签运行插件。
5. 默认进入经典主题；需要更适合触屏点击时，点右上角“切换主题”。

推荐书签：

```javascript
javascript:void((()=>{try{document.getElementById('__bupt_empty_classroom_bookmarklet')?.remove();delete window.__BUPT_EMPTY_CLASSROOM_BOOKMARKLET__;window.__BUPT_EMPTY_CLASSROOM_FORCE_RELOAD__=Date.now();window.__BUPT_EMPTY_CLASSROOM_THEME='classic';let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/zhaojingwuying/BUPT-empty-classroom-web-plugin@main/src/emptyclassroom.js?v=20260602-v5-theme-switch&theme=classic';s.onerror=()=>alert('插件加载失败，请检查网络或 jsDelivr 是否能访问');document.documentElement.appendChild(s)}catch(e){alert('插件启动失败：'+e.message)}})())
```
