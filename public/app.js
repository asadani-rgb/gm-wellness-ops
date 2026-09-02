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
  bean:'<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="7.5" ry="9" transform="rotate(35 12 12)" stroke="currentColor" stroke-width="1.6"/><path d="M8 8c3 2 5 5 8 8" stroke="currentColor" stroke-width="1.5"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 4v10m0 0 4-4m-4 4-4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 19h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 20V10m0 0 4 4m-4-4-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 5h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  receipt:'<svg viewBox="0 0 24 24" fill="none"><path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  cart:'<svg viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.2L21 8H6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.3" fill="currentColor"/><circle cx="17.5" cy="20" r="1.3" fill="currentColor"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>'
};

/* ============================ SUPABASE CLIENT ============================ */
const cfg = window.GM_CONFIG || {};
const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

function mapIngredient(r){return {id:r.id,name:r.name,cat:r.category,unit:r.unit,packet:Number(r.packet_size),perPacket:Number(r.coffees_per_packet),stock:Number(r.stock),par:Number(r.par)};}
function mapProduct(r){return {id:r.id,name:r.name,price:Number(r.price),recipe:(r.recipe_items||[]).map(ri=>[ri.ingredient_id,Number(ri.qty)])};}

/* ============================ STATE ============================ */
const DEF_SETTINGS={shopName:'GM Wellness',currency:'INR',legalName:'',gstin:'',address:'',state:'',phone:'',fssai:'',invoicePrefix:'GMW',gstRate:5,orderTypeOn:true};
let DB={ingredients:[],products:[],extras:[],orders:[],orderItems:[],issues:[],users:[],settings:{...DEF_SETTINGS}};
let me=null, view='sell', lastSale=null, toastTimer=null, manageTab='supplies';
let cart=[]; // [{uid, pid, name, price, qty, extras:[{id,name,price}]}]
let coState={orderType:'dine-in',paymentMode:'Cash'};

function mapSettings(d){ return d? {shopName:d.shop_name,currency:d.currency,legalName:d.legal_name||'',gstin:d.gstin||'',address:d.address||'',state:d.state||'',phone:d.phone||'',fssai:d.fssai||'',invoicePrefix:d.invoice_prefix||'GMW',gstRate:d.gst_rate!=null?Number(d.gst_rate):5,orderTypeOn:d.order_type_on!==false} : {...DEF_SETTINGS}; }

