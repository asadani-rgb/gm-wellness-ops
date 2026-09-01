"use strict";
/* ============================ ICONS ============================ */
const I = {
  logo:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 9h12v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M16 10.2h2.2a2.2 2.2 0 0 1 0 4.4H16" stroke="currentColor" stroke-width="1.7"/><path d="M10 8c-.5-1.6.6-2.7 1.8-3-.2 1.6-.8 2.6-1.8 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  sell:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M17 9.5h2.2a2.3 2.3 0 0 1 0 4.6H17" stroke="currentColor" stroke-width="1.7"/><path d="M6 3.5c-.5.8.5 1.3 0 2.1M10 3.5c-.5.8.5 1.3 0 2.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  stock:'<svg viewBox="0 0 24 24" fill="none"><path d="M3.5 8 12 4l8.5 4-8.5 4-8.5-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3.5 8v8l8.5 4 8.5-4V8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 12v8" stroke="currentColor" stroke-width="1.6"/></svg>',
  issues:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5 21 19H3L12 3.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 10v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="16.6" r="1.05" fill="currentColor"/></svg>',
  analytics:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 20V4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M4 20h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><rect x="7" y="12" width="3" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="12.5" y="8" width="3" height="9" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="18" y="14" width="3" height="3" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>',
  manage:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h11M4 17h7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="18" cy="7" r="2.4" stroke="currentColor" stroke-width="1.6"/><circle cx="14" cy="17" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  undo:'<svg viewBox="0 0 24 24" fill="none"><path d="M9 7 5 11l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 11h9a5 5 0 0 1 0 10h-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M7 7l.8 12A1.5 1.5 0 0 0 9.3 20h5.4a1.5 1.5 0 0 0 1.5-1L17 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  key:'<svg viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="4" stroke="currentColor" stroke-width="1.7"/><path d="m11 11 8 8m-3 0 2-2m-4-2 2-2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.7"/><path d="M5 19.5c.7-3.4 3.5-5 7-5s6.3 1.6 7 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.6"/></svg>',
  eyeoff:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 4l16 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9.5 9.6A2.6 2.6 0 0 0 12 14.6M6.3 6.4C3.9 7.9 2.5 12 2.5 12S6 18.5 12 18.5c1.5 0 2.8-.3 3.9-.9M10 5.7c.6-.1 1.3-.2 2-.2 6 0 9.5 6.5 9.5 6.5s-.8 1.5-2.3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3 5 5.6v5c0 4.3 3 7.4 7 8.6 4-1.2 7-4.3 7-8.6v-5L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  bean:'<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="7.5" ry="9" transform="rotate(35 12 12)" stroke="currentColor" stroke-width="1.6"/><path d="M8 8c3 2 5 5 8 8" stroke="currentColor" stroke-width="1.5"/></svg>'
};

/* ============================ SUPABASE CLIENT ============================ */
const cfg = window.GM_CONFIG || {};
const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

function mapIngredient(r){return {id:r.id,name:r.name,cat:r.category,unit:r.unit,packet:Number(r.packet_size),perPacket:Number(r.coffees_per_packet),stock:Number(r.stock),par:Number(r.par)};}
function mapProduct(r){return {id:r.id,name:r.name,price:Number(r.price),recipe:(r.recipe_items||[]).map(ri=>[ri.ingredient_id,Number(ri.qty)])};}

/* ============================ STATE ============================ */
let DB={ingredients:[],products:[],sales:[],issues:[],users:[],settings:{shopName:'GM Wellness',currency:'INR'}};
let me=null, view='sell', lastSale=null, toastTimer=null, manageTab='supplies';

async function loadAll(){
  const since=new Date(Date.now()-14*86400000).toISOString();
  const [ings,prods,setts,users,sales,issues]=await Promise.all([
    sb.from('ingredients').select('*').order('name'),
    sb.from('products').select('*, recipe_items(ingredient_id, qty)').order('name'),
    sb.from('shop_settings').select('*').eq('id',1).maybeSingle(),
    sb.from('profiles').select('*').order('created_at'),
    sb.from('sales').select('id, product_id, price, created_at').gte('created_at',since).order('created_at',{ascending:false}),
    sb.from('issues').select('id, ingredient_id, amount, mode, reason, created_at, profiles(name)').order('created_at',{ascending:false}).limit(50)
  ]);
  if(ings.data) DB.ingredients=ings.data.map(mapIngredient);
  if(prods.data) DB.products=prods.data.map(mapProduct);
  DB.settings=setts.data?{shopName:setts.data.shop_name,currency:setts.data.currency}:{shopName:'GM Wellness',currency:'INR'};
  if(users.data) DB.users=users.data.map(u=>({id:u.id,name:u.name,email:u.email,role:u.role}));
  if(sales.data) DB.sales=sales.data.map(x=>({id:x.id,pid:x.product_id,price:Number(x.price),ts:new Date(x.created_at).getTime()}));
  if(issues.data) DB.issues=issues.data.map(i=>({id:i.id,ing:i.ingredient_id,amount:Number(i.amount),mode:i.mode,reason:i.reason,by:(i.profiles&&i.profiles.name)||'—',ts:new Date(i.created_at).getTime()}));
}

