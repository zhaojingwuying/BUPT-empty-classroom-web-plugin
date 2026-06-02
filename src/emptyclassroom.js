(function(){
  'use strict';
  var W=window,D=document;
  var VERSION='2026-06-02-public-v4-mobile-force';
  var SCRIPT_LAYOUT=(function(){try{var src=D.currentScript&&D.currentScript.src;var q=src?new URL(src,location.href).searchParams.get('layout'):'';var g=String(W.__BUPT_EMPTY_CLASSROOM_LAYOUT||'');var v=String(g||q||'auto').toLowerCase();return /^(auto|mobile|desktop)$/.test(v)?v:'auto';}catch(e){return 'auto';}})();
  var EXISTING=W.__BUPT_EMPTY_CLASSROOM_BOOKMARKLET__;
  if(EXISTING&&EXISTING.show&&!W.__BUPT_EMPTY_CLASSROOM_FORCE_RELOAD__){
    if(EXISTING.version===VERSION){
      if(EXISTING.setLayout)EXISTING.setLayout(SCRIPT_LAYOUT);
      EXISTING.show();return;
    }
    try{var oldRoot=D.getElementById('__bupt_empty_classroom_bookmarklet');if(oldRoot)oldRoot.remove();}catch(e){}
  }
  if(W.__BUPT_EMPTY_CLASSROOM_FORCE_RELOAD__){try{var oldRoot2=D.getElementById('__bupt_empty_classroom_bookmarklet');if(oldRoot2)oldRoot2.remove();}catch(e){}}
  var TIMES=[
    ['01','08:00','08:45'],['02','08:50','09:35'],['03','09:50','10:35'],['04','10:40','11:25'],['05','11:30','12:15'],
    ['06','13:00','13:45'],['07','13:50','14:35'],['08','14:45','15:30'],['09','15:40','16:25'],['10','16:35','17:20'],
    ['11','17:25','18:10'],['12','18:30','19:15'],['13','19:20','20:05'],['14','20:10','20:55']
  ];
  var state={
    nativeVm:null,
    campusList:[],
    selectedCampusId:'',
    selectedCampusName:'',
    dataByCampus:{},
    selectedBuildings:[],
    selectedTimes:[],
    showClassTime:true,
    canSelectAllDay:false,
    loading:false,
    error:'',
    lastSource:'',
    layout:SCRIPT_LAYOUT
  };
  function $(q,root){return (root||D).querySelector(q)}
  function $all(q,root){return Array.prototype.slice.call((root||D).querySelectorAll(q))}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function safeJson(s){try{return JSON.parse(s)}catch(e){return null}}
  function safeSource(url){try{var u=new URL(String(url),location.href);return u.origin+u.pathname}catch(e){return '接口返回'}}
  function pad(n){return n<10?'0'+n:String(n)}
  function nowHHMM(){var d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())}
  function norm(s){return String(s||'').replace(/\s+/g,'').toLowerCase()}
  function roomSort(a,b){return sortKey(a.name).localeCompare(sortKey(b.name),'zh-CN',{numeric:true})}
  function sortKey(s){return String(s||'').replace(/(\d+)/g,function(_,n){return String(parseInt(n,10)).padStart(6,'0')})}
  function detectMobileLayout(){
    try{
      if(state.layout==='mobile')return true;
      if(state.layout==='desktop')return false;
      var sw=Math.min(W.screen&&W.screen.width||9999,W.screen&&W.screen.height||9999);
      var vv=(W.visualViewport&&W.visualViewport.width)||W.innerWidth||D.documentElement.clientWidth||9999;
      return sw<=760||vv<=760;
    }catch(e){return false;}
  }
  function ensureViewportForMobile(){
    if(!detectMobileLayout())return;
    try{
      var m=$('meta[name=\"viewport\"]',D);
      if(!m){m=D.createElement('meta');m.name='viewport';(D.head||D.documentElement).appendChild(m);}
      if(!m.getAttribute('data-ec-original'))m.setAttribute('data-ec-original',m.getAttribute('content')||'');
      m.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,user-scalable=yes,viewport-fit=cover');
    }catch(e){}
  }
  function updateLayoutClass(root){
    if(!root)return;
    root.className=detectMobileLayout()?'ec-mobile':'ec-desktop';
    var b=$('#ec-layout',root); if(b)b.textContent=detectMobileLayout()?'电脑版':'手机版';
  }
  function setLayout(layout){
    layout=String(layout||'auto').toLowerCase();
    if(!/^(auto|mobile|desktop)$/.test(layout))layout='auto';
    state.layout=layout;
    if(layout==='mobile')ensureViewportForMobile();
    render();
  }
  var WEST_BUILDINGS=['1','2','3','4','未来学习大楼'];
  function isWestCampusName(name){return /西土城/.test(String(name||''));}
  function buildingLabel(b){
    b=String(b||'未分组');
    if(b==='1')return '教一';
    if(b==='2')return '教二';
    if(b==='3')return '教三';
    if(b==='4')return '教四';
    return /^\d+$/.test(b)?b+'号楼':b;
  }
  function parseRoom(raw,campusName){
    raw=String(raw||'').trim(); if(!raw)return null;
    var cap=0,m=raw.match(/\((\d+)\)\s*$/); if(m)cap=parseInt(m[1],10)||0;
    var base=raw.replace(/\((\d+)\)\s*$/,'').trim(); if(!base)return null;
    var building='未分组',room=base,name=base;
    if(isWestCampusName(campusName)){
      // 西土城只允许这五类：教一、教二、教三、教四、未来学习大楼。
      // 2-201 -> building=2, room=201；未来学习大楼-217-218 -> building=未来学习大楼, room=217-218。
      var mWest=base.match(/^([1-4])-(.+)$/);
      var mFuture=base.match(/^未来学习大楼-(.+)$/);
      if(mWest){building=mWest[1];room=mWest[2];name=building+'-'+room;}
      else if(mFuture){building='未来学习大楼';room=mFuture[1];name='未来学习大楼-'+room;}
      else{return null;}
    }else{
      // 沙河等校区：教学实验综合楼-N104、智慧教学楼-105，取第一个连字符前的部分作为教学楼。
      var p=base.indexOf('-');
      if(p>0){building=base.slice(0,p).trim()||'未分组';room=base.slice(p+1).trim()||base;name=building+'-'+room;}
    }
    return {key:name,building:building,buildingLabel:buildingLabel(building),room:room,name:name,size:cap||'无数据',type:'无数据',can_trust:true,free:new Set()};
  }
  function sectionIndex(row,pos){var n=parseInt(String(row.NODENAME||'').replace(/\D/g,''),10);return n>=1&&n<=14?n-1:pos}
  function buildCampusData(rows,campusName){
    var rooms={},buildingsMap={},sections=[];
    (rows||[]).forEach(function(row,pos){
      var idx=sectionIndex(row,pos); var free=[];
      String(row.CLASSROOMS||'').split(',').forEach(function(x){var r=parseRoom(x,campusName); if(!r)return; if(!rooms[r.key])rooms[r.key]=r; rooms[r.key].free.add(idx); buildingsMap[r.building]=true; free.push(r.key);});
      sections.push({idx:idx,name:String(row.NODENAME||idx+1),time:String(row.NODETIME||''),free:free});
    });
    sections.sort(function(a,b){return a.idx-b.idx});
    var buildings;
    if(isWestCampusName(campusName)){
      buildings=WEST_BUILDINGS.slice();
    }else{
      buildings=Object.keys(buildingsMap).sort(function(a,b){return sortKey(a).localeCompare(sortKey(b),'zh-CN',{numeric:true})});
    }
    return {sections:sections,rooms:rooms,buildings:buildings,updateAt:new Date().toLocaleString()};
  }
  function findVm(){
    var nodes=$all('*');
    for(var i=0;i<nodes.length;i++){
      var v=nodes[i].__vue__,guard=0;
      while(v&&guard++<12){
        if(Array.isArray(v.campusList)&&typeof v.getRestClassrooms==='function')return v;
        if(Array.isArray(v.jcList)&&v.jcList.length&&v.jcList[0]&&v.jcList[0].CLASSROOMS)return v;
        v=v.$parent;
      }
    }
    return null;
  }
  function syncFromVue(){
    var v=findVm(); if(!v)return false;
    state.nativeVm=v;
    if(Array.isArray(v.campusList)&&v.campusList.length){
      state.campusList=v.campusList.map(function(c){return {id:String(c.campusId),name:String(c.campusName||c.name||c.campusId)}});
      state.selectedCampusId=String(v.radio||state.selectedCampusId||state.campusList[0].id);
      var hit=state.campusList.filter(function(c){return c.id===state.selectedCampusId})[0];
      state.selectedCampusName=hit?hit.name:(state.selectedCampusName||'当前校区');
    }
    if(Array.isArray(v.jcList)&&v.jcList.length&&v.jcList[0]&&v.jcList[0].CLASSROOMS){
      var name=state.selectedCampusName||'当前校区';
      state.dataByCampus[name]=buildCampusData(v.jcList,name);
      state.lastSource='官方页面 Vue 数据';
      ensureDefaultsForCampus(name);
      state.error='';
      return true;
    }
    return false;
  }
  function ingest(text,url){
    var obj=safeJson(text); if(!obj||!Array.isArray(obj.data))return false;
    syncCampusOnly();
    var name=state.selectedCampusName||'当前校区';
    state.dataByCampus[name]=buildCampusData(obj.data,name);
    state.lastSource=safeSource(url);
    ensureDefaultsForCampus(name);
    state.loading=false;state.error='';render();return true;
  }
  function syncCampusOnly(){
    var v=state.nativeVm||findVm(); if(!v)return;
    state.nativeVm=v;
    if(Array.isArray(v.campusList)&&v.campusList.length){
      state.campusList=v.campusList.map(function(c){return {id:String(c.campusId),name:String(c.campusName||c.name||c.campusId)}});
      state.selectedCampusId=String(v.radio||state.selectedCampusId||state.campusList[0].id);
      var hit=state.campusList.filter(function(c){return c.id===state.selectedCampusId})[0];
      if(hit)state.selectedCampusName=hit.name;
    }
  }
  function currentData(){return state.dataByCampus[state.selectedCampusName]||null}
  function ensureDefaultsForCampus(name){
    var data=state.dataByCampus[name]; if(!data)return;
    state.selectedBuildings=state.selectedBuildings.filter(function(b){return data.buildings.indexOf(b)>=0});
    if(!state.selectedBuildings.length&&data.buildings.length)state.selectedBuildings=data.buildings.slice();
    state.selectedTimes=state.selectedTimes.filter(function(i){return i>=0&&i<14});
    if(!state.selectedTimes.length){var idx=nextClassIndex(); state.selectedTimes=[idx];}
  }
  function nextClassIndex(){var n=nowHHMM();for(var i=0;i<TIMES.length;i++){if(TIMES[i][2]>=n)return i;}return 0;}
  function disabledTime(i){
    if(state.canSelectAllDay)return false;
    var n=nowHHMM(); return TIMES[i][2]<n && TIMES[13][2]>=n;
  }
  function selectedTimeText(){return state.selectedTimes.slice().sort(function(a,b){return a-b}).map(function(i){return TIMES[i][0]}).join(', ')}
  function getResults(){
    var data=currentData(); if(!data||!state.selectedBuildings.length||!state.selectedTimes.length)return [];
    var res=[];
    Object.keys(data.rooms).forEach(function(k){
      var r=data.rooms[k]; if(state.selectedBuildings.indexOf(r.building)<0)return;
      for(var i=0;i<state.selectedTimes.length;i++){if(!r.free.has(state.selectedTimes[i]))return;}
      var empty=[]; for(var j=0;j<14;j++)if(r.free.has(j))empty.push(j);
      res.push({name:r.name,size:r.size,type:r.type,can_trust:r.can_trust,empty_class_time:empty,building:r.building});
    });
    return res.sort(roomSort);
  }
  function timeRangeStr(list){
    if(!list||!list.length)return '无';
    list=list.slice().sort(function(a,b){return a-b});
    var parts=[],start=list[0],prev=list[0];
    function push(a,b){parts.push(TIMES[a][1]+'-'+TIMES[b][2]);}
    for(var i=1;i<list.length;i++){if(list[i]===prev+1){prev=list[i];}else{push(start,prev);start=prev=list[i];}}
    push(start,prev); return parts.join(', ');
  }
  function createRoot(){
    ensureViewportForMobile();
    var old=$('#__bupt_empty_classroom_bookmarklet'); if(old){updateLayoutClass(old);return old;}
    var root=D.createElement('div'); root.id='__bupt_empty_classroom_bookmarklet'; updateLayoutClass(root);
    root.innerHTML='<style>'+cssText()+'</style><div class="ec-app"><div class="ec-top"><button class="ec-link" id="ec-back">返回官方页面</button><button class="ec-link" id="ec-refresh">重读数据</button><button class="ec-link" id="ec-layout">手机版</button><button class="ec-link" id="ec-close">关闭</button></div><div class="ec-title"><div class="ec-logo">BUPT</div><h1>BUPT 空教室查询</h1><p>数据来自你已打开的官方空闲教室页面；本脚本不读取 Cookie，不保存账号密码，不上传数据。西土城仅教一/教二/教三/教四/未来学习大楼。</p></div><div id="ec-main"></div><div class="ec-footer">官方页面增强显示 · '+esc(VERSION)+'</div></div>';
    D.body.appendChild(root);
    $('#ec-back',root).onclick=function(){root.style.display='none'};
    $('#ec-close',root).onclick=function(){root.remove()};
    $('#ec-refresh',root).onclick=function(){state.error=''; if(!syncFromVue())state.error='还是没有读到官方数据。请确认官方空闲教室页面已经加载完成。'; render();};
    $('#ec-layout',root).onclick=function(){setLayout(detectMobileLayout()?'desktop':'mobile')};
    updateLayoutClass(root);
    return root;
  }
  function cssText(){return ''+
    '#__bupt_empty_classroom_bookmarklet{position:fixed;top:0;right:0;bottom:0;left:0;inset:0;z-index:2147483647;background:#fff;color:#111;overflow:auto;-webkit-overflow-scrolling:touch;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",Arial,sans-serif;font-size:14px;line-height:1.45;box-sizing:border-box;}'+
    '#__bupt_empty_classroom_bookmarklet *{box-sizing:border-box;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-app{max-width:960px;margin:0 auto;padding:18px 14px 36px;text-align:center;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-top{position:sticky;top:0;z-index:5;background:rgba(255,255,255,.94);backdrop-filter:blur(6px);display:flex;justify-content:flex-end;gap:8px;padding:8px 0;flex-wrap:wrap;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-logo{width:86px;height:86px;border-radius:24px;background:linear-gradient(135deg,#1677ff,#69b1ff);color:#fff;margin:8px auto;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:22px;box-shadow:0 8px 24px rgba(22,119,255,.22)}'+
    '#__bupt_empty_classroom_bookmarklet h1{font-size:26px;margin:8px 0 4px;font-weight:700;}#__bupt_empty_classroom_bookmarklet p{margin:0;color:#6b7280}'+
    '#__bupt_empty_classroom_bookmarklet .ec-card{border:1px solid #e5e7eb;border-radius:10px;background:#fff;margin:14px auto;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,.04);text-align:left;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-row{margin:10px 0;text-align:center;}#__bupt_empty_classroom_bookmarklet .ec-label{font-weight:600;margin-right:8px;color:#374151;}'+
    '#__bupt_empty_classroom_bookmarklet button{font-family:inherit;cursor:pointer;transition:.15s;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-link{border:1px solid #d9d9d9;background:#fff;color:#1677ff;border-radius:6px;padding:5px 10px;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-btn{border:1px solid #d9d9d9;background:#fff;color:#111;border-radius:6px;min-width:6em;margin:3px;padding:6px 10px;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-btn.active{background:#1677ff;color:#fff;border-color:#1677ff;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-time{width:45px;height:45px;border:1px solid #d9d9d9;background:#fff;border-radius:6px;margin:2px;padding:0;line-height:1.05;vertical-align:top;font-size:12px;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-time b{font-size:14px;}#__bupt_empty_classroom_bookmarklet .ec-time.active{background:#1677ff;color:#fff;border-color:#1677ff;}#__bupt_empty_classroom_bookmarklet .ec-time:disabled{opacity:.42;cursor:not-allowed;background:#f5f5f5;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-small{border:1px solid #d9d9d9;background:#fff;border-radius:6px;margin:3px;padding:6px 10px;}#__bupt_empty_classroom_bookmarklet .ec-small.active{background:#1677ff;color:#fff;border-color:#1677ff;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-summary{color:#6b7280;text-align:center;margin:10px 0;}'+
    '#__bupt_empty_classroom_bookmarklet table{width:100%;border-collapse:collapse;background:#fff;}#__bupt_empty_classroom_bookmarklet th,#__bupt_empty_classroom_bookmarklet td{border-bottom:1px solid #f0f0f0;padding:10px 8px;text-align:center;}#__bupt_empty_classroom_bookmarklet th{font-weight:600;background:#fafafa;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-tag{display:inline-block;border-radius:4px;padding:1px 7px;background:#e6f4ff;color:#0958d9;border:1px solid #91caff;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px;}#__bupt_empty_classroom_bookmarklet .ec-room-card{width:100%;display:block;text-align:left;border:1px solid #e5e7eb;background:#fff;border-radius:10px;padding:12px;color:#111;}#__bupt_empty_classroom_bookmarklet .ec-room-card:active{background:#f5faff;border-color:#1677ff;}#__bupt_empty_classroom_bookmarklet .ec-room-name{display:block;font-size:17px;font-weight:700;color:#111;}#__bupt_empty_classroom_bookmarklet .ec-room-meta,#__bupt_empty_classroom_bookmarklet .ec-room-time{display:block;margin-top:4px;color:#6b7280;font-size:12px;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-empty{padding:26px;color:#888;text-align:center;}#__bupt_empty_classroom_bookmarklet .ec-warn{background:#fff7e6;border:1px solid #ffd591;border-radius:8px;padding:12px;color:#8a5a00;text-align:left;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-modal-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483647;display:flex;align-items:center;justify-content:center;}#__bupt_empty_classroom_bookmarklet .ec-modal{width:min(520px,92vw);background:#fff;border-radius:10px;padding:18px;text-align:left;box-shadow:0 10px 36px rgba(0,0,0,.28);}#__bupt_empty_classroom_bookmarklet .ec-desc{display:grid;grid-template-columns:96px 1fr;border-top:1px solid #f0f0f0;border-left:1px solid #f0f0f0;margin-top:12px;}#__bupt_empty_classroom_bookmarklet .ec-desc div{padding:10px;border-right:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;}#__bupt_empty_classroom_bookmarklet .ec-desc .k{background:#fafafa;font-weight:600;color:#555;}'+
    '#__bupt_empty_classroom_bookmarklet .ec-footer{text-align:center;color:#999;margin-top:18px;font-size:12px;}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile{font-size:16px;-webkit-text-size-adjust:100%;text-size-adjust:100%;}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-app{width:100vw;max-width:none;margin:0;padding:10px 10px calc(26px + env(safe-area-inset-bottom));text-align:left;}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-top{justify-content:flex-start;gap:6px;padding:8px 0;overflow-x:auto;flex-wrap:nowrap;}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-link{min-height:34px;padding:6px 10px;border-radius:8px;white-space:nowrap;}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-title{text-align:center;padding:2px 2px 6px;}#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-logo{width:52px;height:52px;border-radius:14px;margin:4px auto 6px;font-size:14px;}#__bupt_empty_classroom_bookmarklet.ec-mobile h1{font-size:24px;margin:4px 0 3px;}#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-title p{font-size:12px;line-height:1.45;}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-card{margin:10px 0;padding:12px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,.05);}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-row{display:flex;align-items:flex-start;justify-content:flex-start;flex-wrap:wrap;gap:6px;margin:12px 0;text-align:left;}#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-label{display:block;width:100%;margin:0 0 2px;color:#111;font-size:14px;}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-btn,#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-small{flex:1 1 calc(50% - 6px);min-width:0;margin:0;padding:12px 8px;border-radius:10px;min-height:44px;font-size:15px;}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-time{width:calc((100% - 12px)/3);height:64px;margin:0;border-radius:10px;font-size:12px;line-height:1.15;}#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-time b{font-size:15px;}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-summary{text-align:left;line-height:1.75;margin:0 0 10px;font-size:13px;}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-list{display:grid;grid-template-columns:1fr;gap:8px;}#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-room-card{padding:14px 14px;border-radius:13px;min-height:78px;}#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-room-name{font-size:18px;}#__bupt_empty_classroom_bookmarklet.ec-mobile table{font-size:13px;}#__bupt_empty_classroom_bookmarklet.ec-mobile th,#__bupt_empty_classroom_bookmarklet.ec-mobile td{padding:8px 4px;}'+
    '#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-modal-mask{align-items:flex-end;}#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-modal{width:100%;max-height:82vh;overflow:auto;border-radius:16px 16px 0 0;padding:16px;}#__bupt_empty_classroom_bookmarklet.ec-mobile .ec-desc{grid-template-columns:84px 1fr;}'+
    '@media(max-width:700px){#__bupt_empty_classroom_bookmarklet .ec-app{padding:10px;}#__bupt_empty_classroom_bookmarklet .ec-card{padding:12px;}#__bupt_empty_classroom_bookmarklet th,#__bupt_empty_classroom_bookmarklet td{padding:8px 4px;font-size:12px;}}';}
  function render(){
    var root=createRoot(); updateLayoutClass(root); root.style.display='block'; var main=$('#ec-main',root);
    syncCampusOnly(); var data=currentData();
    var html='';
    if(state.error)html+='<div class="ec-card"><div class="ec-warn">'+esc(state.error)+'</div></div>';
    if(!data){
      html+='<div class="ec-card"><div class="ec-warn">还没抓到官方空教室数据。先返回官方页面，确认能看到官方空闲教室列表，再点“重读数据”；或切换一次西土城/沙河校区。</div></div>';
      main.innerHTML=html;return;
    }
    html+='<div class="ec-card"><div class="ec-row"><span class="ec-label">校区</span>'+campusButtons()+'</div><div class="ec-row"><span class="ec-label">日期</span><button class="ec-small active">今天</button></div><div class="ec-row"><span class="ec-label">教学楼</span><button class="ec-small" data-action="all-buildings">全选</button><button class="ec-small" data-action="none-buildings">取消全选</button>'+buildingButtons(data)+'</div><div class="ec-row"><span class="ec-label">节次</span><button class="ec-small" data-action="all-times">全选</button><button class="ec-small" data-action="none-times">取消全选</button>'+timeButtons()+'</div><div class="ec-row"><button class="ec-small '+(state.showClassTime?'active':'')+'" data-action="toggle-time-label">显示课程时间</button><button class="ec-small '+(state.canSelectAllDay?'active':'')+'" data-action="toggle-all-day">允许选择已过节次</button></div></div>';
    var rows=getResults();
    html+='<div class="ec-card"><div class="ec-summary">校区：<b>'+esc(state.selectedCampusName)+'</b>　教学楼：<b>'+state.selectedBuildings.length+'</b> 个　节次：<b>'+esc(selectedTimeText()||'未选择')+'</b>　匹配：<b>'+rows.length+'</b> 间　来源：'+esc(state.lastSource||'官方页面')+'</div>';
    if(!state.selectedBuildings.length||!state.selectedTimes.length)html+='<div class="ec-empty">请选择教学楼和节次</div>';
    else if(!rows.length)html+='<div class="ec-empty">没有找到符合条件的空教室</div>';
    else html+=tableHtml(rows);
    html+='</div>';
    main.innerHTML=html; bind(root,rows);
  }
  function campusButtons(){
    var list=state.campusList.length?state.campusList:[{id:state.selectedCampusId||'current',name:state.selectedCampusName||'当前校区'}];
    return list.map(function(c){return '<button class="ec-btn '+(c.id===state.selectedCampusId?'active':'')+'" data-campus="'+esc(c.id)+'">'+esc(c.name)+'</button>'}).join('');
  }
  function buildingButtons(data){return data.buildings.map(function(b){return '<button class="ec-btn '+(state.selectedBuildings.indexOf(b)>=0?'active':'')+'" data-building="'+esc(b)+'">'+esc(buildingLabel(b))+'</button>'}).join('')||'<span style="color:#999">未解析到教学楼</span>';}
  function timeButtons(){return TIMES.map(function(t,i){var dis=disabledTime(i),act=state.selectedTimes.indexOf(i)>=0;return '<button class="ec-time '+(act?'active':'')+'" data-time="'+i+'" '+(dis?'disabled':'')+'>'+(state.showClassTime?'<span>'+esc(t[1])+'</span><br>':'')+'<b>'+esc(t[0])+'</b>'+(state.showClassTime?'<br><span>'+esc(t[2])+'</span>':'')+'</button>'}).join('');}
  function tableHtml(rows){
    if(detectMobileLayout())return '<div class="ec-list">'+rows.map(function(r,i){return '<button class="ec-room-card" data-row="'+i+'"><span class="ec-room-name">'+esc(r.name)+'</span><span class="ec-room-meta">座位数：'+esc(r.size)+' · 类型：'+esc(r.type)+' · 来源：教务</span><span class="ec-room-time">空闲：'+esc(timeRangeStr(r.empty_class_time))+'</span></button>';}).join('')+'</div>';
    return '<table><thead><tr><th>教室</th><th>座位数</th><th>类型</th><th>来源</th></tr></thead><tbody>'+rows.map(function(r,i){return '<tr><td><button class="ec-link" data-row="'+i+'">'+esc(r.name)+'</button></td><td>'+esc(r.size)+'</td><td>'+esc(r.type)+'</td><td><span class="ec-tag">教务</span></td></tr>'}).join('')+'</tbody></table>';
  }
  function bind(root,rows){
    $all('[data-campus]',root).forEach(function(b){b.onclick=function(){switchCampus(this.getAttribute('data-campus'))}});
    $all('[data-building]',root).forEach(function(b){b.onclick=function(){var x=this.getAttribute('data-building'),i=state.selectedBuildings.indexOf(x); if(i>=0)state.selectedBuildings.splice(i,1); else state.selectedBuildings.push(x); render();}});
    $all('[data-time]',root).forEach(function(b){b.onclick=function(){var x=parseInt(this.getAttribute('data-time'),10),i=state.selectedTimes.indexOf(x); if(i>=0)state.selectedTimes.splice(i,1); else state.selectedTimes.push(x); state.selectedTimes.sort(function(a,b){return a-b}); render();}});
    $all('[data-row]',root).forEach(function(b){b.onclick=function(){showInfo(rows[parseInt(this.getAttribute('data-row'),10)])}});
    $all('[data-action]',root).forEach(function(b){b.onclick=function(){action(this.getAttribute('data-action'))}});
  }
  function action(a){var data=currentData(); if(!data)return; if(a==='all-buildings')state.selectedBuildings=data.buildings.slice(); if(a==='none-buildings')state.selectedBuildings=[]; if(a==='all-times'){state.selectedTimes=[]; for(var i=0;i<14;i++)if(!disabledTime(i))state.selectedTimes.push(i);} if(a==='none-times')state.selectedTimes=[]; if(a==='toggle-time-label')state.showClassTime=!state.showClassTime; if(a==='toggle-all-day')state.canSelectAllDay=!state.canSelectAllDay; render();}
  function switchCampus(id){
    syncCampusOnly(); var hit=state.campusList.filter(function(c){return c.id===id})[0]; if(!hit)return;
    state.selectedCampusId=id; state.selectedCampusName=hit.name; state.selectedBuildings=[]; state.selectedTimes=[]; state.error=''; state.loading=true; render();
    var v=state.nativeVm||findVm();
    try{
      if(v){v.radio=id; var p=v.getRestClassrooms&&v.getRestClassrooms(id); if(p&&p.then)p.then(function(){setTimeout(function(){syncFromVue();state.loading=false;render()},120)}).catch(function(e){state.loading=false;state.error='切换校区失败：'+(e&&e.message||e);render();}); else setTimeout(function(){syncFromVue();state.loading=false;render()},600);}
    }catch(e){state.loading=false;state.error='切换校区失败：'+e.message;render();}
  }
  function showInfo(r){if(!r)return; var mask=D.createElement('div'); mask.className='ec-modal-mask'; mask.innerHTML='<div class="ec-modal"><div style="display:flex;gap:8px;align-items:center"><h2 style="margin:0;flex:1;font-size:20px">'+esc(r.name)+'</h2><button class="ec-link" data-close>关闭</button></div><div class="ec-desc"><div class="k">座位数</div><div>'+esc(r.size)+'</div><div class="k">类型</div><div>'+esc(r.type)+'</div><div class="k">空闲时间</div><div>'+esc(timeRangeStr(r.empty_class_time))+'</div><div class="k">数据来源</div><div>教务（可信）</div></div></div>'; createRoot().appendChild(mask); $('[data-close]',mask).onclick=function(){mask.remove()}; mask.onclick=function(e){if(e.target===mask)mask.remove();};}
  function installHooks(){
    if(W.__BUPT_EMPTY_CLASSROOM_BOOKMARKLET_HOOKED__)return; W.__BUPT_EMPTY_CLASSROOM_BOOKMARKLET_HOOKED__=true;
    var xo=XMLHttpRequest.prototype.open,xs=XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open=function(m,u){this.__ec_url=u;return xo.apply(this,arguments)};
    XMLHttpRequest.prototype.send=function(b){this.addEventListener('load',function(){var u=String(this.responseURL||this.__ec_url||''); if(u.indexOf('/todayClassrooms')>=0)ingest(String(this.responseText||''),u);});return xs.apply(this,arguments)};
    if(W.fetch){var of=W.fetch; W.fetch=function(){var args=arguments;return of.apply(this,args).then(function(r){var u=String(r.url||args[0]||''); if(u.indexOf('/todayClassrooms')>=0)r.clone().text().then(function(t){ingest(t,u)}).catch(function(){}); return r;});};}
  }
  function showFatal(e){
    var msg=(e&&(e.stack||e.message))?String(e.stack||e.message):String(e||'未知错误');
    var root=$('#__bupt_empty_classroom_bookmarklet');
    if(!root){root=D.createElement('div');root.id='__bupt_empty_classroom_bookmarklet';D.body.appendChild(root);}
    root.style.cssText='position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483647;background:#fff;color:#111;overflow:auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",Arial,sans-serif;padding:16px;box-sizing:border-box;';
    root.innerHTML='<div style="max-width:760px;margin:0 auto;border:1px solid #ffd591;background:#fff7e6;border-radius:10px;padding:14px;line-height:1.6"><h2 style="margin:0 0 10px;font-size:20px">插件运行出错</h2><p>插件已经加载，但在当前手机浏览器中执行失败。请先点下面按钮返回官方页面，再把这段错误信息反馈给维护者。</p><pre style="white-space:pre-wrap;word-break:break-all;background:#fff;border:1px solid #eee;padding:10px;border-radius:8px;max-height:260px;overflow:auto">'+esc(msg)+'</pre><button data-close style="border:1px solid #d9d9d9;background:#fff;color:#1677ff;border-radius:6px;padding:7px 12px">返回官方页面</button></div>';
    var btn=$('[data-close]',root); if(btn)btn.onclick=function(){root.remove();};
  }
  function show(){
    try{
      installHooks();
      if(detectMobileLayout())ensureViewportForMobile();
      createRoot();
      if(!syncFromVue())state.error='没读到官方页面数据，请先进入官方“空闲教室”页面并确认表格已显示。';
      render();
    }catch(e){showFatal(e);}
  }
  W.__BUPT_EMPTY_CLASSROOM_BOOKMARKLET__={version:VERSION,show:show,scan:syncFromVue,ingest:ingest,setLayout:setLayout};
  show();
})();