async function loadAll(){
  const since=new Date(Date.now()-14*86400000).toISOString();
  const [ings,prods,setts,users,issues,extras,eprods,orders]=await Promise.all([
    sb.from('ingredients').select('*').order('name'),
    sb.from('products').select('*, recipe_items(ingredient_id, qty)').order('name'),
    sb.from('shop_settings').select('*').eq('id',1).maybeSingle(),
    sb.from('profiles').select('*').order('created_at'),
    sb.from('issues').select('id, ingredient_id, amount, mode, reason, created_at, profiles(name)').order('created_at',{ascending:false}).limit(50),
    sb.from('extras').select('*').order('name'),
    sb.from('extra_products').select('*'),
    sb.from('orders').select('*, order_items(*)').gte('created_at',since).order('created_at',{ascending:false})
  ]);
  if(ings.data) DB.ingredients=ings.data.map(mapIngredient);
  if(prods.data) DB.products=prods.data.map(mapProduct);
  DB.settings=mapSettings(setts.data);
  if(users.data) DB.users=users.data.map(u=>({id:u.id,name:u.name,email:u.email,role:u.role}));
  if(issues.data) DB.issues=issues.data.map(i=>({id:i.id,ing:i.ingredient_id,amount:Number(i.amount),mode:i.mode,reason:i.reason,by:(i.profiles&&i.profiles.name)||'—',ts:new Date(i.created_at).getTime()}));
  if(extras.data){
    const map={}; (eprods.data||[]).forEach(m=>{(map[m.extra_id]=map[m.extra_id]||[]).push(m.product_id);});
    DB.extras=extras.data.map(e=>({id:e.id,name:e.name,price:Number(e.price),ingredientId:e.ingredient_id,qty:Number(e.qty),active:e.active,products:map[e.id]||[]}));
  }
  if(orders.data){
    DB.orders=orders.data.map(o=>({id:o.id,invoiceNo:o.invoice_no,gross:Number(o.gross),taxable:Number(o.taxable),cgst:Number(o.cgst),sgst:Number(o.sgst),tax:Number(o.tax),roundOff:Number(o.round_off),total:Number(o.total),paymentMode:o.payment_mode,orderType:o.order_type,ts:new Date(o.created_at).getTime(),
      items:(o.order_items||[]).map(li=>({id:li.id,pid:li.product_id,name:li.product_name,qty:li.qty,unitPrice:Number(li.unit_price),extras:li.extras||[],lineTotal:Number(li.line_total)}))}));
    DB.orderItems=[]; DB.orders.forEach(o=>o.items.forEach(li=>DB.orderItems.push({pid:li.pid,name:li.name,qty:li.qty,lineTotal:li.lineTotal,ts:o.ts})));
  }
}
const extrasFor=pid=>DB.extras.filter(e=>e.active&&e.products.includes(pid));
// Typical per-serving amounts (industry standards) for defaults + soft warnings.
function stdFor(x,ctx){
  if(!x) return {def:1,min:0,max:1e12};
  const cat=(x.cat||'').toLowerCase(), u=x.unit;
  if(cat==='beans') return {def:18,min:7,max:25};
  if(cat==='milk')  return {def:ctx==='extra'?40:150,min:20,max:200};
  if(u==='pcs')     return {def:1,min:1,max:3};
  if(u==='ml')      return {def:10,min:5,max:30};   // syrups etc.
  if(u==='g')       return {def:10,min:5,max:20};   // powders/toppings
  return {def:1,min:0,max:1e12};
}
function rangeMsg(x,val,ctx){
  if(!x||!(val>0)) return '';
  const s=stdFor(x,ctx);
  if(val<s.min) return `⚠ ${fmtNum(val)}${x.unit} looks low for ${x.name} — typical ${s.min}–${s.max}${x.unit} per ${ctx==='extra'?'extra':'cup'}`;
  if(val>s.max) return `⚠ ${fmtNum(val)}${x.unit} looks high for ${x.name} — typical ${s.min}–${s.max}${x.unit} per ${ctx==='extra'?'extra':'cup'}`;
  return '';
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
  {id:'orders',label:'Orders',icon:I.receipt,roles:['admin','staff']},
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
async function go(v){view=v;renderNav();render();window.scrollTo({top:0,behavior:'instant'});try{await loadAll();render();}catch(e){}}

/* ============================ RENDER ============================ */
function render(){
  const el=document.getElementById('view');
  const map={sell:viewSell,checkout:viewCheckout,orders:viewOrders,stock:viewStock,issues:viewIssues,analytics:viewAnalytics,manage:viewManage};
  el.innerHTML=(map[view]||viewSell)();
  wire();
}

/* ---------- SELL (cart) ---------- */
function cartCount(){return cart.reduce((a,l)=>a+l.qty,0);}
function lineGross(l){return (l.price+l.extras.reduce((s,e)=>s+e.price,0))*l.qty;}
function cartTotal(){return cart.reduce((a,l)=>a+lineGross(l),0);}
function cartBar(){ if(!cart.length) return ''; return `<div class="cartbar"><div class="cb-info">${I.cart}<span><b>${cartCount()}</b> item${cartCount()>1?'s':''} · ${money(cartTotal())}</span></div><button class="btn btn-primary" data-goto="checkout">Review order →</button></div>`; }
function viewSell(){
  const lowItems=DB.ingredients.filter(x=>statusOf(ratio(x))!=='good').sort((a,b)=>ratio(a)-ratio(b));
  const lowCount=lowItems.length; const lowNames=lowItems.map(x=>x.name);
  const cards=DB.products.map(p=>{
    const {cups,limitId}=cupCapacity(p); const lim=ing(limitId);
    const rq=limitId?p.recipe.find(r=>r[0]===limitId)[1]:1;
    const target=lim?Math.max(cups,Math.floor(lim.par/rq)):cups;
    const pct=target?Math.round(cups/target*100):0;
    const s=cups<8?'crit':cups<20?'warn':(pct<40?'warn':'good');
    const disabled=cups<=0; const nEx=extrasFor(p.id).length;
    return `<div class="card prod ${disabled?'out':''}">
      <div class="p-top"><h3>${esc(p.name)}</h3><span class="price">${money(p.price)}</span></div>
      <div class="cups"><b class="num">${cups}</b> cups can be made</div>
      <div class="bar ${s}"><i style="width:${Math.max(disabled?0:4,pct)}%"></i></div>
      <div class="limit">${disabled?'Out of stock':(lim?('Limited by '+esc(lim.name)):(nEx?`${nEx} extra${nEx>1?'s':''} available`:''))}</div>
      <div class="sell-row"><button class="btn-sell" data-add="${p.id}" ${disabled?'disabled':''}>${I.plus} Add to order</button></div>
    </div>`;
  }).join('');
  return `<div class="page-head">
      <div><h1>Sell coffee</h1><div class="ph-sub">Add drinks &amp; extras to the order, then review with the customer.</div></div>
      ${lowCount?`<button class="pill warn" data-goto="stock" data-tip="Tap to open Stock. Needs restock: ${esc(lowNames.join(', '))}" style="border:none;cursor:pointer;text-align:left;max-width:100%;white-space:normal">${I.issues} Restock: ${esc(lowNames.slice(0,3).join(', '))}${lowNames.length>3?` +${lowNames.length-3} more`:''}</button>`:`<span class="pill good">${I.check} All stock healthy</span>`}
    </div><div class="grid sell-grid">${cards}</div>${cartBar()}`;
}
function openAddModal(pid){
  const p=DB.products.find(x=>x.id===pid); if(!p)return;
  const exs=extrasFor(pid); let qty=1; const sel={};
  const root=document.getElementById('modalRoot');
  const lineTot=()=>{let ex=0;exs.forEach(e=>{if(sel[e.id])ex+=e.price;});return (p.price+ex)*qty;};
  function draw(){
    root.innerHTML=`<div class="modal-bg" id="mbg"><div class="modal" role="dialog" aria-modal="true" aria-label="Add ${esc(p.name)}">
      <div class="modal-head"><h3>${esc(p.name)}</h3><button class="icon-btn" id="mx">${I.close}</button></div>
      <div class="modal-body">
        <div class="addrow"><span>Quantity</span><div class="qty"><button class="icon-btn" id="qminus" aria-label="Decrease">${I.minus}</button><b id="qval">${qty}</b><button class="icon-btn" id="qplus" aria-label="Increase">${I.plus}</button></div></div>
        ${exs.length?`<div class="lab" style="margin-top:16px">Extras</div>${exs.map(e=>`<label class="exrow"><span><input type="checkbox" data-ex="${e.id}" ${sel[e.id]?'checked':''}> ${esc(e.name)}</span><span class="expr ${e.price>0?'':'free'}">${e.price>0?('+ '+money(e.price)):'Free'}</span></label>`).join('')}`:'<div class="help" style="margin-top:14px">No extras configured for this drink.</div>'}
      </div>
      <div class="modal-foot"><button class="btn-ghost" id="mcancel">Cancel</button><button class="btn btn-primary" id="madd">${I.cart} Add · <span id="mlt">${money(lineTot())}</span></button></div>
    </div></div>`;
    const close=()=>root.innerHTML='';
    document.getElementById('mbg').onclick=e=>{if(e.target.id==='mbg')close();};
    document.getElementById('mx').onclick=close; document.getElementById('mcancel').onclick=close;
    document.getElementById('qminus').onclick=()=>{if(qty>1){qty--;draw();}};
    document.getElementById('qplus').onclick=()=>{qty++;draw();};
    root.querySelectorAll('[data-ex]').forEach(cb=>cb.onchange=()=>{sel[cb.dataset.ex]=cb.checked;document.getElementById('mlt').textContent=money(lineTot());});
    document.getElementById('madd').onclick=()=>{
      const chosen=exs.filter(e=>sel[e.id]).map(e=>({id:e.id,name:e.name,price:e.price}));
      cart.push({uid:'c'+Date.now()+Math.random().toString(36).slice(2,6),pid:p.id,name:p.name,price:p.price,qty,extras:chosen});
      close(); render(); toast(`Added ${qty}× ${p.name}`,I.cart);
    };
  }
  draw();
}

/* ---------- CHECKOUT ---------- */
function viewCheckout(){
  if(!cart.length) return `<div class="page-head"><div><h1>Review order</h1></div></div><div class="card card-pad"><div class="empty">${I.cart}<div>Your order is empty.</div></div><div style="text-align:center;margin-top:8px"><button class="btn btn-primary" data-goto="sell">Back to Sell</button></div></div>`;
  const rows=cart.map(l=>`<div class="co-row"><div class="co-main"><b>${esc(l.name)}</b>${l.extras.length?`<div class="co-ex">+ ${l.extras.map(e=>esc(e.name)+(e.price>0?` (${money(e.price)})`:'')).join(', ')}</div>`:''}</div>
      <div class="qty"><button class="icon-btn" data-cq="-" data-uid="${l.uid}" aria-label="Decrease">${I.minus}</button><b>${l.qty}</b><button class="icon-btn" data-cq="+" data-uid="${l.uid}" aria-label="Increase">${I.plus}</button></div>
      <div class="co-amt num">${money(lineGross(l))}</div>
      <button class="icon-btn" data-crm="${l.uid}" aria-label="Remove" style="width:32px;height:32px">${I.trash}</button></div>`).join('');
  const gross=cartTotal(), rate=DB.settings.gstRate||5, total=Math.round(gross);
  const taxable=+(total/(1+rate/100)).toFixed(2), tax=+(total-taxable).toFixed(2), cgst=+(tax/2).toFixed(2), sgst=+(tax-cgst).toFixed(2);
  const otOn=DB.settings.orderTypeOn!==false;
  return `<div class="page-head"><div><h1>Review order</h1><div class="ph-sub">Confirm with the customer, then submit.</div></div><button class="btn-ghost" data-goto="sell">${I.plus} Add more</button></div>
    <div class="grid two-col">
      <div class="card card-pad"><div class="section-title">Items · ${cartCount()}</div><div style="margin-top:8px">${rows}</div></div>
      <div class="card card-pad">
        ${otOn?`<label class="lab">Order type</label><div class="seg-inline" role="group" aria-label="Order type" style="margin-bottom:14px">${['dine-in','takeaway'].map(t=>`<button type="button" data-ot="${t}" aria-pressed="${coState.orderType===t}">${t==='dine-in'?'Dine-in':'Takeaway'}</button>`).join('')}</div>`:''}
        <label class="lab">Payment mode</label><div class="seg-inline" role="group" aria-label="Payment mode">${['Cash','UPI','Card'].map(m=>`<button type="button" data-pm="${m}" aria-pressed="${coState.paymentMode===m}">${m}</button>`).join('')}</div>
        <div class="co-tot"><div><span>Taxable value</span><b class="num">${money(taxable)}</b></div><div><span>CGST @ ${rate/2}%</span><b class="num">${money(cgst)}</b></div><div><span>SGST @ ${rate/2}%</span><b class="num">${money(sgst)}</b></div><div class="co-grand"><span>Total payable</span><b class="num">${money(total)}</b></div></div>
        <div style="margin-top:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <span class="help">Prices incl. GST ${rate}%</span>
          <button class="btn btn-primary" id="submitOrder">${I.check} Submit &amp; generate bill</button>
        </div>
      </div>
    </div>`;
}
async function submitOrder(){
  if(!cart.length)return;
  const payload={payment_mode:coState.paymentMode,order_type:(DB.settings.orderTypeOn!==false)?coState.orderType:null,
    items:cart.map(l=>({product_id:l.pid,qty:l.qty,extras:l.extras.map(e=>e.id)}))};
  const btn=document.getElementById('submitOrder'); if(btn){btn.disabled=true;btn.textContent='Submitting…';}
  const {data,error}=await sb.rpc('record_order',{p_payload:payload});
  if(error){if(btn){btn.disabled=false;btn.innerHTML=I.check+' Submit &amp; generate bill';}toast(error.message||'Could not submit order',I.issues);return;}
  cart=[]; await loadAll();
  const ord=DB.orders.find(o=>o.id===data);
  view='sell'; renderNav(); render();
  if(ord) showReceipt(ord); else toast('Order recorded',I.check);
}

/* ---------- RECEIPT ---------- */
function receiptHTML(o){
  const s=DB.settings, rate=s.gstRate||5;
  const lines=o.items.map(li=>{
    const exLine=(li.extras&&li.extras.length)?`<div class="rc-ex">+ ${li.extras.map(e=>esc(e.name)+(Number(e.price)>0?` (${money(e.price)})`:'')).join(', ')}</div>`:'';
    return `<tr><td>${esc(li.name)}${exLine}</td><td class="r num">${li.qty}</td><td class="r num">${money(li.unitPrice)}</td><td class="r num">${money(li.lineTotal)}</td></tr>`;}).join('');
  const dt=new Date(o.ts);
  return `<div id="receiptDoc" class="receipt">
    <div class="rc-head">
      <div class="rc-shop">${esc(s.legalName||s.shopName||'GM Wellness')}</div>
      ${s.address?`<div class="rc-line">${esc(s.address)}</div>`:''}
      ${s.state?`<div class="rc-line">${esc(s.state)}</div>`:''}
      ${s.phone?`<div class="rc-line">Ph: ${esc(s.phone)}</div>`:''}
      ${s.gstin?`<div class="rc-line"><b>GSTIN:</b> ${esc(s.gstin)}</div>`:'<div class="rc-line" style="color:#b00">Set GSTIN in Admin → Settings</div>'}
      ${s.fssai?`<div class="rc-line">FSSAI: ${esc(s.fssai)}</div>`:''}
    </div>
    <div class="rc-title">TAX INVOICE</div>
    <div class="rc-meta"><span>${esc(o.invoiceNo||'-')}</span><span>${dt.toLocaleDateString('en-IN')} ${dt.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span></div>
    <div class="rc-meta"><span>${o.orderType?('Type: '+o.orderType):''}</span><span>${o.paymentMode?('Paid: '+o.paymentMode):''}</span></div>
    <table class="rc-tbl"><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead><tbody>${lines}</tbody></table>
    <div class="rc-tot">
      <div><span>Taxable value</span><b class="num">${money(o.taxable)}</b></div>
      <div><span>CGST @ ${rate/2}%</span><b class="num">${money(o.cgst)}</b></div>
      <div><span>SGST @ ${rate/2}%</span><b class="num">${money(o.sgst)}</b></div>
      ${Math.abs(o.roundOff)>=0.005?`<div><span>Round off</span><b class="num">${money(o.roundOff)}</b></div>`:''}
      <div class="rc-grand"><span>Total</span><b class="num">${money(o.total)}</b></div>
    </div>
    <div class="rc-foot">SAC 9963 · Prices inclusive of GST @ ${rate}%<br>
      This is a computer-generated invoice and does not require a signature.<br>
      ${s.state?('Subject to '+esc(s.state)+' jurisdiction. '):''}Goods once sold are not returnable.<br>
      <b>Thank you &amp; see you again!</b></div>
  </div>`;
}
function showReceipt(o){
  const root=document.getElementById('modalRoot');
  root.innerHTML=`<div class="modal-bg" id="mbg"><div class="modal" role="dialog" aria-modal="true" aria-label="Receipt">
    <div class="modal-body" style="padding:16px">${receiptHTML(o)}</div>
    <div class="modal-foot"><button class="btn-ghost" id="rcClose">Close</button><button class="btn-ghost" id="rcPdf">${I.download} PDF</button><button class="btn btn-primary" id="rcPrint">${I.receipt} Print / Save PDF</button></div>
  </div></div>`;
  const close=()=>root.innerHTML='';
  document.getElementById('mbg').onclick=e=>{if(e.target.id==='mbg')close();};
  document.getElementById('rcClose').onclick=close;
  document.getElementById('rcPrint').onclick=()=>window.print();
  document.getElementById('rcPdf').onclick=()=>downloadReceiptPDF(o);
}
function downloadReceiptPDF(o){
  try{
    const s=DB.settings, rate=s.gstRate||5; const jsPDF=window.jspdf&&window.jspdf.jsPDF;
    if(!jsPDF){window.print();return;}
    const M=n=>curCode()==='INR'?('Rs '+Math.round(n).toLocaleString('en-IN')):money(n);
    const doc=new jsPDF({unit:'pt',format:[300,820]}); let y=28; const L=16, R=284;
    const line=(t,opt={})=>{doc.setFont('helvetica',opt.b?'bold':'normal');doc.setFontSize(opt.s||10);doc.text(String(t),opt.c?150:(opt.right?R:L),y,{align:opt.c?'center':(opt.right?'right':'left')});y+=(opt.s||10)+4;};
    const rowLR=(l,r,b)=>{doc.setFont('helvetica',b?'bold':'normal');doc.setFontSize(10);doc.text(String(l),L,y);doc.text(String(r),R,y,{align:'right'});y+=15;};
    doc.setFont('helvetica','bold');doc.setFontSize(13);doc.text(s.legalName||s.shopName||'GM Wellness',150,y,{align:'center'});y+=18;
    if(s.address){line(s.address,{c:true,s:8});} if(s.state){line(s.state,{c:true,s:8});}
    if(s.gstin){line('GSTIN: '+s.gstin,{c:true,s:8});} if(s.fssai){line('FSSAI: '+s.fssai,{c:true,s:8});}
    y+=4; line('TAX INVOICE',{c:true,b:true,s:11});
    const dt=new Date(o.ts); rowLR(o.invoiceNo||'-', dt.toLocaleDateString('en-IN'));
    rowLR((o.orderType||''),(o.paymentMode?('Paid: '+o.paymentMode):''));
    y+=2; doc.setLineWidth(0.5); doc.line(L,y,R,y); y+=14;
    rowLR('Item','Amt',true);
    o.items.forEach(li=>{ rowLR(li.qty+'x '+li.name, M(li.lineTotal));
      if(li.extras&&li.extras.length){doc.setFontSize(8);doc.setFont('helvetica','italic');doc.text('+ '+li.extras.map(e=>e.name).join(', '),L+8,y);y+=12;doc.setFont('helvetica','normal');}});
    y+=2; doc.line(L,y,R,y); y+=14;
    rowLR('Taxable', M(o.taxable)); rowLR('CGST @'+(rate/2)+'%', M(o.cgst)); rowLR('SGST @'+(rate/2)+'%', M(o.sgst));
    if(Math.abs(o.roundOff)>=0.005) rowLR('Round off', M(o.roundOff));
    rowLR('TOTAL', M(o.total), true);
    y+=6; line('SAC 9963 - incl. GST '+rate+'%',{c:true,s:8});
    line('Computer-generated invoice; no signature required.',{c:true,s:7});
    line((s.state?('Subject to '+s.state+' jurisdiction. '):'')+'Goods once sold not returnable.',{c:true,s:7});
    line('Thank you & see you again!',{c:true,s:9});
    doc.save((o.invoiceNo||'receipt').replace(/[\\/]/g,'-')+'.pdf');
  }catch(e){window.print();}
}

/* ---------- ORDERS (history) ---------- */
let orderQuery='';
function viewOrders(){
  const DAY=86400000, now=Date.now();
  const q=orderQuery.trim().toLowerCase();
  const list=DB.orders.filter(o=>!q||(o.invoiceNo||'').toLowerCase().includes(q)||o.items.some(li=>li.name.toLowerCase().includes(q)));
  const rows=list.map(o=>{
    const canRev=me.role==='admin'||o.ts>now-DAY;
    const items=o.items.map(li=>`${li.qty}× ${esc(li.name)}`).join(', ');
    return `<tr><td><b>${esc(o.invoiceNo||'-')}</b><div style="font-size:11.5px;color:var(--ink-faint)">${esc(items)}</div></td>
      <td style="font-size:12.5px;color:var(--ink-soft);white-space:nowrap">${timeAgo(o.ts)}</td>
      <td class="r"><span class="pill neutral" style="font-size:10.5px">${esc(o.paymentMode||'-')}</span></td>
      <td class="r num"><b>${money(o.total)}</b></td>
      <td class="r"><div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn-ghost btn-mini" data-viewrcpt="${o.id}">${I.receipt} Bill</button><button class="btn-ghost btn-mini" data-revorder="${o.id}" ${canRev?'':'disabled style="opacity:.4"'}>${I.undo} Reverse</button></div></td></tr>`;
  }).join('');
  const rev14=DB.orders.reduce((a,o)=>a+o.total,0);
  return `<div class="page-head"><div><h1>Orders</h1><div class="ph-sub">Last 14 days · ${DB.orders.length} orders · ${money(rev14)}</div></div></div>
    <div class="card card-pad" style="margin-bottom:14px"><input class="m-input" id="orderSearch" placeholder="Search invoice number or item…" value="${esc(orderQuery)}"></div>
    <div class="card"><div class="tbl-wrap"><table><thead><tr><th>Invoice &amp; items</th><th>When</th><th class="r">Paid</th><th class="r">Total</th><th class="r">Actions</th></tr></thead>
      <tbody>${rows||'<tr><td colspan="5" class="empty">No orders yet.</td></tr>'}</tbody></table></div></div>
    <p class="help" style="margin-top:12px">Open any bill to reprint. Reverse restores stock &amp; removes the order (within 24 h for staff; anytime for admins).</p>`;
}

/* ---------- STOCK ---------- */
function viewStock(){
  const order={crit:0,warn:1,good:2};
  const rows=[...DB.ingredients].sort((a,b)=>order[statusOf(ratio(a))]-order[statusOf(ratio(b))]).map(x=>{
    const r=ratio(x),s=statusOf(r),cl=coffeesLeft(x),pk=x.stock/x.packet;
    return `<div class="stock-row">
      <div class="sr-head">
        <div class="ing-name"><span class="ing-dot ${s}"></span>${esc(x.name)}</div>
        <div class="stk-right"><b class="num">${fmtNum(Math.round(x.stock))}<span style="font-size:12px;font-weight:600;color:var(--ink-faint)">${x.unit}</span></b> · <span class="st ${s}">${statusLabel(s)}</span></div>
      </div>
      <div class="ing-meta"><b class="num">${cl}</b> coffees' worth left · ${pk.toFixed(1)} packets · ${esc(x.cat)}, 1 packet = ${fmtNum(x.packet)}${x.unit} ≈ ${x.perPacket} cups</div>
      <div class="bar ${s}"><i style="width:${Math.max(3,Math.round(r*100))}%"></i></div>
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
  const DAY=86400000,now=Date.now();
  const items=DB.orderItems;
  const totalCups=items.reduce((a,i)=>a+i.qty,0);
  const totalRev=DB.orders.reduce((a,o)=>a+o.total,0);
  const ordersCount=DB.orders.length;
  const aov=ordersCount?totalRev/ordersCount:0;
  const lowItems=DB.ingredients.filter(x=>statusOf(ratio(x))!=='good').sort((a,b)=>ratio(a)-ratio(b));
  const lowCount=lowItems.length; const lowNames=lowItems.map(x=>x.name);
  const byP={}; items.forEach(i=>{if(!byP[i.pid])byP[i.pid]={name:i.name,cups:0};byP[i.pid].cups+=i.qty;});
  const prodArr=Object.values(byP).sort((a,b)=>b.cups-a.cups); const maxCups=Math.max(1,...prodArr.map(p=>p.cups)); const top=prodArr[0];
  const hbars=prodArr.map(p=>`<div class="hbar"><span class="hl">${esc(p.name)}</span><span class="htrack"><i style="width:${Math.round(p.cups/maxCups*100)}%"></i></span><span class="hv num">${p.cups}</span></div>`).join('');
  const days=[]; for(let d=13;d>=0;d--){const st=new Date(now-d*DAY);st.setHours(0,0,0,0);const en=st.getTime()+DAY;
    days.push({cups:items.filter(i=>i.ts>=st.getTime()&&i.ts<en).reduce((a,i)=>a+i.qty,0),lab:new Date(st).toLocaleDateString('en-IN',{weekday:'short'}).slice(0,2),today:d===0});}
  const maxDay=Math.max(1,...days.map(d=>d.cups));
  const cols=days.map(d=>`<div class="col ${d.today?'today':''}" data-tip="${d.lab}: ${d.cups} cups"><div class="cbar" style="height:${Math.max(3,Math.round(d.cups/maxDay*120))}px"></div><div class="clab">${d.lab}</div></div>`).join('');
  const emptyChart=`<div class="empty">${I.analytics}<div>No sales in the last 14 days yet.<br>Record sales on the Sell screen and they'll appear here.</div></div>`;
  const order={crit:0,warn:1,good:2};
  const health=[...DB.ingredients].sort((a,b)=>order[statusOf(ratio(a))]-order[statusOf(ratio(b))]).slice(0,6).map(x=>{const r=ratio(x),s=statusOf(r);
    return `<div class="hbar"><span class="hl">${esc(x.name)}</span><span class="htrack"><i style="width:${Math.max(3,Math.round(r*100))}%;background:var(--${s})"></i></span><span class="hv num" style="color:var(--${s})">${coffeesLeft(x)}</span></div>`;}).join('');
  return `<div class="page-head"><div><h1>Analytics</h1><div class="ph-sub">Sales and stock over the last 14 days.</div></div><span class="pill neutral">Last 14 days</span></div>
    <div class="grid kpi-grid" style="margin-bottom:16px">
      <div class="card kpi"><div class="k-lab">${I.analytics} Revenue</div><div class="k-val">${money(totalRev)}</div><div class="k-sub">${ordersCount} orders · ${totalCups} cups</div></div>
      <div class="card kpi"><div class="k-lab">${I.sell} Avg. order</div><div class="k-val">${money(aov)}</div><div class="k-sub">per order</div></div>
      <div class="card kpi"><div class="k-lab">${I.bean} Top seller</div><div class="k-val" style="font-size:26px">${top?esc(top.name):'—'}</div><div class="k-sub">${top?top.cups+' cups':''}</div></div>
      <button class="card kpi" data-goto="stock" data-tip="${lowCount?('Needs restock: '+esc(lowNames.join(', '))):'All items healthy'}" style="border:1px solid var(--line);text-align:left;cursor:pointer;font:inherit"><div class="k-lab">${I.stock} Needs restock</div><div class="k-val" style="color:${lowCount?'var(--warn)':'var(--good)'}">${lowCount}</div><div class="k-sub">${lowCount?esc(lowNames.slice(0,2).join(', '))+(lowNames.length>2?` +${lowNames.length-2} more`:''):'all healthy'}</div></button>
    </div>
    <div class="grid two-col" style="margin-bottom:16px">
      <div class="card card-pad"><div class="section-title">Cups sold by coffee</div><div class="section-sub">Which drinks move — last 14 days.</div>${totalCups?`<div class="hbars">${hbars}</div>`:emptyChart}</div>
      <div class="card card-pad"><div class="section-title">Daily volume</div><div class="section-sub">Cups sold per day (today highlighted).</div>${totalCups?`<div class="cols" role="img" aria-label="Daily cups sold over 14 days">${cols}</div>`:emptyChart}</div>
    </div>
    <div class="card card-pad"><div class="section-title">Stock situation</div><div class="section-sub">Coffees' worth remaining — lowest first. Colour shows status.</div><div class="hbars">${health}</div></div>`;
}

/* ---------- ADMIN (Manage) ---------- */
function viewManage(){
  const tabs=[['supplies','Supplies'],['coffees','Coffees'],['extras','Extras'],['team','Team'],['settings','Settings']];
  return `<div class="page-head"><div><h1>Admin</h1><div class="ph-sub">Set up your coffees, supplies, extras, team and shop settings.</div></div>
    <div class="seg" role="tablist">${tabs.map(([k,l])=>`<button role="tab" data-mtab="${k}" aria-selected="${manageTab===k}">${l}</button>`).join('')}</div></div>
    ${manageTab==='supplies'?manageSupplies():manageTab==='coffees'?manageCoffees():manageTab==='extras'?manageExtras():manageTab==='team'?manageTeam():manageSettings()}`;
}
function manageSupplies(){
  const rows=DB.ingredients.map(x=>{const s=statusOf(ratio(x));
    const implied=x.perPacket?x.packet/x.perPacket:0; const sstd=stdFor(x,'recipe'); const flag=implied>0&&(implied<sstd.min||implied>sstd.max);
    return `<tr data-ing="${x.id}"><td><b>${esc(x.name)}</b><div style="font-size:11.5px;color:var(--ink-faint)">${esc(x.cat)} · measured in ${x.unit}</div></td>
      <td><div class="numcell"><span class="unit"></span><input class="mini-input" type="number" min="1" data-f="packet" value="${x.packet}" data-tip="How much one packet/bag holds, in ${x.unit}"><span class="unit">${x.unit}</span></div></td>
      <td><div class="numcell"><span class="unit"></span><input class="mini-input" type="number" min="1" data-f="perPacket" value="${x.perPacket}" data-tip="How many cups one packet makes"><span class="unit"></span></div></td>
      <td><div class="numcell"><span class="unit"></span><input class="mini-input" type="number" min="0" data-f="stock" value="${Math.round(x.stock)}" data-tip="Current quantity on hand, in ${x.unit}"><span class="unit">${x.unit}</span></div></td>
      <td><div class="numcell"><span class="unit"></span><input class="mini-input" type="number" min="1" data-f="par" value="${x.par}" data-tip="Full / ideal stock level, in ${x.unit}"><span class="unit">${x.unit}</span></div></td>
      <td class="r"><span class="pill ${s}" style="font-size:10.5px">${statusLabel(s)}</span><div style="font-size:10.5px;color:var(--ink-faint);margin-top:3px">${coffeesLeft(x)} cups</div>${flag?`<div class="warn-msg" style="font-size:10px;margin-top:2px" data-tip="1 packet (${fmtNum(x.packet)}${x.unit}) ÷ ${x.perPacket} cups = ${implied.toFixed(1)}${x.unit}/cup — typical ${sstd.min}–${sstd.max}${x.unit}. Check packet size or coffees/packet.">⚠ check ratio</div>`:''}</td>
      <td class="r"><div style="display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap"><button class="btn-ghost btn-mini" data-updrow="${x.id}" data-tip="Save this row's changes">${I.check}Update</button><button class="btn-ghost btn-mini" data-restock="${x.id}" data-tip="Add one full packet (${x.packet}${x.unit}) to stock">${I.plus}Packet</button><button class="btn-ghost btn-mini" data-delsupply="${x.id}" data-tip="Delete this supply" style="padding:6px 8px">${I.trash}</button></div></td></tr>`;}).join('');
  const H=(label,tip)=>`<th style="text-align:center">${label} <span class="tip-badge" data-tip="${tip}" tabindex="0" aria-label="${tip}">i</span></th>`;
  return `<div class="card"><div class="tbl-wrap"><table>
      <thead><tr><th>Supply</th>
        ${H('Packet size',"How much one packet or bag holds, in the item&#39;s unit (g, ml or pcs). Example: a 1000 g bag of beans.")}
        ${H('Coffees / packet',"How many cups one packet makes. Converts stock into cups-left. Example: a 1000 g bag makes about 55 coffees.")}
        ${H('In stock',"Current quantity on hand right now, in the item&#39;s unit (g, ml or pcs).")}
        ${H('Target level',"Your full / ideal amount to keep. Status (Healthy, Low, Critical) and the bars are measured against this.")}
        <th class="r">Status</th><th class="r">Actions</th></tr></thead>
      <tbody>${rows}</tbody></table></div></div>
    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;align-items:center"><button class="btn-ghost" id="addSupply">${I.plus} Add supply</button>
      <span class="help">Edit any values in a row, then press <b>Enter</b> or click <b>Update</b> to save. Hover the <b>i</b> on each column header for what it means.</span></div>`;
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
function manageExtras(){
  const drinkName=id=>{const p=DB.products.find(x=>x.id===id);return p?p.name:'?';};
  const rows=DB.extras.map(e=>{const ig=ing(e.ingredientId);
    const applies=e.products.length?e.products.map(drinkName).join(', '):'— (not offered on any drink)';
    return `<tr><td><b>${esc(e.name)}</b>${e.active?'':' <span class="pill neutral" style="font-size:10px">off</span>'}</td>
      <td class="r">${e.price>0?money(e.price):'<span class="st good" style="font-weight:600">Free</span>'}</td>
      <td style="font-size:12.5px">${ig?esc(ig.name):'—'} · ${e.qty}${ig?ig.unit:''}</td>
      <td style="font-size:12px;color:var(--ink-soft)">${esc(applies)}</td>
      <td class="r"><div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn-ghost btn-mini" data-editextra="${e.id}">Edit</button><button class="btn-ghost btn-mini" data-delextra="${e.id}" style="padding:6px 8px">${I.trash}</button></div></td></tr>`;}).join('');
  return `<div class="card"><div class="tbl-wrap"><table>
      <thead><tr><th>Extra</th><th class="r">Price</th><th>Consumes</th><th>Offered on</th><th class="r">Edit</th></tr></thead>
      <tbody>${rows||'<tr><td colspan="5" class="empty">No extras yet — add one below.</td></tr>'}</tbody></table></div></div>
    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;align-items:center"><button class="btn-ghost" id="addExtra">${I.plus} Add extra</button>
      <span class="help">Each extra draws down a supply (keeps stock accurate) and is Free or chargeable. Pick which drinks it's offered on.</span></div>`;
}
function extraModal(existing){
  const first=DB.ingredients[0]||{};
  const e=existing||{name:'',price:0,ingredientId:first.id,qty:stdFor(first,'extra').def,active:true,products:[]};
  const ingOpts=DB.ingredients.map(i=>`<option value="${i.id}" ${i.id===e.ingredientId?'selected':''}>${esc(i.name)} (${i.unit})</option>`).join('');
  const prodChecks=DB.products.map(p=>`<label class="exrow"><span><input type="checkbox" data-xp="${p.id}" ${e.products&&e.products.includes(p.id)?'checked':''}> ${esc(p.name)}</span></label>`).join('');
  openModal({title:existing?'Edit extra':'Add extra',confirmLabel:existing?'Save extra':'Add extra',
    body:`<div class="field"><label class="lab">Name</label><input class="m-input" id="xe-name" value="${esc(e.name)}" placeholder="e.g. Chocolate topping"></div>
      <div class="form-grid">
        <div><label class="lab">Price (${curCode()}) — 0 = free</label><input class="m-input" id="xe-price" type="number" min="0" value="${e.price}"></div>
        <div><label class="lab">Consumes supply</label><select id="xe-ing">${ingOpts}</select></div>
        <div><label class="lab">Supply used per extra <span id="xe-unit" style="color:var(--ink-faint)"></span></label><input class="m-input" id="xe-qty" type="number" min="0" value="${e.qty}"></div>
        <div><label class="lab">Active</label><select id="xe-active"><option value="1" ${e.active?'selected':''}>Yes</option><option value="0" ${e.active?'':'selected'}>No</option></select></div>
      </div>
      <div class="warn-msg" id="xe-warn"></div>
      <div class="help" style="margin-top:6px">How much of the chosen supply one of this extra subtracts from stock. Picking a supply suggests a typical amount; use 0 for no stock impact.</div>
      <label class="lab" style="margin-top:12px">Offered on which drinks</label><div style="max-height:190px;overflow:auto;border:1px solid var(--line);border-radius:10px;padding:4px 12px">${prodChecks||'<div class="help">Add coffees first.</div>'}</div>`,
    onConfirm:root=>{
      const name=root.querySelector('#xe-name').value.trim(); if(!name){toast('Name is required',I.issues);return false;}
      const rec={name,price:+root.querySelector('#xe-price').value||0,ingredient_id:root.querySelector('#xe-ing').value,qty:+root.querySelector('#xe-qty').value||0,active:root.querySelector('#xe-active').value==='1'};
      const prods=[...root.querySelectorAll('[data-xp]')].filter(c=>c.checked).map(c=>c.dataset.xp);
      saveExtra(existing?existing.id:null, rec, prods);
    }});
  const ingSel=document.getElementById('xe-ing'), qEl=document.getElementById('xe-qty'), unitEl=document.getElementById('xe-unit'), warnEl=document.getElementById('xe-warn');
  const refresh=(setDefault)=>{const x=ing(ingSel.value); if(unitEl)unitEl.textContent=x?('('+x.unit+')'):''; if(setDefault&&x)qEl.value=stdFor(x,'extra').def; if(warnEl)warnEl.textContent=rangeMsg(x,parseFloat(qEl.value),'extra');};
  if(ingSel){ingSel.onchange=()=>refresh(true); qEl.oninput=()=>refresh(false); refresh(false);}
}
async function saveExtra(id, rec, prods){
  let exId=id;
  if(id){ const r=await sb.from('extras').update(rec).eq('id',id).select('id'); if(r.error){toast('Save failed: '+r.error.message,I.issues);return;} if(!r.data||!r.data.length){toast('Not saved — admin only',I.issues);return;} }
  else { const r=await sb.from('extras').insert(rec).select('id').single(); if(r.error){toast('Could not add extra: '+r.error.message,I.issues);return;} exId=r.data.id; }
  await sb.from('extra_products').delete().eq('extra_id',exId);
  if(prods.length){ const r=await sb.from('extra_products').insert(prods.map(pid=>({extra_id:exId,product_id:pid}))); if(r.error){toast('Saved, but drink links failed: '+r.error.message,I.issues);await loadAll();render();return;} }
  await loadAll(); render(); toast('Extra saved',I.check);
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
    <div class="callout">${I.shield}<div><b>Admins</b> open this Admin area (catalog, extras, team, settings). <b>Staff</b> can sell, view stock, log issues, and see orders. Accounts are stored securely in Supabase Auth (passwords are hashed); Add / Reset / Remove use the admin-users function.</div></div>`;
}

function manageSettings(){
  const s=DB.settings;
  const curOpts=Object.entries(CURRENCIES).map(([c,o])=>`<option value="${c}" ${c===s.currency?'selected':''}>${o.label}</option>`).join('');
  return `<div class="card card-pad" style="max-width:620px">
      <div class="section-title">Shop settings</div><div class="section-sub">These apply everywhere in the app.</div>
      <div class="form-grid">
        <div><label class="lab" for="set-shop">Shop name (app title)</label><input class="m-input" id="set-shop" value="${esc(s.shopName)}"></div>
        <div><label class="lab" for="set-cur">Currency</label><select id="set-cur">${curOpts}</select></div>
      </div>
      <div class="help" id="set-prev" style="margin-top:8px">Sample price: <b>${money(220)}</b>. Changing currency changes the symbol, not the amount.</div>

      <div class="section-title" style="margin-top:20px">GST &amp; invoice</div><div class="section-sub">Printed on every bill. Required for a valid Tax Invoice.</div>
      <div class="form-grid">
        <div class="full"><label class="lab" for="set-legal">Legal / trade name</label><input class="m-input" id="set-legal" value="${esc(s.legalName||'')}" placeholder="e.g. GM Wellness Foods Pvt Ltd"></div>
        <div><label class="lab" for="set-gstin">GSTIN</label><input class="m-input" id="set-gstin" value="${esc(s.gstin||'')}" placeholder="15-character GSTIN"></div>
        <div><label class="lab" for="set-state">State (place of supply)</label><input class="m-input" id="set-state" value="${esc(s.state||'')}" placeholder="e.g. Maharashtra"></div>
        <div class="full"><label class="lab" for="set-addr">Address</label><input class="m-input" id="set-addr" value="${esc(s.address||'')}" placeholder="Shop address"></div>
        <div><label class="lab" for="set-phone">Phone</label><input class="m-input" id="set-phone" value="${esc(s.phone||'')}"></div>
        <div><label class="lab" for="set-fssai">FSSAI (optional)</label><input class="m-input" id="set-fssai" value="${esc(s.fssai||'')}"></div>
        <div><label class="lab" for="set-prefix">Invoice prefix</label><input class="m-input" id="set-prefix" value="${esc(s.invoicePrefix||'GMW')}"></div>
        <div><label class="lab" for="set-rate">GST rate (%)</label><input class="m-input" id="set-rate" type="number" min="0" step="0.5" value="${s.gstRate}"></div>
        <div><label class="lab" for="set-ot">Show Dine-in / Takeaway</label><select id="set-ot"><option value="1" ${s.orderTypeOn!==false?'selected':''}>Yes</option><option value="0" ${s.orderTypeOn===false?'selected':''}>No</option></select></div>
      </div>
      <div class="help" style="margin-top:8px">Invoice numbers run like <b>${esc(s.invoicePrefix||'GMW')}/2026-27/0001</b> and reset each financial year (Apr–Mar). GST 5% is standard for a standalone cafe.</div>
      <button class="btn btn-primary" id="saveSettings" style="margin-top:16px">${I.check} Save settings</button>
    </div>
    <div class="card card-pad" style="max-width:540px;margin-top:16px">
      <div class="section-title">Backup &amp; migration</div>
      <div class="section-sub">Export your coffees, recipes, supplies and settings to a file — then import it into a new instance.</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn-ghost" id="exportCfg">${I.download} Export config</button>
        <button class="btn-ghost" id="importCfg">${I.upload} Import config</button>
      </div>
      <div class="help">Sales history and team members aren't part of the config file — only your shop setup. Importing replaces the current coffees, supplies and settings.</div>
    </div>
    <div class="callout">${I.shield}<div>These live in the shop's settings, shared across every till and device.</div></div>`;
}
function setShopName(){document.querySelectorAll('.wordmark').forEach(e=>{e.textContent=(DB.settings&&DB.settings.shopName)||'GM Wellness';});}

/* ============================ ACTIONS ============================ */
async function logIssue(id,amount,mode,reason){const {error}=await sb.rpc('log_issue',{p_ingredient_id:id,p_amount:amount,p_mode:mode,p_reason:reason});if(error){toast(error.message||'Could not log issue',I.issues);return;}await loadAll();render();toast('Issue logged · stock updated',I.check);}

/* ============================ WIRE ============================ */
function wire(){
  document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>go(b.dataset.goto));
  document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>openAddModal(b.dataset.add));
  // checkout / cart
  document.querySelectorAll('[data-cq]').forEach(b=>b.onclick=()=>{const l=cart.find(x=>x.uid===b.dataset.uid);if(!l)return;if(b.dataset.cq==='+')l.qty++;else if(l.qty>1)l.qty--;render();});
  document.querySelectorAll('[data-crm]').forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.uid!==b.dataset.crm);render();});
  document.querySelectorAll('[data-ot]').forEach(b=>b.onclick=()=>{coState.orderType=b.dataset.ot;render();});
  document.querySelectorAll('[data-pm]').forEach(b=>b.onclick=()=>{coState.paymentMode=b.dataset.pm;render();});
  const so=document.getElementById('submitOrder');if(so)so.onclick=submitOrder;
  // orders history
  const osrch=document.getElementById('orderSearch');if(osrch)osrch.oninput=()=>{orderQuery=osrch.value;render();const el=document.getElementById('orderSearch');if(el){el.focus();el.setSelectionRange(el.value.length,el.value.length);}};
  document.querySelectorAll('[data-viewrcpt]').forEach(b=>b.onclick=()=>{const o=DB.orders.find(x=>x.id===b.dataset.viewrcpt);if(o)showReceipt(o);});
  document.querySelectorAll('[data-revorder]').forEach(b=>{if(b.disabled)return;b.onclick=()=>{const id=b.dataset.revorder;
    confirmModal('Reverse this order?','Stock will be added back and the order removed from your records.','Reverse',async()=>{const {error}=await sb.rpc('reverse_order',{p_order_id:id});if(error){toast(error.message||'Could not reverse',I.issues);return;}await loadAll();render();toast('Order reversed',I.undo);},true);};});

  const form=document.getElementById('issueForm');
  if(form){let mode='coffees';const hint=document.getElementById('ii-unithint'),prev=document.getElementById('ii-preview'),sel=document.getElementById('ii-ing'),amt=document.getElementById('ii-amt');
    function refresh(){const x=ing(sel.value);if(!x)return;hint.textContent=mode==='coffees'?`1 coffee ≈ ${perServing(x).toFixed(0)}${x.unit}`:`In ${x.unit}`;
      const units=mode==='coffees'?(amt.value||0)*perServing(x):(amt.value||0);
      prev.innerHTML=`This removes <b>${fmtNum(Math.round(units))}${x.unit}</b> from <b>${esc(x.name)}</b> (now ${fmtNum(Math.round(x.stock))}${x.unit} → ${fmtNum(Math.max(0,Math.round(x.stock-units)))}${x.unit}).`;}
    form.querySelectorAll('[data-mode]').forEach(btn=>btn.onclick=()=>{mode=btn.dataset.mode;form.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b===btn));refresh();});
    sel.onchange=refresh;amt.oninput=refresh;refresh();
    form.onsubmit=e=>{e.preventDefault();const a=parseFloat(amt.value);if(!a||a<=0){amt.focus();return;}logIssue(sel.value,a,mode,document.getElementById('ii-reason').value.trim()||'No reason given');};}

  document.querySelectorAll('[data-mtab]').forEach(b=>b.onclick=()=>{manageTab=b.dataset.mtab;render();});
  document.querySelectorAll('tr[data-ing] .mini-input').forEach(inp=>inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();updateSupplyRow(inp.closest('tr').dataset.ing);}}));
  document.querySelectorAll('[data-updrow]').forEach(b=>b.onclick=()=>updateSupplyRow(b.dataset.updrow,b));
  document.querySelectorAll('[data-restock]').forEach(b=>b.onclick=async()=>{const x=ing(b.dataset.restock);b.disabled=true;const {data,error}=await sb.from('ingredients').update({stock:Number(x.stock)+Number(x.packet)}).eq('id',x.id).select('id,stock');b.disabled=false;if(error){toast('Restock failed: '+error.message,I.issues);return;}if(!data||!data.length){toast('Not saved — you may not have admin rights',I.issues);return;}await loadAll();render();toast(`+1 packet of ${x.name} (now ${fmtNum(Math.round(data[0].stock))}${x.unit})`,I.plus);});
  const addS=document.getElementById('addSupply');if(addS)addS.onclick=addSupplyModal;
  document.querySelectorAll('[data-delsupply]').forEach(b=>b.onclick=()=>{const x=ing(b.dataset.delsupply);if(!x)return;
    const used=DB.products.filter(p=>p.recipe.some(r=>r[0]===x.id)).map(p=>p.name);
    if(used.length){toast(`In use by ${used.length} coffee(s): ${used.slice(0,3).join(', ')}${used.length>3?'…':''}. Remove it from those recipes first.`,I.issues);return;}
    confirmModal('Remove supply?',`"${esc(x.name)}" will be permanently deleted.`,'Remove',async()=>{const {error}=await sb.from('ingredients').delete().eq('id',x.id);if(error){toast('Could not delete — it may be used in a recipe',I.issues);return;}await loadAll();render();toast('Supply removed',I.trash);},true);});

  document.querySelectorAll('tr[data-prod] [data-pf]').forEach(inp=>inp.onchange=async()=>{const id=inp.closest('tr').dataset.prod;const p=DB.products.find(x=>x.id===id);const v=parseFloat(inp.value);if(isNaN(v)||v<0){inp.value=p.price;return;}const {data,error}=await sb.from('products').update({price:v}).eq('id',id).select('id');if(error){toast('Save failed: '+error.message,I.issues);return;}if(!data||!data.length){toast('Not saved — you may not have admin rights',I.issues);return;}p.price=v;});
  document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editRecipe(b.dataset.edit));
  document.querySelectorAll('[data-delp]').forEach(b=>b.onclick=()=>{const p=DB.products.find(x=>x.id===b.dataset.delp);
    confirmModal('Remove coffee?',`"${esc(p.name)}" will be removed from the menu.`,'Remove',async()=>{const {error}=await sb.from('products').delete().eq('id',p.id);if(error){toast('Could not remove',I.issues);return;}await loadAll();render();toast('Coffee removed',I.trash);},true);});
  const addC=document.getElementById('addCoffee');if(addC)addC.onclick=addCoffee;

  // EXTRAS
  const addX=document.getElementById('addExtra');if(addX)addX.onclick=()=>extraModal(null);
  document.querySelectorAll('[data-editextra]').forEach(b=>b.onclick=()=>{const e=DB.extras.find(x=>x.id===b.dataset.editextra);if(e)extraModal(e);});
  document.querySelectorAll('[data-delextra]').forEach(b=>b.onclick=()=>{const e=DB.extras.find(x=>x.id===b.dataset.delextra);if(!e)return;confirmModal('Remove extra?',`"${esc(e.name)}" will be deleted.`,'Remove',async()=>{const {error}=await sb.from('extras').delete().eq('id',e.id);if(error){toast('Could not delete: '+error.message,I.issues);return;}await loadAll();render();toast('Extra removed',I.trash);},true);});

  // SETTINGS
  const setCur=document.getElementById('set-cur');
  if(setCur){
    setCur.onchange=()=>{const prev=document.getElementById('set-prev');const c=setCur.value;
      try{const f=new Intl.NumberFormat((CURRENCIES[c]||CURRENCIES.INR).locale,{style:'currency',currency:c,maximumFractionDigits:0});prev.innerHTML=`Sample price: <b>${f.format(220)}</b>. Prices are stored as numbers — changing currency changes the symbol, not the amount.`;}catch(e){}};
    document.getElementById('saveSettings').onclick=async()=>{
      const g=id=>{const el=document.getElementById(id);return el?el.value:'';};
      const rec={shop_name:g('set-shop').trim()||'GM Wellness', currency:setCur.value,
        legal_name:g('set-legal').trim(), gstin:g('set-gstin').trim(), address:g('set-addr').trim(),
        state:g('set-state').trim(), phone:g('set-phone').trim(), fssai:g('set-fssai').trim(),
        invoice_prefix:g('set-prefix').trim()||'GMW', gst_rate:parseFloat(g('set-rate'))||5,
        order_type_on:g('set-ot')==='1'};
      const {data,error}=await sb.from('shop_settings').update(rec).eq('id',1).select('id');
      if(error){toast('Could not save settings: '+error.message,I.issues);return;}
      if(!data||!data.length){toast('Not saved — admin only',I.issues);return;}
      DB.settings=mapSettings({shop_name:rec.shop_name,currency:rec.currency,legal_name:rec.legal_name,gstin:rec.gstin,address:rec.address,state:rec.state,phone:rec.phone,fssai:rec.fssai,invoice_prefix:rec.invoice_prefix,gst_rate:rec.gst_rate,order_type_on:rec.order_type_on});
      setShopName();render();toast('Settings saved',I.check);};
  }
  const exBtn=document.getElementById('exportCfg');if(exBtn)exBtn.onclick=exportConfig;
  const imBtn=document.getElementById('importCfg');if(imBtn)imBtn.onclick=importConfigModal;

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