/* ============================ HELPERS ============================ */
const ing=id=>DB.ingredients.find(x=>x.id===id);
const CURRENCIES={
  INR:{locale:'en-IN',label:'₹  Indian Rupee (INR)'},
  AED:{locale:'en-AE',label:'د.إ  UAE Dirham (AED)'},
  USD:{locale:'en-US',label:'$  US Dollar (USD)'},
  EUR:{locale:'en-IE',label:'€  Euro (EUR)'},
  GBP:{locale:'en-GB',label:'£  British Pound (GBP)'},
  SAR:{locale:'en-SA',label:'﷼  Saudi Riyal (SAR)'},
  SGD:{locale:'en-SG',label:'$  Singapore Dollar (SGD)'},
  AUD:{locale:'en-AU',label:'$  Australian Dollar (AUD)'},
  CAD:{locale:'en-CA',label:'$  Canadian Dollar (CAD)'}
};
const curCode=()=>(DB.settings&&DB.settings.currency)||'INR';
const curLocale=()=>(CURRENCIES[curCode()]||CURRENCIES.INR).locale;
let _fmt=null,_fmtCode=null;
function money(n){const c=curCode();if(_fmtCode!==c){try{_fmt=new Intl.NumberFormat(curLocale(),{style:'currency',currency:c,maximumFractionDigits:0});}catch(e){_fmt=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});}_fmtCode=c;}return _fmt.format(Math.round(n));}
const perServing=x=>x.packet/x.perPacket;
const coffeesLeft=x=>Math.floor(x.stock/perServing(x));
const ratio=x=>Math.max(0,Math.min(1,x.stock/x.par));
const statusOf=r=>r<0.15?'crit':r<0.4?'warn':'good';
const statusLabel=s=>s==='crit'?'Critical':s==='warn'?'Low':'Healthy';
function cupCapacity(p){let min=Infinity,lim=null;p.recipe.forEach(([iid,q])=>{const x=ing(iid);if(!x)return;const c=Math.floor(x.stock/q);if(c<min){min=c;lim=iid;}});return{cups:min===Infinity?0:min,limitId:lim};}
const fmtNum=n=>n.toLocaleString(curLocale());
function timeAgo(ts){const s=(Date.now()-ts)/1000;if(s<3600)return Math.max(1,Math.round(s/60))+'m ago';if(s<86400)return Math.round(s/3600)+'h ago';return Math.round(s/86400)+'d ago';}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
const adminCount=()=>DB.users.filter(u=>u.role==='admin').length;

/* ============================ NAV ============================ */
const NAV=[
  {id:'sell',label:'Sell',icon:I.sell,roles:['admin','staff']},
  {id:'stock',label:'Stock',icon:I.stock,roles:['admin','staff']},
  {id:'issues',label:'Issues',icon:I.issues,roles:['admin','staff']},
  {id:'analytics',label:'Analytics',icon:I.analytics,roles:['admin']},
  {id:'manage',label:'Admin',icon:I.manage,roles:['admin']}
];
const navFor=()=>NAV.filter(n=>n.roles.includes(me.role));
function renderNav(){
  const items=navFor();
  document.getElementById('nav').innerHTML=items.map(n=>`<button class="nav-item" data-view="${n.id}" ${n.id===view?'aria-current="page"':''}>${n.icon}<span>${n.label}</span></button>`).join('');
  document.getElementById('botnav').innerHTML=items.map(n=>`<button data-view="${n.id}" ${n.id===view?'aria-current="page"':''}>${n.icon}<span>${n.label}</span></button>`).join('');
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>go(b.dataset.view));
}
function go(v){view=v;renderNav();render();document.getElementById('view').focus();window.scrollTo({top:0,behavior:'instant'});}

/* ============================ RENDER ============================ */
function render(){
  const el=document.getElementById('view');
  const map={sell:viewSell,stock:viewStock,issues:viewIssues,analytics:viewAnalytics,manage:viewManage};
  el.innerHTML=(map[view]||viewSell)();
  wire();
}

/* ---------- SELL ---------- */
function viewSell(){
  const lowCount=DB.ingredients.filter(x=>statusOf(ratio(x))!=='good').length;
  const cards=DB.products.map(p=>{
    const {cups,limitId}=cupCapacity(p); const lim=ing(limitId);
    const rq=limitId?p.recipe.find(r=>r[0]===limitId)[1]:1;
    const target=lim?Math.max(cups,Math.floor(lim.par/rq)):cups;
    const pct=target?Math.round(cups/target*100):0;
    const s=cups<8?'crit':cups<20?'warn':(pct<40?'warn':'good');
    const disabled=cups<=0;
    return `<div class="card prod ${disabled?'out':''}" data-prod="${p.id}">
      <div class="soldflash">${I.check} Sold</div>
      <div class="p-top"><h3>${esc(p.name)}</h3><span class="price">${money(p.price)}</span></div>
      <div class="cups"><b class="num">${cups}</b> cups can be made</div>
      <div class="bar ${s}"><i style="width:${Math.max(disabled?0:4,pct)}%"></i></div>
      <div class="limit">${disabled?'Out of stock':(lim?('Limited by '+esc(lim.name)):'')}</div>
      <div class="sell-row"><button class="btn-sell" data-sell="${p.id}" ${disabled?'disabled':''}>${I.sell} Sell one</button></div>
    </div>`;
  }).join('');
  return `<div class="page-head">
      <div><h1>Sell coffee</h1><div class="ph-sub">Tap a coffee to record a sale. Stock updates instantly.</div></div>
      ${lowCount?`<span class="pill warn">${I.issues} ${lowCount} item${lowCount>1?'s':''} need restock</span>`:`<span class="pill good">${I.check} All stock healthy</span>`}
    </div><div class="grid sell-grid">${cards}</div>`;
}

/* ---------- STOCK ---------- */
function viewStock(){
  const order={crit:0,warn:1,good:2};
  const rows=[...DB.ingredients].sort((a,b)=>order[statusOf(ratio(a))]-order[statusOf(ratio(b))]).map(x=>{
    const r=ratio(x),s=statusOf(r),cl=coffeesLeft(x),pk=x.stock/x.packet;
    return `<div class="stock-row">
      <div><div class="ing-name"><span class="ing-dot ${s}"></span>${esc(x.name)}</div>
        <div class="ing-cat">${esc(x.cat)} · 1 packet = ${fmtNum(x.packet)}${x.unit} ≈ ${x.perPacket} coffees</div></div>
      <div class="barcell"><div class="ing-meta"><b class="num">${cl}</b> coffees' worth left · ${pk.toFixed(1)} packets</div>
        <div class="bar ${s}"><i style="width:${Math.max(3,Math.round(r*100))}%"></i></div></div>
      <div class="stk-right"><b class="num">${fmtNum(Math.round(x.stock))}<span style="font-size:11px;font-weight:600;color:var(--ink-faint)">${x.unit}</span></b>${statusLabel(s)}</div>
    </div>`;
  }).join('');
  return `<div class="page-head"><div><h1>Stock levels</h1><div class="ph-sub">Live inventory across beans, milk and consumables.</div></div></div>
    <div class="card card-pad">${rows}</div>
    <p class="help" style="margin-top:14px">Bars show current stock against your target (par) level. Sales and logged issues both draw stock down.</p>`;
}

