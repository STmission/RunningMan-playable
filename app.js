(() => {
  const games = [
    ['color-judge','颜色闪电','反应','⚡','#ff6b38','看字辨色 · 45 秒 · ★★'],
    ['memory-sequence','记忆翻牌','记忆','▣','#5878f4','极限记忆 · 60 秒 · ★★★'],
    ['route-chase','路线追击','追逐','⌁','#ffd63f','地图追逐 · 120 秒 · ★★★'],
    ['identity-deduction','身份追踪战','推理','◆','#f4485c','隐藏身份 · 90 秒 · ★★★★'],
    ['team-order','默契排序','协作','●●●','#27c98f','团队默契 · 75 秒 · ★★★'],
    ['relay-lockbox','接力密码箱','记忆','▣','#3084ff','数字记忆 · 60 秒 · ★★★'],
    ['true-false-mission','真假任务卡','推理','◇','#8a69ff','真假判断 · 60 秒 · ★★'],
    ['seat-rush','抢位大作战','反应','↗','#ff9d36','反应抢位 · 45 秒 · ★★★'],
    ['vanishing-object','物品消失了','记忆','⌕','#c9ff39','观察找物 · 60 秒 · ★★★'],
    ['action-telephone','动作传声筒','协作','〰','#ff5d7e','动作传递 · 90 秒 · ★★'],
    ['safe-zone-escape','安全区逃脱','追逐','◎','#27c98f','区域追逐 · 90 秒 · ★★★'],
    ['lucky-wheel-mission','幸运转盘任务','协作','◴','#ffba30','随机任务 · 60 秒 · ★★★'],
  ];
  const members = [
    ['金钟国（概念）','力量担当 · 跳过当前难题'],['刘在石（概念）','综艺队长 · 提示正确方向'],
    ['宋智孝（概念）','冷静判断 · 免除一次失误'],['HAHA（概念）','气氛制造机 · 幸运重抽'],
    ['池石镇（概念）','老将担当 · 提示正确方向'],['李光洙（概念）','反转担当 · 跳过当前难题'],
    ['姜Gary（概念）','冷静担当 · 免除一次失误'],['宋仲基（概念）','观察担当 · 提示正确方向'],
    ['Lizzy（概念）','活力担当 · 幸运重抽'],['全昭旻（概念）','创意担当 · 提示正确方向'],
    ['梁世灿（概念）','应变担当 · 跳过当前难题'],['池艺恩（概念）','新秀担当 · 幸运重抽'],
  ];
  const guests = ['少女时代（概念）','EXO（概念）','BIGBANG（概念）','柳贤振（概念）','秀智（概念）','宣美（概念）','SEVENTEEN（概念）','EXID（概念）','BLACKPINK（概念）','姜勋（概念）','崔丹尼尔（概念）'];
  const key = 'rush_web_demo_v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; } };
  const state = {page:'home',tab:'all',filter:'全部',game:null,detailGame:null,showAllLevels:false,level:0,round:0,score:0,correct:0,rounds:[],skillUsed:false,filterQuery:'',data:read()};
  state.data.progress ||= {};
  state.data.role ||= members[1][0];
  const app = document.querySelector('#app');
  const esc = (v) => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const save = () => localStorage.setItem(key,JSON.stringify(state.data));
  const game = (id) => games.find(g=>g[0]===id) || games[0];
  const progress = (id) => state.data.progress[id] || {passed:0,best:0,attempts:0};
  const activeLevel = (id) => Math.min(6,progress(id).passed+1);
  const icon = g => `<div class="game-icon" style="background:${g[4]}">${g[3]}</div>`;
  const descriptions = {
    'color-judge':'看字辨色，连续答对冲击高分。','memory-sequence':'记住符号顺序，在卡牌遮盖后准确还原。','route-chase':'读懂封锁线索，选择唯一安全路线。','identity-deduction':'根据行动记录逐步排除，找到隐藏身份。','team-order':'和队友校准比赛节奏，把散乱任务排成正确流程。','relay-lockbox':'短暂记住数字密码，趁密码箱关闭前完成接力破解。','true-false-mission':'抽取综艺任务卡，快速辨认真伪并连胜得分。','seat-rush':'进入待命后等候随机起跑信号，立即抢占亮起的位置。','vanishing-object':'观察桌面物品，在画面收起后找出消失的那一件。','action-telephone':'接收队友传来的动作描述，猜出动作真正含义。','safe-zone-escape':'危险区域不断封锁，在安全区缩小前完成转移。','lucky-wheel-mission':'转动任务盘抽取突击任务，识别结果并完成挑战。'
  };
  const rules = {
    'color-judge':['只看文字实际显示的颜色','每轮快速判断并提交答案','正式局结算后计入单玩法榜'],'memory-sequence':['观察依次出现的符号','卡牌遮盖后选择完整顺序','连续记对可挑战更难的关卡'],'route-chase':['读取本轮封锁路线','追兵逼近前选择安全出口','用正确路线完成追击挑战'],'identity-deduction':['观察行动记录中的矛盾','排除无嫌疑的选手','锁定隐藏身份完成推理'],'team-order':['查看本轮打乱的比赛环节','选择从哨声到冲线的完整顺序','流程题逐轮加速，错题不计分'],'relay-lockbox':['观察接力密码数字','密码收起后选择正确数字顺序','后续轮次会增加密码长度'],'true-false-mission':['阅读抽到的任务卡陈述','选择属实或是假消息','连续正确可累积更高分数'],'seat-rush':['点击进入待命状态','等待随机起跑信号与亮起位置','选中目标位置完成抢位'],'vanishing-object':['记住本轮桌面物品','桌面收起后判断哪件物品消失','后续轮次增加观察项目'],'action-telephone':['接收一条动作剪影线索','选择动作想表达的含义','干扰选项随轮次变化'],'safe-zone-escape':['观察警报标出的封锁区','选择唯一没有被封锁的安全区','封锁速度随轮次提高'],'lucky-wheel-mission':['点击转动幸运任务盘','确认抽中的突击任务','每轮从任务池随机抽取']
  };
  const head = (name='跑') => `<header class="topbar"><div class="brand">RUSH! 跑场</div><div class="avatar">${esc(name.slice(0,1))}</div></header>`;
  const title = (name,sub='') => `<h1 class="page-title">${name}</h1>${sub?`<p class="subline">${sub}</p>`:''}`;
  const card = g => `<button class="game-card" data-game="${g[0]}">${icon(g)}<strong>${g[1]}</strong><small>${g[2]} · ${g[5].split('·')[1].trim()}</small></button>`;
  const nav = () => `<nav class="nav">${[['home','⌂','首页'],['library','▣','玩法'],['arena','♧','竞技'],['rank','▥','排行'],['mine','○','我的']].map(([p,i,l])=>`<button class="${state.page===p?'active':''}" data-nav="${p}"><b>${i}</b>${l}</button>`).join('')}</nav>`;

  function home(){
    const featured=game('color-judge');
    return `${head()}<section class="hero"><div class="eyebrow">DAILY CHALLENGE · 今日推荐</div><h1>颜色闪电</h1><p>45 秒快速开局，适合热身</p><div class="stats"><div class="stat"><strong>06</strong><span>主题关卡</span></div><div class="stat"><strong>12</strong><span>综艺玩法</span></div><div class="stat"><strong>★★</strong><span>挑战难度</span></div></div><button class="button full" data-game="${featured[0]}">开始今日挑战</button></section>
      <section class="role-card"><div class="role-avatar">${esc(state.data.role.slice(0,1))}</div><div class="role-copy"><small>本周随机角色</small><strong>${esc(state.data.role)}</strong><span>角色技能免费体验 · 每局一次</span></div><button class="button dark" data-nav="mine">角色中心</button></section>
      <div class="section-head"><h2>热门竞技</h2><button class="link-button" data-nav="library">查看全部 →</button></div>
      <div class="chips">${['全部','反应','记忆','协作'].map(c=>`<button class="chip ${state.filter===c?'active':''}" data-filter="${c}">${c}</button>`).join('')}</div>
      <div class="game-grid">${games.filter(g=>state.filter==='全部'||g[2]===state.filter).slice(0,4).map(card).join('')}</div>
      <div class="section-head"><h2>朋友一起玩</h2></div><section class="wide-card"><h3>和朋友开跑</h3><p>创建异步挑战房，或创建好友 PK</p><div class="two-buttons"><button class="button outline" data-nav="arena">创建好友房</button><button class="button orange" data-nav="arena">发起异步 PK</button></div></section>
      <p class="note">网页试玩版 · 关卡和成绩保存在当前浏览器，不接入线上账户或好友榜单。</p>${nav()}`;
  }
  function library(){
    const filtered=games.filter(g=>(state.tab==='all'||g[2]===state.tab)&&(`${g[1]}${g[2]}${g[5]}`).toLowerCase().includes(state.filterQuery.toLowerCase()));
    return `${head()}${title('玩法库','选择赛场，挑一款马上开局。')}<input class="search" id="search" placeholder="搜索玩法" value="${esc(state.filterQuery)}"><div class="chips">${['全部','反应','记忆','协作','追逐','推理'].map(c=>`<button class="chip ${state.tab===(c==='全部'?'all':c)?'active':''}" data-tab="${c==='全部'?'all':c}">${c}</button>`).join('')}</div><div>${filtered.map(g=>`<button class="game-row" data-game="${g[0]}">${icon(g)}<span class="game-row-copy"><strong>${g[1]}</strong><small>${g[5]} · 第 ${activeLevel(g[0])} 关</small></span><span class="arrow">›</span></button>`).join('')||'<div class="empty">没有找到这个玩法</div>'}</div>${nav()}`;
  }
  function detail(){
    const g=state.detailGame||game('color-judge'),p=progress(g[0]),level=activeLevel(g[0]),items=rules[g[0]]||rules['color-judge'];
    const list=state.showAllLevels?`<section class="panel level-list"><div class="section-head"><h2>主题关卡</h2><span class="muted">${p.passed}/6 已通关</span></div>${Array.from({length:6},(_,i)=>`<div class="level-row"><span class="level-number ${i+1<=p.passed?'done':i+1===level?'current':''}">${i+1}</span><span><strong>第 ${i+1} 关</strong><small>${i+1<=p.passed?'已通关':i+1===level?'当前关卡':'待解锁'} · 难度 ${'★'.repeat(Math.min(5,2+Math.floor(i/2)))}</small></span><b>${i+1<=p.passed?(p.best||0)+' 分':i+1===level?'›':'🔒'}</b></div>`).join('')}</section>`:'';
    return `<header class="detail-header"><button class="back" data-detail-back aria-label="返回">‹</button><strong>玩法详情</strong><button class="favorite ${state.data.favorites?.includes(g[0])?'saved':''}" data-favorite="${g[0]}" aria-label="收藏">${state.data.favorites?.includes(g[0])?'★':'☆'}</button></header>
      <main class="detail-content"><section class="detail-cover" style="--game-color:${g[4]}"><span class="detail-cover-tag">跑场精选 · 综艺玩法</span><div class="detail-cover-icon">${g[3]}</div><strong>${g[1]}</strong></section>
      <h1 class="detail-title">${g[1]}</h1><p class="detail-description">${descriptions[g[0]]||g[5]}</p><h2 class="detail-section-title">玩法规则</h2><div class="rule-list">${items.map((text,i)=>`<div class="rule-item"><span class="rule-number">${i+1}</span><p>${text}</p></div>`).join('')}</div>
      <section class="current-level"><small>当前关卡</small><strong>第 ${level} 关 · ${['盲盒色域风暴','记忆迷阵','安全路线','身份线索'][Math.min(3,level-1)]}</strong><span>${p.attempts?`个人最佳 ${p.best} 分 · 已尝试 ${p.attempts} 次`:'尚无正式成绩'}</span></section>
      <button class="button full levels-button" data-detail-levels>${state.showAllLevels?'收起关卡':'查看全部关卡 →'}</button>${list}
      <div class="detail-links"><button class="button outline" data-detail-link="friends">好友进度</button><button class="button outline" data-detail-link="arena">好友挑战</button><button class="button outline" data-detail-link="rank">玩法榜单</button></div></main>
      <div class="detail-actions"><button class="button outline" data-detail-practice>练习</button><button class="button" data-detail-start>开始挑战</button></div>`;
  }
  function arena(){return `${head()}${title('竞技场','和朋友开跑 · 网页试玩暂使用本机对局')}<section class="panel"><h2>好友挑战</h2><p class="muted">创建异步挑战房，或创建好友 PK。</p><div class="two-buttons"><button class="button" data-open-games="true">创建挑战房</button><button class="button orange" data-open-games="true">发起异步 PK</button></div></section><section class="panel"><h3>快速操作</h3><p class="muted">选择任意玩法即可开始本机试玩，成绩保存在当前设备。</p><button class="button dark full" data-nav="library">选择玩法开始 →</button></section>${nav()}`;}
  function mine(){
    const total=Object.values(state.data.progress).reduce((n,p)=>n+p.attempts,0),wins=Object.values(state.data.progress).reduce((n,p)=>n+p.passed,0),best=Math.max(0,...Object.values(state.data.progress).map(p=>p.best));
    return `${head()}${title('我的','角色权益 · 游戏记录')}<section class="hero"><div class="role-avatar">${esc(state.data.role.slice(0,1))}</div><h1>${esc(state.data.role)}</h1><p>角色与技能均可免费体验</p></section><div class="panel stats"><div class="stat"><strong>${total}</strong><span>总场次</span></div><div class="stat"><strong>${wins}</strong><span>通关</span></div><div class="stat"><strong>${best}</strong><span>最高分</span></div></div><section class="panel"><div class="section-head"><h2>常驻角色</h2></div><div class="role-list">${members.map(([n,d])=>`<div class="role-item"><div class="role-avatar">${n[0]}</div><label><strong>${n}</strong><small>${d}</small></label><input type="radio" name="role" value="${esc(n)}" ${state.data.role===n?'checked':''}></div>`).join('')}</div><div class="section-head"><h2>嘉宾角色</h2></div><div class="role-list">${guests.map(n=>`<div class="role-item"><div class="role-avatar">${n[0]}</div><label><strong>${n}</strong><small>嘉宾特别技能 · 免费体验</small></label><input type="radio" name="role" value="${esc(n)}" ${state.data.role===n?'checked':''}></div>`).join('')}</div></section><p class="note">角色名称与形象为概念演示，不代表已获节目方或艺人授权。</p>${nav()}`;
  }
  function ranking(){
    const played=games.map(g=>({g,p:progress(g[0])})).filter(x=>x.p.best>0).sort((a,b)=>b.p.best-a.p.best);
    return `${head()}${title('本周排名','ALL GAMES · 综合总分')}<section class="role-card"><div class="role-copy"><small>本机试玩最高分</small><strong style="font-size:32px">${played[0]?.p.best||0}</strong><span>完成正式体验局以累计成绩</span></div></section><div class="section-head"><h2>我的玩法成绩</h2></div>${played.length?played.map((x,i)=>`<div class="rank-row"><b>${i+1}</b><div class="rank-avatar">${x.g[3]}</div><div><strong>${x.g[1]}</strong><small class="muted">通关 ${x.p.passed}/6 关</small></div><b>${x.p.best}</b></div>`).join(''):'<div class="panel empty">完成一局玩法后，成绩会显示在这里。</div>'}${nav()}`;
  }
  function question(g,index){
    const choose=a=>a[Math.floor(Math.random()*a.length)];
    const shuffle=a=>[...a].sort(()=>Math.random()-.5);
    let prompt='',instruction='',choices=[],answer='';
    if(g[0]==='color-judge'){const c=[['红','red'],['蓝','blue'],['黄','orange'],['绿','green']];const word=choose(c),ink=choose(c);prompt=word[0];instruction='文字会骗人，只看字实际显示的颜色';choices=c.map((x)=>({label:x[0],value:x[1]}));answer=ink[1];return{prompt,instruction,choices,answer,color:ink[1]};}
    if(g[0]==='memory-sequence'||g[0]==='relay-lockbox'){const icons=['●','▲','■','★','◆'];const seq=Array.from({length:3+Math.min(index,2)},()=>choose(icons));prompt=seq.join('　');instruction='记住顺序，选择完全一致的序列';const variants=[seq,[...seq].reverse(),[...seq.slice(1),seq[0]],seq.map((x,i)=>icons[(icons.indexOf(x)+i+1)%icons.length])];choices=shuffle(variants).map(x=>({label:x.join(' → '),value:JSON.stringify(x)}));answer=JSON.stringify(seq);return{prompt,instruction,choices,answer,conceal:true};}
    if(g[0]==='route-chase'||g[0]==='safe-zone-escape'){const routes=g[0]==='route-chase'?['高架桥','隧道','屋顶','广场']:['红区','蓝区','黄区','绿区'];const safe=choose(routes);const blocked=shuffle(routes.filter(x=>x!==safe)).slice(0,2);prompt=`已封锁：${blocked.join('、')}`;instruction='避开封锁区域，选出唯一安全路线';choices=shuffle(routes).map(x=>({label:x,value:x}));answer=safe;return{prompt,instruction,choices,answer};}
    if(g[0]==='identity-deduction'){const suspects=['选手 A','选手 B','选手 C','选手 D'];const culprit=choose(suspects);const cleared=shuffle(suspects.filter(x=>x!==culprit)).slice(0,2);prompt=`线索排除：${cleared.join('、')}不是目标`;instruction='根据线索锁定剩余身份';choices=shuffle(suspects).map(x=>({label:x,value:x}));answer=culprit;return{prompt,instruction,choices,answer};}
    if(g[0]==='team-order'){const seq=['哨声','起跑','绕桩','冲线'];const options=[seq,[...seq].reverse(),[seq[0],seq[2],seq[1],seq[3]],[seq[1],seq[0],seq[2],seq[3]]];prompt='团队接力流程';instruction='选择从开始到冲线的正确顺序';choices=shuffle(options).map(x=>({label:x.join(' → '),value:JSON.stringify(x)}));answer=JSON.stringify(seq);return{prompt,instruction,choices,answer};}
    if(g[0]==='true-false-mission'){const facts=[['章鱼有三颗心脏','true'],['蝙蝠属于鸟类','false'],['海豚是鱼类','false'],['长颈鹿的舌头通常呈蓝紫色','true']];const f=choose(facts);prompt=`任务卡：${f[0]}`;instruction='判断这条陈述是否属实';choices=[{label:'属实',value:'true'},{label:'是假消息',value:'false'}];answer=f[1];return{prompt,instruction,choices,answer};}
    if(g[0]==='seat-rush'){const seats=['A 位','B 位','C 位','D 位'];const target=choose(seats);prompt=`空位 ${target} 亮起！`;instruction='快速抢占亮起的空位';choices=shuffle(seats).map(x=>({label:x,value:x}));answer=target;return{prompt,instruction,choices,answer};}
    if(g[0]==='vanishing-object'){const objects=['钥匙','红苹果','蓝水杯','哨子','星星贴纸','小球'];const seen=shuffle(objects).slice(0,4);const missing=choose(seen);prompt=seen.filter(x=>x!==missing).join('　　');instruction='观察桌面后，找出刚才消失的物品';choices=shuffle(objects).slice(0,4);if(!choices.includes(missing))choices[0]=missing;return{prompt,instruction,choices:shuffle(choices).map(x=>({label:x,value:x})),answer:missing};}
    if(g[0]==='action-telephone'){const items=[['双臂交叉后向上举','起跑'],['单脚站立并张开双臂','保持平衡'],['双手在头顶拍两下','鼓掌两次'],['向左转身后蹲下','躲避']];const target=choose(items);prompt=`动作剪影：${target[0]}`;instruction='接收动作线索，选出正确含义';choices=shuffle(items).map(x=>({label:x[1],value:x[1]}));answer=target[1];return{prompt,instruction,choices,answer};}
    if(g[0]==='lucky-wheel-mission'){const tasks=['反向说出颜色','记住三枚符号','模仿起跑动作','选出安全出口'];const target=choose(tasks);prompt='幸运任务盘转动中';instruction='转动任务盘，记住抽中的突击任务';choices=shuffle(tasks).map(x=>({label:x,value:x}));answer=target;return{prompt:`抽中任务：${target}`,instruction,choices,answer};}
    const labels=['左','右','前','后'];const correct=choose(labels);prompt='反应信号出现';instruction='选择屏幕提示的方向';choices=shuffle(labels).map(x=>({label:x,value:x}));answer=correct;return{prompt:correct,instruction,choices,answer};
  }
  function showDetail(id){state.detailGame=game(id);state.showAllLevels=false;state.page='detail';render();}
  function start(id,mode='SOLO'){state.game=game(id);state.level=activeLevel(id);state.playMode=mode;state.round=0;state.score=0;state.correct=0;state.skillUsed=false;state.rounds=Array.from({length:5},(_,i)=>question(state.game,i));state.page='play';render();}
  function play(){const g=state.game,q=state.rounds[state.round];if(!q)return home();return `${head()}<button class="link-button" data-back-detail>‹ 返回玩法详情</button><section class="game-stage"><div class="round">${esc(g[1])} · 第 ${state.level} 关 · ${state.round+1}/5${state.playMode==='PRACTICE'?' · 练习':''}</div><h1 style="${q.color?`color:${q.color}`:''}">${esc(q.conceal&&state.round%2===0?'✦　◆　●　▲　✦':q.prompt)}</h1><p>${esc(q.conceal&&state.round%2===0?'记忆图案即将收起':q.instruction)}</p></section><div class="helper"><span>当前角色：${esc(state.data.role)}</span><button class="role-skill" data-skill="true" ${state.skillUsed?'disabled':''}>${state.skillUsed?'本局技能已用':'免费使用角色技能'}</button></div><div class="choice-list">${q.choices.map((c,i)=>`<button class="choice" data-choice="${i}">${esc(c.label)}</button>`).join('')}</div><div class="helper"><span>当前得分 ${state.score}</span><span>通关目标：答对 3 题</span></div>${nav()}`;}
  function settle(answer){const q=state.rounds[state.round];if(answer===q.answer){state.correct++;state.score+=100+state.round*20;}state.round++;if(state.round>=5){if(state.playMode!=='PRACTICE'){const p=progress(state.game[0]);p.attempts++;p.best=Math.max(p.best,state.score);if(state.correct>=3)p.passed=Math.max(p.passed,state.level);state.data.progress[state.game[0]]=p;save();}state.page='result';}render();}
  function result(){const passed=state.correct>=3,practice=state.playMode==='PRACTICE';return `${head()}<section class="hero center"><div class="eyebrow">${practice?'PRACTICE':passed?'CHALLENGE CLEAR':'TRY AGAIN'}</div><h1>${practice?'练习完成':passed?'挑战完成！':'再来一局？'}</h1><div class="result-score">${state.score}</div><p>${practice?'练习成绩不计入正式记录':'本局得分'}</p></section><section class="panel"><div class="score-row"><span>答对题数</span><strong>${state.correct} / 5</strong></div><div class="score-row"><span>当前关卡</span><strong>${passed?'已通关':'未通关'} · 第 ${state.level} 关</strong></div><div class="score-row"><span>成绩记录</span><strong>${practice?'练习模式 · 不计入榜单':'正式挑战'}</strong></div></section><button class="button full" data-replay="true">再玩一次</button><button class="button outline full" style="margin-top:10px" data-result-detail>返回玩法详情</button>${nav()}`;}
  function render(){const pages={home,library,detail,arena,mine,rank:ranking,play,result};app.dataset.page=state.page;app.innerHTML=pages[state.page]();app.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{state.page=b.dataset.nav;render();});app.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>showDetail(b.dataset.game));app.querySelectorAll('[data-detail-back]').forEach(b=>b.onclick=()=>{state.page='library';render();});app.querySelectorAll('[data-back-detail],[data-result-detail]').forEach(b=>b.onclick=()=>showDetail(state.game[0]));app.querySelectorAll('[data-favorite]').forEach(b=>b.onclick=()=>{state.data.favorites||=[];const id=b.dataset.favorite;state.data.favorites=state.data.favorites.includes(id)?state.data.favorites.filter(x=>x!==id):[...state.data.favorites,id];save();render();});app.querySelectorAll('[data-detail-levels]').forEach(b=>b.onclick=()=>{state.showAllLevels=!state.showAllLevels;render();});app.querySelectorAll('[data-detail-practice]').forEach(b=>b.onclick=()=>start(state.detailGame[0],'PRACTICE'));app.querySelectorAll('[data-detail-start]').forEach(b=>b.onclick=()=>start(state.detailGame[0],'SOLO'));app.querySelectorAll('[data-detail-link]').forEach(b=>b.onclick=()=>{const dest=b.dataset.detailLink;if(dest==='friends'){alert('网页试玩暂不接入好友数据');return;}state.page=dest;render();});app.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;render();});app.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;render();});app.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>settle(state.rounds[state.round].choices[Number(b.dataset.choice)].value));app.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>{if(state.skillUsed)return;state.skillUsed=true;const q=state.rounds[state.round];const answerIndex=q.choices.findIndex(c=>c.value===q.answer);app.querySelectorAll('[data-choice]').forEach((choice,i)=>{choice.classList.toggle('selected',i===answerIndex);choice.disabled=i!==answerIndex;});b.textContent='已提示正确选项 · 点击继续';b.disabled=true;});app.querySelectorAll('[data-replay]').forEach(b=>b.onclick=()=>start(state.game[0]));app.querySelectorAll('[data-open-games]').forEach(b=>b.onclick=()=>{state.page='library';render();});app.querySelectorAll('input[name="role"]').forEach(input=>input.onchange=()=>{state.data.role=input.value;save();render();});const search=app.querySelector('#search');if(search)search.oninput=e=>{state.filterQuery=e.target.value;const pos=search.selectionStart;render();const next=app.querySelector('#search');next.focus();next.setSelectionRange(pos,pos);};}
  render();
})();