/* ---------- update a supply row (all fields at once) ---------- */
async function updateSupplyRow(id, btn){
  const tr=document.querySelector(`tr[data-ing="${id}"]`); if(!tr) return;
  const num=f=>{const el=tr.querySelector(`[data-f="${f}"]`);const v=parseFloat(el.value);return isNaN(v)?null:v;};
  const packet=num('packet'), perPacket=num('perPacket'), stock=num('stock'), par=num('par');
  if(packet===null||perPacket===null||stock===null||par===null){toast('Please enter valid numbers',I.issues);return;}
  if(packet<1||perPacket<1||par<1||stock<0){toast('Values must be positive (stock can be 0)',I.issues);return;}
  if(btn)btn.disabled=true;
  const {data,error}=await sb.from('ingredients').update({packet_size:packet,coffees_per_packet:perPacket,stock:stock,par:par}).eq('id',id).select('id');
  if(btn)btn.disabled=false;
  if(error){toast('Save failed: '+error.message,I.issues);return;}
  if(!data||!data.length){toast('Not saved — you may not have admin rights',I.issues);return;}
  const nm=(ing(id)||{}).name||'supply';
  await loadAll();render();toast('Saved '+nm,I.check);
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
  const rowsHTML=()=>draft.map((r,idx)=>{const x=ing(r[0]);return `<div class="recipe-row"><select data-ri="${idx}">${ingOptions(r[0])}</select>
      <input class="mini-input" style="width:100%;text-align:left" type="number" min="0" step="1" data-rq="${idx}" value="${r[1]}">
      <span class="unit">${x?x.unit:''}</span>
      <button class="icon-btn" data-rrm="${idx}" style="width:34px;height:34px" aria-label="Remove">${I.close}</button></div>`;}).join('');
  const recWarn=()=>draft.map(r=>rangeMsg(ing(r[0]),r[1],'recipe')).filter(Boolean);
  const updWarn=()=>{const el=document.getElementById('recWarn');if(el)el.innerHTML=recWarn().map(esc).join('<br>');};
  function draw(){
    root.innerHTML=`<div class="modal-bg" id="mbg"><div class="modal" role="dialog" aria-modal="true" aria-label="Edit recipe">
      <div class="modal-head"><h3>Edit coffee</h3><button class="icon-btn" id="mclose" aria-label="Close">${I.close}</button></div>
      <div class="modal-body">
        <div class="field"><label class="lab" for="mname">Name</label><input class="m-input" id="mname" value="${esc(p.name)}"></div>
        <div class="field"><label class="lab" for="mprice">Price (${curCode()})</label><input class="m-input" id="mprice" type="number" min="0" value="${p.price}"></div>
        <label class="lab" style="margin-top:6px">Ingredients used per cup</label><div id="recRows">${rowsHTML()}</div>
        <div class="warn-msg" id="recWarn"></div>
        <button class="btn-ghost btn-mini" id="addRow" style="margin-top:8px">${I.plus} Add ingredient</button></div>
      <div class="modal-foot"><button class="btn-ghost" id="mcancel">Cancel</button><button class="btn btn-primary" id="msave">${I.check} Save</button></div>
    </div></div>`;
    const close=()=>root.innerHTML='';
    document.getElementById('mbg').onclick=e=>{if(e.target.id==='mbg')close();};
    document.getElementById('mclose').onclick=close;document.getElementById('mcancel').onclick=close;
    document.querySelectorAll('[data-ri]').forEach(s=>s.onchange=()=>{const idx=+s.dataset.ri;draft[idx][0]=s.value;draft[idx][1]=stdFor(ing(s.value),'recipe').def;draw();});
    document.querySelectorAll('[data-rq]').forEach(i=>i.oninput=()=>{draft[+i.dataset.rq][1]=parseFloat(i.value)||0;updWarn();});
    document.querySelectorAll('[data-rrm]').forEach(b=>b.onclick=()=>{draft.splice(+b.dataset.rrm,1);draw();});
    document.getElementById('addRow').onclick=()=>{const f=DB.ingredients[0]||{};draft.push([f.id,stdFor(f,'recipe').def]);draw();};
    updWarn();
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

/* ============================ EXPORT / IMPORT CONFIG ============================ */
function buildConfig(){
  const nameById={}; DB.ingredients.forEach(i=>nameById[i.id]=i.name);
  return {
    gmWellnessConfig:true, version:1, exportedAt:new Date().toISOString(),
    settings:{shopName:DB.settings.shopName,currency:DB.settings.currency},
    ingredients:DB.ingredients.map(i=>({name:i.name,category:i.cat,unit:i.unit,packetSize:i.packet,coffeesPerPacket:i.perPacket,stock:i.stock,par:i.par})),
    products:DB.products.map(p=>({name:p.name,price:p.price,recipe:p.recipe.map(([iid,q])=>({ingredient:nameById[iid]||iid,qty:q}))}))
  };
}
function exportConfig(){
  const json=JSON.stringify(buildConfig(),null,2);
  const fname=`gm-wellness-config-${new Date().toISOString().slice(0,10)}.json`;
  const root=document.getElementById('modalRoot');
  root.innerHTML=`<div class="modal-bg" id="mbg"><div class="modal" role="dialog" aria-modal="true" aria-label="Export config">
    <div class="modal-head"><h3>Export config</h3><button class="icon-btn" id="mx" aria-label="Close">${I.close}</button></div>
    <div class="modal-body">
      <p style="margin:0 0 10px;color:var(--ink-soft);font-size:13.5px">Save this and import it into a new instance. Download the file, or copy the text.</p>
      <textarea id="exp-text" readonly class="m-input" style="min-height:170px;font-family:ui-monospace,monospace;font-size:12px;white-space:pre">${esc(json)}</textarea>
    </div>
    <div class="modal-foot"><button class="btn-ghost" id="exp-copy">Copy</button><button class="btn btn-primary" id="exp-dl">${I.download} Download .json</button></div>
  </div></div>`;
  const close=()=>root.innerHTML='';
  document.getElementById('mbg').onclick=e=>{if(e.target.id==='mbg')close();};
  document.getElementById('mx').onclick=close;
  document.getElementById('exp-copy').onclick=()=>{const ta=document.getElementById('exp-text');ta.focus();ta.select();try{document.execCommand('copy');}catch(e){}if(navigator.clipboard){navigator.clipboard.writeText(json).catch(()=>{});}toast('Config copied',I.check);};
  document.getElementById('exp-dl').onclick=()=>{try{const blob=new Blob([json],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fname;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Download started',I.download);}catch(e){toast('Download failed — use Copy instead',I.issues);}};
}
function importConfigModal(){
  openModal({title:'Import config',confirmLabel:'Import & replace',danger:true,
    body:`<p style="margin:0 0 12px;color:var(--ink-soft);font-size:13.5px">Choose a GM Wellness config file, or paste its contents below. This replaces the current coffees, supplies and settings. Sales history and team are kept.</p>
      <input type="file" accept="application/json,.json" id="imp-file" class="m-input" style="padding:9px">
      <textarea id="imp-text" class="m-input" style="margin-top:10px;min-height:120px;font-family:ui-monospace,monospace;font-size:12px" placeholder="…or paste config JSON here"></textarea>`,
    onConfirm:root=>{
      const txt=(root.querySelector('#imp-text').value||'').trim();
      if(!txt){toast('Choose a file or paste JSON',I.issues);return false;}
      let cfg;try{cfg=JSON.parse(txt);}catch(e){toast('That is not valid JSON',I.issues);return false;}
      if(!cfg||!Array.isArray(cfg.ingredients)||!Array.isArray(cfg.products)){toast('Not a GM Wellness config file',I.issues);return false;}
      importApply(cfg);
    }});
  const fi=document.getElementById('imp-file');
  if(fi)fi.onchange=()=>{const f=fi.files&&fi.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{document.getElementById('imp-text').value=r.result;};r.readAsText(f);};
}
async function importApply(cfg){
  toast('Importing…',I.upload);
  try{
    let r;
    r=await sb.from('products').delete().not('id','is',null); if(r.error) throw r.error;
    r=await sb.from('ingredients').delete().not('id','is',null); if(r.error) throw r.error;
    const ingRows=cfg.ingredients.map(x=>({name:x.name,category:x.category||x.cat||'Extras',unit:x.unit||'g',packet_size:+x.packetSize||+x.packet||1000,coffees_per_packet:+x.coffeesPerPacket||+x.perPacket||50,stock:+x.stock||0,par:+x.par||1000}));
    const ins=await sb.from('ingredients').insert(ingRows).select(); if(ins.error) throw ins.error;
    const idByName={}; (ins.data||[]).forEach(i=>idByName[i.name.toLowerCase()]=i.id);
    const prodRows=cfg.products.map(p=>({name:p.name,price:+p.price||0}));
    const pins=await sb.from('products').insert(prodRows).select(); if(pins.error) throw pins.error;
    const pidByName={}; (pins.data||[]).forEach(p=>pidByName[p.name.toLowerCase()]=p.id);
    const items=[];
    cfg.products.forEach(p=>{const pid=pidByName[(p.name||'').toLowerCase()];(p.recipe||[]).forEach(rr=>{const iid=idByName[(rr.ingredient||rr.name||'').toLowerCase()];const q=+rr.qty||0;if(pid&&iid&&q>0)items.push({product_id:pid,ingredient_id:iid,qty:q});});});
    if(items.length){r=await sb.from('recipe_items').insert(items); if(r.error) throw r.error;}
    if(cfg.settings){r=await sb.from('shop_settings').update({shop_name:cfg.settings.shopName||DB.settings.shopName,currency:cfg.settings.currency||DB.settings.currency}).eq('id',1); if(r.error) throw r.error;}
    await loadAll();setShopName();manageTab='settings';render();toast('Config imported',I.check);
  }catch(e){toast('Import failed: '+(e.message||e),I.issues);}
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
  if(error){err.textContent=/confirm/i.test(error.message)?'Email not confirmed — confirm the user in Supabase.':(error.message||'Incorrect email or password.');return;}
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

/* ============================ TOOLTIPS ============================ */
(function initTooltips(){
  let tip=null;
  function hide(){ if(tip){tip.remove();tip=null;} }
  function show(target){
    const text=target.getAttribute('data-tip'); if(!text)return;
    hide();
    tip=document.createElement('div'); tip.id='tooltip'; tip.textContent=text; document.body.appendChild(tip);
    const r=target.getBoundingClientRect(); const t=tip.getBoundingClientRect();
    let left=r.left+r.width/2-t.width/2;
    left=Math.max(8, Math.min(left, window.innerWidth-t.width-8));
    let top=r.top-t.height-10, below=false;
    if(top<8){top=r.bottom+10; below=true; tip.classList.add('below');}
    tip.style.left=left+'px'; tip.style.top=top+'px';
    tip.style.setProperty('--ax',(r.left+r.width/2-left)+'px');
    requestAnimationFrame(()=>tip&&tip.classList.add('on'));
  }
  document.addEventListener('mouseover',e=>{const t=e.target.closest&&e.target.closest('[data-tip]');if(t)show(t);});
  document.addEventListener('mouseout',e=>{const t=e.target.closest&&e.target.closest('[data-tip]');if(t)hide();});
  document.addEventListener('focusin',e=>{const t=e.target.closest&&e.target.closest('[data-tip]');if(t)show(t);});
  document.addEventListener('focusout',hide);
  window.addEventListener('scroll',hide,true);
  window.addEventListener('resize',hide);
})();