/* ---------- ISSUES ---------- */
function viewIssues(){
  const opts=DB.ingredients.map(x=>`<option value="${x.id}">${esc(x.name)} (${esc(x.cat)})</option>`).join('');
  const log=[...DB.issues].sort((a,b)=>b.ts-a.ts).map(it=>{
    const x=ing(it.ing); const amt=it.mode==='coffees'?`${it.amount} coffees' worth`:`${fmtNum(it.amount)} ${x?x.unit:''}`;
    return `<tr><td><b>${x?esc(x.name):'—'}</b><div style="font-size:11.5px;color:var(--ink-faint)">${esc(it.reason)}</div></td>
      <td class="r"><span class="pill crit" style="font-size:11px">−${amt}</span></td>
      <td>${esc(it.by)}</td><td class="r" style="color:var(--ink-faint);white-space:nowrap">${timeAgo(it.ts)}</td></tr>`;
  }).join('');
  return `<div class="page-head"><div><h1>Log a stock issue</h1><div class="ph-sub">Record spillage, waste or loss — stock is corrected automatically.</div></div></div>
    <div class="grid two-col">
      <div class="card card-pad"><form id="issueForm">
        <div class="form-grid">
          <div class="full"><label class="lab" for="ii-ing">Which item?</label><select id="ii-ing" required>${opts}</select></div>
          <div><label class="lab" for="ii-amt">Amount lost</label><input id="ii-amt" type="number" min="1" step="1" value="5" required></div>
          <div><label class="lab">Measured in</label>
            <div class="seg-inline" role="group" aria-label="Measurement mode">
              <button type="button" data-mode="coffees" aria-pressed="true">Coffees</button>
              <button type="button" data-mode="units" aria-pressed="false">Units</button></div>
            <div class="help" id="ii-unithint"></div></div>
          <div class="full"><label class="lab" for="ii-reason">Reason</label><textarea id="ii-reason" placeholder="e.g. Grinder jam — beans spilled on the floor" required></textarea></div>
          <div class="full" id="ii-preview" style="font-size:13px;color:var(--ink-soft)"></div>
        </div>
        <button class="btn btn-primary" type="submit" style="margin-top:16px">${I.check} Log issue &amp; update stock</button>
      </form></div>
      <div class="card card-pad">
        <div class="section-title">Recent issues</div><div class="section-sub">Everything logged by you and the team.</div>
        <div class="tbl-wrap"><table><thead><tr><th>Item &amp; reason</th><th class="r">Loss</th><th>Logged by</th><th class="r">When</th></tr></thead>
          <tbody>${log||'<tr><td colspan="4" class="empty">No issues logged yet.</td></tr>'}</tbody></table></div>
      </div></div>`;
}

/* ---------- ANALYTICS ---------- */
function viewAnalytics(){
  const DAY=86400000,now=Date.now(),from=now-14*DAY;
  const recent=DB.sales.filter(s=>s.ts>=from);
  const totalRev=recent.reduce((a,s)=>a+s.price,0),totalCups=recent.length,aov=totalCups?totalRev/totalCups:0;
  const lowCount=DB.ingredients.filter(x=>statusOf(ratio(x))!=='good').length;
  const byP={}; DB.products.forEach(p=>byP[p.id]={name:p.name,cups:0,rev:0});
  recent.forEach(s=>{if(byP[s.pid]){byP[s.pid].cups++;byP[s.pid].rev+=s.price;}});
  const prodArr=Object.values(byP).sort((a,b)=>b.cups-a.cups); const maxCups=Math.max(1,...prodArr.map(p=>p.cups)); const top=prodArr[0];
  const hbars=prodArr.map(p=>`<div class="hbar"><span class="hl">${esc(p.name)}</span><span class="htrack"><i style="width:${Math.round(p.cups/maxCups*100)}%"></i></span><span class="hv num">${p.cups}</span></div>`).join('');
  const days=[]; for(let d=13;d>=0;d--){const st=new Date(now-d*DAY);st.setHours(0,0,0,0);const en=st.getTime()+DAY;
    days.push({cups:DB.sales.filter(s=>s.ts>=st.getTime()&&s.ts<en).length,lab:new Date(st).toLocaleDateString('en-AE',{weekday:'short'}).slice(0,2),today:d===0});}
  const maxDay=Math.max(1,...days.map(d=>d.cups));
  const cols=days.map(d=>`<div class="col ${d.today?'today':''}" title="${d.cups} cups"><div class="cbar" style="height:${Math.round(d.cups/maxDay*100)}%"></div><div class="clab">${d.lab}</div></div>`).join('');
  const order={crit:0,warn:1,good:2};
  const health=[...DB.ingredients].sort((a,b)=>order[statusOf(ratio(a))]-order[statusOf(ratio(b))]).slice(0,6).map(x=>{const r=ratio(x),s=statusOf(r);
    return `<div class="hbar"><span class="hl">${esc(x.name)}</span><span class="htrack"><i style="width:${Math.max(3,Math.round(r*100))}%;background:var(--${s})"></i></span><span class="hv num" style="color:var(--${s})">${coffeesLeft(x)}</span></div>`;}).join('');
  return `<div class="page-head"><div><h1>Analytics</h1><div class="ph-sub">Sales and stock over the last 14 days.</div></div><span class="pill neutral">Last 14 days</span></div>
    <div class="grid kpi-grid" style="margin-bottom:16px">
      <div class="card kpi"><div class="k-lab">${I.analytics} Revenue</div><div class="k-val">${money(totalRev)}</div><div class="k-sub">${totalCups} cups sold</div></div>
      <div class="card kpi"><div class="k-lab">${I.sell} Avg. order</div><div class="k-val">${money(aov)}</div><div class="k-sub">per cup</div></div>
      <div class="card kpi"><div class="k-lab">${I.bean} Top seller</div><div class="k-val" style="font-size:26px">${top?esc(top.name):'—'}</div><div class="k-sub">${top?top.cups+' cups':''}</div></div>
      <div class="card kpi"><div class="k-lab">${I.stock} Needs restock</div><div class="k-val" style="color:${lowCount?'var(--warn)':'var(--good)'}">${lowCount}</div><div class="k-sub">of ${DB.ingredients.length} items</div></div>
    </div>
    <div class="grid two-col" style="margin-bottom:16px">
      <div class="card card-pad"><div class="section-title">Cups sold by coffee</div><div class="section-sub">Which drinks move — last 14 days.</div><div class="hbars">${hbars}</div></div>
      <div class="card card-pad"><div class="section-title">Daily volume</div><div class="section-sub">Cups sold per day (today highlighted).</div><div class="cols" role="img" aria-label="Daily cups sold over 14 days">${cols}</div></div>
    </div>
    <div class="card card-pad"><div class="section-title">Stock situation</div><div class="section-sub">Coffees' worth remaining — lowest first. Colour shows status.</div><div class="hbars">${health}</div></div>`;
}

/* ---------- ADMIN (Manage) ---------- */
function viewManage(){
  const tabs=[['supplies','Supplies'],['coffees','Coffees'],['team','Team'],['settings','Settings']];
  return `<div class="page-head"><div><h1>Admin</h1><div class="ph-sub">Set up your coffees, supplies, team and shop settings.</div></div>
    <div class="seg" role="tablist">${tabs.map(([k,l])=>`<button role="tab" data-mtab="${k}" aria-selected="${manageTab===k}">${l}</button>`).join('')}</div></div>
    ${manageTab==='supplies'?manageSupplies():manageTab==='coffees'?manageCoffees():manageTab==='team'?manageTeam():manageSettings()}`;
}
function manageSupplies(){
  const rows=DB.ingredients.map(x=>{const s=statusOf(ratio(x));
    return `<tr data-ing="${x.id}"><td><b>${esc(x.name)}</b><div style="font-size:11.5px;color:var(--ink-faint)">${esc(x.cat)}</div></td>
      <td class="r"><input class="mini-input" type="number" min="1" data-f="packet" value="${x.packet}"> <span style="color:var(--ink-faint);font-size:12px">${x.unit}</span></td>
      <td class="r"><input class="mini-input" type="number" min="1" data-f="perPacket" value="${x.perPacket}"></td>
      <td class="r"><input class="mini-input" type="number" min="0" data-f="stock" value="${Math.round(x.stock)}"></td>
      <td class="r"><input class="mini-input" type="number" min="1" data-f="par" value="${x.par}"></td>
      <td class="r"><span class="pill ${s}" style="font-size:10.5px">${statusLabel(s)}</span></td>
      <td class="r"><button class="btn-ghost btn-mini" data-restock="${x.id}">${I.plus}Packet</button></td></tr>`;}).join('');
  return `<div class="card"><div class="tbl-wrap"><table>
      <thead><tr><th>Supply</th><th class="r">Packet size</th><th class="r">Coffees / packet</th><th class="r">In stock</th><th class="r">Target (par)</th><th class="r">Status</th><th class="r">Restock</th></tr></thead>
      <tbody>${rows}</tbody></table></div></div>
    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap"><button class="btn-ghost" id="addSupply">${I.plus} Add supply</button>
      <span class="help" style="margin:auto 0">Edit any number and it saves as you type. "Coffees / packet" drives how stock converts to cups.</span></div>`;
}
function manageCoffees(){
  const rows=DB.products.map(p=>{const {cups,limitId}=cupCapacity(p);const lim=ing(limitId);
    const recipe=p.recipe.map(([iid,q])=>{const x=ing(iid);return `<span class="chip">${x?esc(x.name):iid}: ${q}${x?x.unit:''}</span>`}).join('');
    return `<tr data-prod="${p.id}"><td><b>${esc(p.name)}</b><div class="recipe-txt">${recipe}</div></td>
      <td class="r"><input class="mini-input" type="number" min="0" data-pf="price" value="${p.price}"></td>
      <td class="r"><b class="num">${cups}</b><div style="font-size:11px;color:var(--ink-faint)">${lim?esc(lim.name):''}</div></td>
      <td class="r"><button class="btn-ghost btn-mini" data-edit="${p.id}">Recipe</button>
        <button class="btn-ghost btn-mini" data-delp="${p.id}" title="Remove" style="padding:6px 8px">${I.trash}</button></td></tr>`;}).join('');
  return `<div class="card"><div class="tbl-wrap"><table>
      <thead><tr><th>Coffee &amp; recipe</th><th class="r">Price (${curCode()})</th><th class="r">Cups makeable</th><th class="r">Edit</th></tr></thead>
      <tbody>${rows}</tbody></table></div></div>
    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap"><button class="btn-ghost" id="addCoffee">${I.plus} Add coffee</button>
      <span class="help" style="margin:auto 0">A recipe lists how much of each supply one cup uses — that's what draws stock down on each sale.</span></div>`;
}
function manageTeam(){
  const rows=DB.users.map(u=>{
    const isMe=u.id===me.id;
    return `<tr data-user="${u.id}">
      <td><b>${esc(u.name)}</b>${isMe?'<span class="youchip">You</span>':''}<div style="font-size:11.5px;color:var(--ink-faint)">${esc(u.email)}</div></td>
      <td><select class="mini" data-role="${u.id}"><option value="admin" ${u.role==='admin'?'selected':''}>Admin</option><option value="staff" ${u.role==='staff'?'selected':''}>Staff</option></select></td>
      <td class="r"><button class="btn-ghost btn-mini" data-resetpw="${u.id}">${I.key} Reset password</button></td>
      <td class="r"><button class="btn-ghost btn-mini" data-deluser="${u.id}" title="Remove" style="padding:6px 8px" ${isMe?'disabled style="opacity:.4;padding:6px 8px"':''}>${I.trash}</button></td></tr>`;}).join('');
  return `<div class="card"><div class="tbl-wrap"><table>
      <thead><tr><th>Member</th><th>Role</th><th class="r">Password</th><th class="r">Remove</th></tr></thead>
      <tbody>${rows}</tbody></table></div></div>
    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap"><button class="btn-ghost" id="addUser">${I.plus} Add team member</button></div>
    <div class="callout">${I.shield}<div><b>Admins</b> can open this Admin area (supplies, coffees, team). <b>Staff</b> can sell coffee and log issues only. In this prototype, accounts live in your browser — the live version stores them securely in Supabase Auth with hashed passwords.</div></div>`;
}

function manageSettings(){
  const s=DB.settings;
  const curOpts=Object.entries(CURRENCIES).map(([c,o])=>`<option value="${c}" ${c===s.currency?'selected':''}>${o.label}</option>`).join('');
  return `<div class="card card-pad" style="max-width:540px">
      <div class="section-title">Shop settings</div><div class="section-sub">These apply everywhere in the app.</div>
      <div class="field"><label class="lab" for="set-shop">Shop name</label><input class="m-input" id="set-shop" value="${esc(s.shopName)}"></div>
      <div class="field"><label class="lab" for="set-cur">Currency</label><select id="set-cur">${curOpts}</select>
        <div class="help" id="set-prev">Sample price: <b>${money(220)}</b>. Prices are stored as numbers — changing currency changes the symbol, not the amount.</div></div>
      <button class="btn btn-primary" id="saveSettings" style="margin-top:6px">${I.check} Save settings</button>
    </div>
    <div class="callout">${I.shield}<div>In the Supabase version these are stored once for the shop and shared across every till and device.</div></div>`;
}
function setShopName(){document.querySelectorAll('.wordmark').forEach(e=>{e.textContent=(DB.settings&&DB.settings.shopName)||'GM Wellness';});}

/* ============================ ACTIONS ============================ */
async function sell(pid){
  const p=DB.products.find(x=>x.id===pid); if(!p)return;
  const {cups}=cupCapacity(p); if(cups<=0){toast('Out of stock for '+p.name,I.issues);return;}
  const {data,error}=await sb.rpc('record_sale',{p_product_id:pid});
  if(error){toast(error.message||'Could not record sale',I.issues);return;}
  lastSale={id:data};
  const card=document.querySelector(`.prod[data-prod="${pid}"]`);
  if(card){card.classList.add('justsold');setTimeout(()=>card.classList.remove('justsold'),950);}
  await loadAll();
  toast(`Sold ${p.name} · ${money(p.price)}`,I.check,'Undo',undoSale);
  if(view==='sell')render();
}
async function undoSale(){if(!lastSale)return;const id=lastSale.id;lastSale=null;const {error}=await sb.rpc('undo_sale',{p_sale_id:id});if(error){toast(error.message||'Undo failed',I.issues);return;}await loadAll();render();toast('Sale reversed',I.undo);}
async function logIssue(id,amount,mode,reason){const {error}=await sb.rpc('log_issue',{p_ingredient_id:id,p_amount:amount,p_mode:mode,p_reason:reason});if(error){toast(error.message||'Could not log issue',I.issues);return;}await loadAll();render();toast('Issue logged · stock updated',I.check);}

/* ============================ WIRE ============================ */
function wire(){
  document.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>sell(b.dataset.sell));

  const form=document.getElementById('issueForm');
  if(form){let mode='coffees';const hint=document.getElementById('ii-unithint'),prev=document.getElementById('ii-preview'),sel=document.getElementById('ii-ing'),amt=document.getElementById('ii-amt');
    function refresh(){const x=ing(sel.value);if(!x)return;hint.textContent=mode==='coffees'?`1 coffee ≈ ${perServing(x).toFixed(0)}${x.unit}`:`In ${x.unit}`;
      const units=mode==='coffees'?(amt.value||0)*perServing(x):(amt.value||0);
      prev.innerHTML=`This removes <b>${fmtNum(Math.round(units))}${x.unit}</b> from <b>${esc(x.name)}</b> (now ${fmtNum(Math.round(x.stock))}${x.unit} → ${fmtNum(Math.max(0,Math.round(x.stock-units)))}${x.unit}).`;}
    form.querySelectorAll('[data-mode]').forEach(btn=>btn.onclick=()=>{mode=btn.dataset.mode;form.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b===btn));refresh();});
    sel.onchange=refresh;amt.oninput=refresh;refresh();
    form.onsubmit=e=>{e.preventDefault();const a=parseFloat(amt.value);if(!a||a<=0){amt.focus();return;}logIssue(sel.value,a,mode,document.getElementById('ii-reason').value.trim()||'No reason given');};}

  document.querySelectorAll('[data-mtab]').forEach(b=>b.onclick=()=>{manageTab=b.dataset.mtab;render();});
  document.querySelectorAll('tr[data-ing] .mini-input').forEach(inp=>inp.onchange=async()=>{const id=inp.closest('tr').dataset.ing;const x=ing(id);const v=parseFloat(inp.value);if(isNaN(v))return;const col={packet:'packet_size',perPacket:'coffees_per_packet',stock:'stock',par:'par'}[inp.dataset.f];x[inp.dataset.f]=v;const {error}=await sb.from('ingredients').update({[col]:v}).eq('id',id);if(error)toast('Save failed',I.issues);});
  document.querySelectorAll('[data-restock]').forEach(b=>b.onclick=async()=>{const x=ing(b.dataset.restock);const {error}=await sb.from('ingredients').update({stock:x.stock+x.packet}).eq('id',x.id);if(error){toast('Restock failed',I.issues);return;}await loadAll();render();toast(`+1 packet of ${x.name}`,I.plus);});
  const addS=document.getElementById('addSupply');if(addS)addS.onclick=addSupplyModal;

  document.querySelectorAll('tr[data-prod] [data-pf]').forEach(inp=>inp.onchange=async()=>{const id=inp.closest('tr').dataset.prod;const p=DB.products.find(x=>x.id===id);const v=parseFloat(inp.value);if(isNaN(v))return;p[inp.dataset.pf]=v;const {error}=await sb.from('products').update({price:v}).eq('id',id);if(error)toast('Save failed',I.issues);});
  document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editRecipe(b.dataset.edit));
  document.querySelectorAll('[data-delp]').forEach(b=>b.onclick=()=>{const p=DB.products.find(x=>x.id===b.dataset.delp);
    confirmModal('Remove coffee?',`"${esc(p.name)}" will be removed from the menu.`,'Remove',async()=>{const {error}=await sb.from('products').delete().eq('id',p.id);if(error){toast('Could not remove',I.issues);return;}await loadAll();render();toast('Coffee removed',I.trash);},true);});
  const addC=document.getElementById('addCoffee');if(addC)addC.onclick=addCoffee;

  // SETTINGS
  const setCur=document.getElementById('set-cur');
  if(setCur){
    setCur.onchange=()=>{const prev=document.getElementById('set-prev');const c=setCur.value;
      try{const f=new Intl.NumberFormat((CURRENCIES[c]||CURRENCIES.INR).locale,{style:'currency',currency:c,maximumFractionDigits:0});prev.innerHTML=`Sample price: <b>${f.format(220)}</b>. Prices are stored as numbers — changing currency changes the symbol, not the amount.`;}catch(e){}};
    document.getElementById('saveSettings').onclick=async()=>{
      const shopName=document.getElementById('set-shop').value.trim()||'GM Wellness';const currency=setCur.value;
      const {error}=await sb.from('shop_settings').update({shop_name:shopName,currency}).eq('id',1);
      if(error){toast('Could not save settings',I.issues);return;}
      DB.settings={shopName,currency};setShopName();render();toast('Settings saved',I.check);};
  }

  // TEAM
  document.querySelectorAll('[data-role]').forEach(s=>s.onchange=()=>changeRole(s.dataset.role,s.value,s));
  document.querySelectorAll('[data-resetpw]').forEach(b=>b.onclick=()=>resetPwModal(b.dataset.resetpw));
  document.querySelectorAll('[data-deluser]').forEach(b=>{if(!b.disabled)b.onclick=()=>removeUser(b.dataset.deluser);});
  const addU=document.getElementById('addUser');if(addU)addU.onclick=addUserModal;
}

/* ============================ TEAM LOGIC ============================ */
async function changeRole(id,role,selEl){
  const u=DB.users.find(x=>x.id===id);if(!u)return;
  if(u.role==='admin'&&role==='staff'&&adminCount()<=1){selEl.value='admin';toast('You need at least one admin',I.shield);return;}
  const {error}=await sb.from('profiles').update({role}).eq('id',id);
  if(error){selEl.value=u.role;toast(error.message||'Could not change role',I.issues);return;}
  u.role=role;
  if(u.id===me.id){me.role=role;setUserChrome();if(role==='staff')view='sell';renderNav();}
  render();
  toast(`${u.name} is now ${role==='admin'?'an Admin':'Staff'}`,I.check);
}
function removeUser(id){
  const u=DB.users.find(x=>x.id===id);if(!u)return;
  if(u.role==='admin'&&adminCount()<=1){toast('You need at least one admin',I.shield);return;}
  confirmModal('Remove team member?',`"${esc(u.name)}" (${esc(u.email)}) will lose access.`,'Remove',async()=>{
    const {error}=await sb.functions.invoke('admin-users',{body:{action:'delete',userId:id}});
    if(error){toast('Could not remove member',I.issues);return;}await loadAll();render();toast('Member removed',I.trash);
  },true);
}
function addUserModal(){
  openModal({title:'Add team member',confirmLabel:'Add member',
    body:`<div class="field"><label class="lab" for="nu-name">Name</label><input class="m-input" id="nu-name" placeholder="e.g. Sara"></div>
      <div class="field"><label class="lab" for="nu-email">Email</label><input class="m-input" id="nu-email" type="email" placeholder="name@gmwellness.app"></div>
      <div class="field"><label class="lab" for="nu-role">Role</label><select id="nu-role"><option value="staff">Staff — sell &amp; log issues</option><option value="admin">Admin — full access</option></select></div>
      <div class="field"><label class="lab" for="nu-pass">Temporary password</label><input class="m-input" id="nu-pass" value="welcome123"></div>
      <div class="help">They sign in with this and can change it later.</div>`,
    onConfirm:root=>{
      const name=root.querySelector('#nu-name').value.trim();
      const email=root.querySelector('#nu-email').value.trim().toLowerCase();
      const role=root.querySelector('#nu-role').value;
      const pass=root.querySelector('#nu-pass').value;
      if(!name||!email){toast('Name and email are required',I.issues);return false;}
      if(!/^\S+@\S+\.\S+$/.test(email)){toast('Enter a valid email',I.issues);return false;}
      if(DB.users.some(u=>u.email===email)){toast('That email is already in use',I.issues);return false;}
      if(!pass||pass.length<6){toast('Password needs 6+ characters',I.issues);return false;}
      sb.functions.invoke('admin-users',{body:{action:'create',email,password:pass,name,role}}).then(({error})=>{
        if(error){toast('Could not add member',I.issues);}else{loadAll().then(render);toast(`${name} added`,I.check);}});
    }});
}
function resetPwModal(id){
  const u=DB.users.find(x=>x.id===id);if(!u)return;
  openModal({title:`Reset password — ${esc(u.name)}`,confirmLabel:'Update password',
    body:`<div class="field"><label class="lab" for="rp-pass">New password</label><input class="m-input" id="rp-pass" value=""></div>
      <div class="help">Minimum 6 characters.</div>`,
    onConfirm:root=>{const pass=root.querySelector('#rp-pass').value;if(!pass||pass.length<6){toast('Password needs 6+ characters',I.issues);return false;}
      sb.functions.invoke('admin-users',{body:{action:'setPassword',userId:id,password:pass}}).then(({error})=>{if(error){toast('Could not update password',I.issues);}else{toast('Password updated',I.check);}});}});
}

/* ---------- add supply ---------- */
function addSupplyModal(){
  openModal({title:'Add supply',confirmLabel:'Add supply',
    body:`<div class="field"><label class="lab" for="ns-name">Name</label><input class="m-input" id="ns-name" placeholder="e.g. Vanilla Syrup"></div>
      <div class="form-grid">
        <div><label class="lab" for="ns-cat">Category</label><select id="ns-cat"><option>Beans</option><option>Milk</option><option selected>Extras</option><option>Consumables</option></select></div>
        <div><label class="lab" for="ns-unit">Unit</label><select id="ns-unit"><option value="g">grams (g)</option><option value="ml">millilitres (ml)</option><option value="pcs">pieces (pcs)</option></select></div>
        <div><label class="lab" for="ns-packet">Packet size</label><input class="m-input" id="ns-packet" type="number" min="1" value="1000"></div>
        <div><label class="lab" for="ns-per">Coffees / packet</label><input class="m-input" id="ns-per" type="number" min="1" value="50"></div>
        <div><label class="lab" for="ns-stock">In stock (units)</label><input class="m-input" id="ns-stock" type="number" min="0" value="1000"></div>
        <div><label class="lab" for="ns-par">Target (par)</label><input class="m-input" id="ns-par" type="number" min="1" value="2000"></div>
      </div>`,
    onConfirm:root=>{const name=root.querySelector('#ns-name').value.trim();if(!name){toast('Name is required',I.issues);return false;}
      const row={name,category:root.querySelector('#ns-cat').value,unit:root.querySelector('#ns-unit').value,
        packet_size:+root.querySelector('#ns-packet').value||1000,coffees_per_packet:+root.querySelector('#ns-per').value||50,
        stock:+root.querySelector('#ns-stock').value||0,par:+root.querySelector('#ns-par').value||2000};
      sb.from('ingredients').insert(row).then(({error})=>{if(error){toast('Could not add supply',I.issues);}else{loadAll().then(render);toast(`${name} added`,I.check);}});}});
}
async function addCoffee(){const {data,error}=await sb.from('products').insert({name:'New Coffee',price:150}).select().single();if(error){toast('Could not add coffee',I.issues);return;}await loadAll();manageTab='coffees';render();editRecipe(data.id);}

/* ---------- recipe modal ---------- */
function editRecipe(pid){
  const p=DB.products.find(x=>x.id===pid);if(!p)return;
  const draft=p.recipe.map(r=>[r[0],r[1]]);
  const root=document.getElementById('modalRoot');
  const ingOptions=sel=>DB.ingredients.map(x=>`<option value="${x.id}" ${x.id===sel?'selected':''}>${esc(x.name)} (${x.unit})</option>`).join('');
  const rowsHTML=()=>draft.map((r,idx)=>`<div class="recipe-row"><select data-ri="${idx}">${ingOptions(r[0])}</select>
      <input class="mini-input" style="width:100%;text-align:left" type="number" min="0" step="1" data-rq="${idx}" value="${r[1]}">
      <button class="icon-btn" data-rrm="${idx}" style="width:34px;height:34px" aria-label="Remove">${I.close}</button></div>`).join('');
  function draw(){
    root.innerHTML=`<div class="modal-bg" id="mbg"><div class="modal" role="dialog" aria-modal="true" aria-label="Edit recipe">
      <div class="modal-head"><h3>Edit coffee</h3><button class="icon-btn" id="mclose" aria-label="Close">${I.close}</button></div>
      <div class="modal-body">
        <div class="field"><label class="lab" for="mname">Name</label><input class="m-input" id="mname" value="${esc(p.name)}"></div>
        <div class="field"><label class="lab" for="mprice">Price (${curCode()})</label><input class="m-input" id="mprice" type="number" min="0" value="${p.price}"></div>
        <label class="lab" style="margin-top:6px">Ingredients used per cup</label><div id="recRows">${rowsHTML()}</div>
        <button class="btn-ghost btn-mini" id="addRow" style="margin-top:4px">${I.plus} Add ingredient</button></div>
      <div class="modal-foot"><button class="btn-ghost" id="mcancel">Cancel</button><button class="btn btn-primary" id="msave">${I.check} Save</button></div>
    </div></div>`;
    const close=()=>root.innerHTML='';
    document.getElementById('mbg').onclick=e=>{if(e.target.id==='mbg')close();};
    document.getElementById('mclose').onclick=close;document.getElementById('mcancel').onclick=close;
    document.querySelectorAll('[data-ri]').forEach(s=>s.onchange=()=>draft[+s.dataset.ri][0]=s.value);
    document.querySelectorAll('[data-rq]').forEach(i=>i.oninput=()=>draft[+i.dataset.rq][1]=parseFloat(i.value)||0);
    document.querySelectorAll('[data-rrm]').forEach(b=>b.onclick=()=>{draft.splice(+b.dataset.rrm,1);draw();});
    document.getElementById('addRow').onclick=()=>{draft.push(['arabica',10]);draw();};
    document.getElementById('msave').onclick=async()=>{const name=document.getElementById('mname').value.trim()||p.name;const price=parseFloat(document.getElementById('mprice').value)||0;const items=draft.filter(r=>r[1]>0);
      const up=await sb.from('products').update({name,price}).eq('id',p.id);if(up.error){toast('Save failed',I.issues);return;}
      await sb.from('recipe_items').delete().eq('product_id',p.id);
      if(items.length){const ins=await sb.from('recipe_items').insert(items.map(r=>({product_id:p.id,ingredient_id:r[0],qty:r[1]})));if(ins.error){toast('Recipe save failed',I.issues);return;}}
      close();await loadAll();render();toast('Coffee saved',I.check);};
  }
  draw();
}

/* ---------- generic modal + confirm ---------- */
function openModal(opts){
  const root=document.getElementById('modalRoot');
  root.innerHTML=`<div class="modal-bg" id="mbg"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(opts.title)}">
    <div class="modal-head"><h3>${esc(opts.title)}</h3><button class="icon-btn" id="mx" aria-label="Close">${I.close}</button></div>
    <div class="modal-body">${opts.body}</div>
    <div class="modal-foot"><button class="btn-ghost" id="mcancel">Cancel</button><button class="btn ${opts.danger?'btn-danger':'btn-primary'}" id="mok">${opts.confirmLabel||'Save'}</button></div>
  </div></div>`;
  const close=()=>root.innerHTML='';
  document.getElementById('mbg').onclick=e=>{if(e.target.id==='mbg')close();};
  document.getElementById('mx').onclick=close;document.getElementById('mcancel').onclick=close;
  document.getElementById('mok').onclick=()=>{if(opts.onConfirm){if(opts.onConfirm(root)===false)return;}close();};
  const f=root.querySelector('input,select,textarea');if(f)setTimeout(()=>f.focus(),40);
}
function confirmModal(title,msg,label,onYes,danger){
  openModal({title,confirmLabel:label,danger,body:`<p style="margin:0;color:var(--ink-soft);font-size:14.5px">${msg}</p>`,onConfirm:()=>{onYes();}});
}

/* ============================ TOAST ============================ */
function toast(msg,icon,actionLabel,action){
  const wrap=document.getElementById('toastWrap');clearTimeout(toastTimer);
  wrap.innerHTML=`<div class="toast"><span class="t-msg">${icon||''}${esc(msg)}</span>${actionLabel?`<button id="toastAct">${I.undo}${actionLabel}</button>`:''}</div>`;
  if(actionLabel)document.getElementById('toastAct').onclick=()=>{clearTimeout(toastTimer);wrap.innerHTML='';action&&action();};
  toastTimer=setTimeout(()=>{wrap.innerHTML='';},actionLabel?5000:2600);
}

/* ============================ THEME ============================ */
function getTheme(){try{return localStorage.getItem('gm_theme');}catch(e){return null;}}
function applyTheme(t){if(t)document.documentElement.setAttribute('data-theme',t);else document.documentElement.removeAttribute('data-theme');
  const dark=t?t==='dark':matchMedia('(prefers-color-scheme:dark)').matches;
  ['themeBtn','themeBtn2','loginTheme'].forEach(id=>{const b=document.getElementById(id);if(b)b.innerHTML=dark?I.sun:I.moon;});}
function toggleTheme(){const cur=document.documentElement.getAttribute('data-theme');const dark=cur?cur==='dark':matchMedia('(prefers-color-scheme:dark)').matches;const next=dark?'light':'dark';try{localStorage.setItem('gm_theme',next);}catch(e){}applyTheme(next);}

/* ============================ AUTH ============================ */
function setUserChrome(){
  const initial=me.name[0].toUpperCase();
  document.getElementById('sbAvatar').textContent=initial;document.getElementById('tbAvatar').textContent=initial;
  document.getElementById('sbWho').textContent=me.name;
  document.getElementById('sbRole').textContent=me.role==='admin'?'Owner · Admin':'Barista · Staff';
}
async function signIn(){
  const email=document.getElementById('email').value.trim().toLowerCase();
  const pass=document.getElementById('pass').value;
  const err=document.getElementById('loginErr');
  const btn=document.getElementById('signin');btn.disabled=true;
  const {error}=await sb.auth.signInWithPassword({email,password:pass});
  btn.disabled=false;
  if(error){err.textContent='Incorrect email or password.';return;}
  err.textContent='';await afterLogin();
}
async function afterLogin(){
  const {data:{user}}=await sb.auth.getUser();if(!user)return;
  const {data:prof}=await sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
  me={id:user.id,name:prof?prof.name:user.email,role:prof?prof.role:'staff'};
  document.getElementById('login').style.display='none';document.getElementById('app').classList.add('on');
  await loadAll();setUserChrome();setShopName();view='sell';renderNav();render();
}
async function signOut(){await sb.auth.signOut();me=null;document.getElementById('app').classList.remove('on');document.getElementById('login').style.display='grid';document.getElementById('pass').value='';document.getElementById('loginErr').textContent='';}

/* ============================ INIT ============================ */
(function init(){
  applyTheme(getTheme()||'light');setShopName();
  ['loginLogo','sbLogo','tbLogo'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML=I.logo;});
  document.getElementById('loginTheme').onclick=toggleTheme;
  document.getElementById('signin').onclick=signIn;
  document.getElementById('pass').addEventListener('keydown',e=>{if(e.key==='Enter')signIn();});
  document.getElementById('email').addEventListener('keydown',e=>{if(e.key==='Enter')signIn();});
  document.querySelectorAll('[data-demo]').forEach(b=>b.onclick=()=>{const [em,pw]=b.dataset.demo.split('|');document.getElementById('email').value=em;document.getElementById('pass').value=pw;document.getElementById('loginErr').textContent='';});
  const pwt=document.getElementById('pwToggle');pwt.innerHTML=I.eye;
  pwt.onclick=()=>{const inp=document.getElementById('pass');const show=inp.type==='password';inp.type=show?'text':'password';pwt.innerHTML=show?I.eyeoff:I.eye;pwt.setAttribute('aria-label',show?'Hide password':'Show password');};
  document.getElementById('themeBtn').onclick=toggleTheme;document.getElementById('themeBtn2').onclick=toggleTheme;
  document.getElementById('logoutBtn').onclick=signOut;document.getElementById('logoutBtn2').onclick=signOut;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const r=document.getElementById('modalRoot');if(r.innerHTML)r.innerHTML='';}});
  sb.auth.getSession().then(({data})=>{if(data&&data.session)afterLogin();});
})();
