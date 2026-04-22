"use client";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ComposedChart,
} from "recharts";

// ─── SKU POOL ────────────────────────────────────────────────────────────────
const SKU_POOL = [
  { code:"BKP2502007015", name:"JEE Main 2024 Solved Papers Chapterwise PYQs" },
  { code:"BKP2406011728", name:"CBSE 15 Sample Papers Class 10 Science 2025" },
  { code:"ATV2404005934", name:"Curious Jr. Electricity Magnetism Science Kit" },
  { code:"BKP2405011805", name:"37 Years NEET Biology PYQs Chapterwise" },
  { code:"STT2505004720", name:"400 Pages A4 Notebook Single Line Ruled" },
  { code:"MRC2411005145", name:"NAZARIYA Blue Ray Protection Glasses Pink" },
  { code:"BKP2504013311", name:"Olympiad IOQM Mathematics Guide 2025" },
  { code:"ATV2502005548", name:"PW Science Kit 25+ Experiments STEM Toys" },
  { code:"BKP2506013289", name:"NSEB Class 11 Advanced Biology Part 1" },
  { code:"BKP2512780031", name:"Mission 100 Chemistry NEET UG 2026" },
  { code:"BKP2503006905", name:"IPMAT Verbal Ability Reading Comprehension" },
  { code:"BKP2405006701", name:"KYC Reasoning Ability Banking Exams 2025" },
  { code:"BKP2601018275", name:"All In One UPTET Paper 1 Class 1-5 2026" },
  { code:"BKP2509009021", name:"CBSE Sample Papers Class 12 Computer Science" },
  { code:"ATV2510017535", name:"Junior Science Kit 50+ Experiments Birthday" },
];

// ─── DATA GENERATOR ──────────────────────────────────────────────────────────
const generateOrders = () => {
  const statuses = ["Delivered","Manifested","Shipped","Packed","RTO","Lost","Cancelled"];
  const sW = [0.38,0.22,0.15,0.08,0.07,0.02,0.08];
  const channels = ["Meesho","Amazon","Flipkart","PW_Store","B2B","Cloudtail DF"];
  const cW = [0.34,0.28,0.14,0.10,0.08,0.06];
  const cats = ["UG Entrance Exams","School Prep Books","KG to 8th","PG/Govt Entrance Exams","Olympiad Books","Stationery","Merchandise"];
  const subCats = {
    "UG Entrance Exams":["JEE Books","NEET Books","CUET Books","CA/Finance"],
    "School Prep Books":["CBSE Class 10th","CBSE Class 12th","UP Board Books","ICSE Books"],
    "KG to 8th":["Activity Kits","Kids Books","STEM Kits","Writing Books"],
    "PG/Govt Entrance Exams":["UPSC CSE","Banking Books","SSC Books","RRB Books"],
    "Olympiad Books":["Class 11th Olympiads","Class 12th Olympiad","Class 9-10 Olympiad"],
    "Stationery":["Notebooks","Pens","Paper Stationery"],
    "Merchandise":["Anti Blue Light Glasses","Bags","Accessories"],
  };
  const whs = ["SKB_VC","Patna_VC","Noida_UW","HO_VC","Patna_UW"];
  const states = ["Uttar Pradesh","Bihar","Rajasthan","Maharashtra","Delhi","West Bengal","MP","Gujarat","Tamil Nadu","Karnataka"];
  const pays = ["Prepaid","COD","FOC","Third Party"];
  const pW = [0.55,0.35,0.05,0.05];
  const ots = ["Normal","BOM","SUPERBUNDLE"];
  const otW = [0.72,0.22,0.06];
  const partners = ["Delhivery","BlueDart","DTDC","Xpressbees","Shadowfax"];
  const orgs = ["Physicwallah","NEET PG"];
  const finCats = ["Direct","Ecommerce","B2B","Batch"];
  const orderCats = ["Purely Store Purchase","BATCH_FBT","BATCH_ADDON","3P-Online","B2B","Store BOC","Batch BOC"];
  const pick = (arr,w) => { const r=Math.random(); let c=0; for(let j=0;j<arr.length;j++){c+=w[j];if(r<c)return arr[j];} return arr[arr.length-1]; };
  const today = new Date(2026,3,22);
  return Array.from({length:1200},(_,i) => {
    const daysAgo = Math.floor(i/40);
    const date = new Date(2026,0,1+daysAgo);
    const dateStr = date.toISOString().split("T")[0];
    const month = date.toLocaleString("default",{month:"short"})+" "+date.getFullYear();
    const week = `W${Math.ceil((daysAgo+1)/7)}`;
    const cat = cats[i%cats.length];
    const subCatArr = subCats[cat]||["General"];
    const subCat = subCatArr[i%subCatArr.length];
    const qty = Math.floor(Math.random()*8)+1;
    const mrp = Math.floor(Math.random()*1350)+150;
    const disc = Math.random()>0.7?Math.floor(Math.random()*mrp*0.3):0;
    const unitPrice = mrp-disc;
    const revenue = unitPrice*qty;
    const status = pick(statuses,sW);
    const ch = pick(channels,cW);
    const sku = SKU_POOL[i%SKU_POOL.length];
    const daysSinceOrder = Math.floor((today-date)/(1000*60*60*24));
    const isPending = ["Packed","Shipped","Manifested"].includes(status);
    const daysPending = isPending?daysSinceOrder:0;
    const ageBucket = !isPending?"Closed":daysPending<=3?"0-3 Days (Fresh)":daysPending<=7?"4-7 Days (Normal)":daysPending<=14?"8-14 Days (Aging)":"15+ Days (Critical)";
    return {
      order_date:dateStr, month, week, qty, mrp, unitPrice, discount:disc,
      final_revenue:revenue, Final_Item_Status:status,
      marketplace_cat:ch, parent_name:cat, sub_cat_name:subCat,
      Warehouse:whs[i%whs.length], state:states[i%states.length],
      payment_sources:pick(pays,pW), OMS:Math.random()>0.45?"VC":"UW",
      Order_Type:pick(ots,otW), purchase_level:["3P","STORE_PURCHASE","BATCH_PURCHASE"][i%3],
      order_category:orderCats[i%orderCats.length],
      Organization:Math.random()>0.12?orgs[0]:orgs[1],
      delivery_partner:partners[i%partners.length],
      finance_exam_category:finCats[i%finCats.length],
      VCO_voucher_amount:disc, VCO_mrp:mrp, VCO_unit_price:unitPrice,
      is_pre_order:Math.random()>0.9, ship_together:Math.random()>0.7,
      cancellation_reason:status==="Cancelled"?["Customer Request","Fraud","Out of Stock","Price Issue"][i%4]:null,
      sku_code:sku.code, product_name:sku.name,
      days_pending:daysPending, age_bucket:ageBucket, days_since_order:daysSinceOrder,
    };
  });
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtN = n => new Intl.NumberFormat("en-IN").format(Math.round(n));
const fmtM = n => n>=1e7?`₹${(n/1e7).toFixed(2)}Cr`:n>=1e5?`₹${(n/1e5).toFixed(1)}L`:`₹${fmtN(n)}`;
const pct = (n,d) => d===0?"0%":`${((n/d)*100).toFixed(1)}%`;
const grp = (data,key,val=null) => data.reduce((acc,r)=>{ const k=r[key]||"Unknown"; acc[k]=(acc[k]||0)+(val?r[val]||0:1); return acc; },{});
const toArr = (obj,limit=50) => Object.entries(obj).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,limit);
const uniq = (arr,key) => [...new Set(arr.map(r=>r[key]).filter(Boolean))].sort();
const downloadCSV = (data) => {
  const cols = ["order_date","sku_code","product_name","qty","final_revenue","Final_Item_Status","marketplace_cat","parent_name","sub_cat_name","Warehouse","state","payment_sources","OMS","Order_Type","days_pending"];
  const csv = [cols.join(","),...data.map(r=>cols.map(c=>`"${r[c]??""}"`) .join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  const a=document.createElement("a"); a.href=url; a.download="orders_export.csv"; a.click();
};

// ─── DESIGN ──────────────────────────────────────────────────────────────────
const P = {
  primary:"#2563EB",success:"#16A34A",danger:"#DC2626",warning:"#D97706",
  purple:"#7C3AED",teal:"#0891B2",orange:"#EA580C",pink:"#DB2777",
  bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",text:"#0F172A",muted:"#64748B",light:"#F1F5F9",
};
const COLORS=["#2563EB","#16A34A","#DC2626","#D97706","#7C3AED","#0891B2","#DB2777","#EA580C","#0D9488","#4F46E5"];
const STATUS_C={Delivered:"#16A34A",Manifested:"#2563EB",Shipped:"#7C3AED",Packed:"#D97706",RTO:"#DC2626",Lost:"#94A3B8",Cancelled:"#EA580C"};
const AGE_C={"0-3 Days (Fresh)":"#16A34A","4-7 Days (Normal)":"#D97706","8-14 Days (Aging)":"#EA580C","15+ Days (Critical)":"#DC2626","Closed":"#94A3B8"};
const NAV=[
  {id:"overview",  icon:"📊",label:"Overview",  short:"OV"},
  {id:"revenue",   icon:"💰",label:"Revenue",   short:"RE"},
  {id:"fulfilment",icon:"🚚",label:"Fulfilment",short:"FL"},
  {id:"channel",   icon:"📡",label:"Channels",  short:"CH"},
  {id:"product",   icon:"📚",label:"Products",  short:"PR"},
  {id:"sku",       icon:"🏷️",label:"SKU",       short:"SK"},
  {id:"geographic",icon:"🗺️",label:"Geographic",short:"GE"},
  {id:"pendency",  icon:"⏳",label:"Pendency",  short:"PE"},
  {id:"operations",icon:"⚙️",label:"Operations",short:"OP"},
  {id:"rawdata",   icon:"📋",label:"Raw Data",  short:"RD"},
];

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────────────
const TT = ({active,payload,label,money=false}) => {
  if(!active||!payload?.length) return null;
  return <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:8,padding:"10px 14px",boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>
    <div style={{color:P.muted,fontSize:11,marginBottom:5,fontWeight:600}}>{label}</div>
    {payload.map((p,i)=><div key={i} style={{color:p.color||P.primary,fontSize:12,fontWeight:700}}>{p.name}: {money?fmtM(p.value):fmtN(p.value)}</div>)}
  </div>;
};

const KPI = ({label,value,sub,delta,color=P.primary,icon}) => (
  <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"16px 18px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,right:0,width:50,height:50,borderRadius:"0 12px 0 50px",background:`${color}12`}}/>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
      <span style={{fontSize:10,fontWeight:700,color:P.muted,letterSpacing:1,textTransform:"uppercase"}}>{label}</span>
      <span style={{fontSize:16}}>{icon}</span>
    </div>
    <div style={{fontSize:22,fontWeight:800,color:P.text,fontFamily:"monospace",lineHeight:1,marginBottom:5}}>{value}</div>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      {delta!==undefined&&<span style={{fontSize:10,fontWeight:700,color:delta>0?"#16A34A":"#DC2626",background:delta>0?"#F0FDF4":"#FEF2F2",borderRadius:4,padding:"1px 5px"}}>{delta>0?"↑":"↓"}{Math.abs(delta)}%</span>}
      {sub&&<span style={{color:P.muted,fontSize:10}}>{sub}</span>}
    </div>
  </div>
);

const Card = ({title,children,action,col,noPad=false}) => (
  <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:noPad?0:20,gridColumn:col?`span ${col}`:undefined,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
    {title&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,padding:noPad?"20px 20px 0":0}}>
      <div style={{fontSize:13,fontWeight:700,color:P.text}}>{title}</div>
      {action&&<div>{action}</div>}
    </div>}
    {children}
  </div>
);

const ProgBar = ({label,value,total,color}) => (
  <div style={{marginBottom:10}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
      <span style={{color:P.text,fontSize:12,fontWeight:500}}>{label}</span>
      <span style={{color,fontSize:12,fontWeight:700,fontFamily:"monospace"}}>{fmtN(value)} <span style={{color:P.muted,fontWeight:400}}>({pct(value,total)})</span></span>
    </div>
    <div style={{background:P.light,borderRadius:4,height:6}}>
      <div style={{background:color,width:pct(value,total),height:6,borderRadius:4,transition:"width 0.6s"}}/>
    </div>
  </div>
);

const Badge = ({label,color}) => <span style={{background:`${color}15`,color,borderRadius:6,padding:"2px 7px",fontSize:11,fontWeight:700}}>{label}</span>;
const Divider = ({label}) => <div style={{color:P.muted,fontSize:10,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${P.border}`}}>{label}</div>;

// ─── FILTER PANEL ─────────────────────────────────────────────────────────────
const FilterPanel = ({orders,filters,onChange,isMobile,open,onClose}) => {
  const defs=[
    {key:"marketplace_cat",label:"Channel"},{key:"Warehouse",label:"Warehouse"},
    {key:"state",label:"State"},{key:"payment_sources",label:"Payment"},
    {key:"OMS",label:"OMS"},{key:"Order_Type",label:"Order Type"},
    {key:"purchase_level",label:"Purchase Level"},{key:"Organization",label:"Organization"},
    {key:"parent_name",label:"Category"},{key:"Final_Item_Status",label:"Status"},
    {key:"delivery_partner",label:"Courier"},{key:"finance_exam_category",label:"Finance Cat"},
    {key:"order_category",label:"Order Category"},
  ];
  const sel={width:"100%",padding:"6px 8px",borderRadius:8,border:`1px solid ${P.border}`,fontSize:12,color:P.text,background:P.card,marginBottom:10,fontFamily:"inherit"};
  const presets=[{label:"7D",days:7},{label:"30D",days:30},{label:"90D",days:90},{label:"ALL",days:120}];
  const panel = (
    <div style={{background:P.card,padding:"16px 14px",overflowY:"auto",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:800,color:P.text,letterSpacing:1}}>FILTERS</div>
        {isMobile&&<button onClick={onClose} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:P.muted}}>✕</button>}
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:600,color:P.muted,marginBottom:6}}>Date Range</div>
        <input type="date" value={filters.dateFrom} onChange={e=>onChange({...filters,dateFrom:e.target.value,preset:""})} style={{...sel,marginBottom:6}}/>
        <input type="date" value={filters.dateTo} onChange={e=>onChange({...filters,dateTo:e.target.value,preset:""})} style={sel}/>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
          {presets.map(p=>{
            const to=new Date(2026,3,30).toISOString().split("T")[0];
            const from=new Date(new Date(2026,3,30)-p.days*864e5).toISOString().split("T")[0];
            const active=filters.preset===p.label;
            return <button key={p.label} onClick={()=>onChange({...filters,dateFrom:from,dateTo:to,preset:p.label})} style={{fontSize:10,padding:"3px 8px",borderRadius:5,border:`1px solid ${active?P.primary:P.border}`,background:active?P.primary:"transparent",color:active?"#fff":P.muted,cursor:"pointer",fontWeight:600}}>{p.label}</button>;
          })}
        </div>
      </div>
      {defs.map(({key,label})=>(
        <div key={key} style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:600,color:P.muted,marginBottom:4}}>{label}</div>
          <select style={sel} value={filters[key]||"all"} onChange={e=>onChange({...filters,[key]:e.target.value})}>
            <option value="all">All</option>
            {uniq(orders,key).map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}
      <button onClick={()=>onChange({dateFrom:"2026-01-01",dateTo:"2026-04-30",preset:""})} style={{width:"100%",padding:"8px",borderRadius:8,border:`1px solid ${P.border}`,background:P.light,color:P.muted,fontSize:12,cursor:"pointer",fontWeight:600}}>Reset All</button>
    </div>
  );
  if(isMobile){
    if(!open) return null;
    return <div style={{position:"fixed",inset:0,zIndex:200}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)"}}/>
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:240,overflowY:"auto"}}>{panel}</div>
    </div>;
  }
  return <div style={{width:196,minWidth:196,borderRight:`1px solid ${P.border}`}}>{panel}</div>;
};

// ─── CHATBOT ─────────────────────────────────────────────────────────────────
const Chatbot = ({filtered}) => {
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState([{role:"assistant",content:"Hi! I'm your PW data assistant 👋 Ask me anything about your orders, revenue, SKUs, or fulfilment."}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  const quick=["What is the total revenue?","Which channel has most orders?","What is the RTO rate?","Top performing category?","How many orders are pending?","Which warehouse dispatches most?"];

  const buildSummary = useCallback((data) => ({
    totalOrders:data.length,
    totalRevenue:data.reduce((s,r)=>s+(r.final_revenue||0),0),
    deliveryRate:((data.filter(r=>r.Final_Item_Status==="Delivered").length/data.length)*100).toFixed(1)+"%",
    rtoRate:((data.filter(r=>r.Final_Item_Status==="RTO").length/data.length)*100).toFixed(1)+"%",
    cancelRate:((data.filter(r=>r.Final_Item_Status==="Cancelled").length/data.length)*100).toFixed(1)+"%",
    topChannel:toArr(grp(data,"marketplace_cat"))[0],
    topCategory:toArr(grp(data,"parent_name","final_revenue"))[0],
    topSKU:toArr(grp(data,"sku_code"))[0],
    topWarehouse:toArr(grp(data,"Warehouse"))[0],
    topState:toArr(grp(data,"state","final_revenue"))[0],
    totalPending:data.filter(r=>["Packed","Shipped","Manifested"].includes(r.Final_Item_Status)).length,
    totalUnits:data.reduce((s,r)=>s+(r.qty||0),0),
    avgOrderValue:data.length?data.reduce((s,r)=>s+(r.final_revenue||0),0)/data.length:0,
    prepaid:data.filter(r=>r.payment_sources==="Prepaid").length,
    cod:data.filter(r=>r.payment_sources==="COD").length,
  }),[]);

  const localAnswer = useCallback((q,data) => {
    const q_=q.toLowerCase();
    const s=buildSummary(data);
    if(q_.includes("revenue")||q_.includes("sales")) return `💰 Total revenue is **${fmtM(s.totalRevenue)}** across ${fmtN(s.totalOrders)} orders. Average order value is ${fmtM(s.avgOrderValue)}.`;
    if(q_.includes("deliver")) return `✅ Delivery rate is **${s.deliveryRate}** (${fmtN(data.filter(r=>r.Final_Item_Status==="Delivered").length)} orders delivered).`;
    if(q_.includes("rto")||q_.includes("return")) return `🔁 RTO rate is **${s.rtoRate}** (${fmtN(data.filter(r=>r.Final_Item_Status==="RTO").length)} orders returned to origin).`;
    if(q_.includes("cancel")) return `❌ Cancellation rate is **${s.cancelRate}** (${fmtN(data.filter(r=>r.Final_Item_Status==="Cancelled").length)} cancelled orders).`;
    if(q_.includes("channel")||q_.includes("platform")||q_.includes("marketplace")) return `📡 Top channel by orders is **${s.topChannel?.name}** with ${fmtN(s.topChannel?.value)} orders.`;
    if(q_.includes("category")||q_.includes("product")) return `📚 Top category by revenue is **${s.topCategory?.name}** with ${fmtM(s.topCategory?.value)}.`;
    if(q_.includes("sku")) return `🏷️ Top SKU by orders is **${s.topSKU?.name}** with ${fmtN(s.topSKU?.value)} orders.`;
    if(q_.includes("pending")||q_.includes("transit")) return `⏳ **${fmtN(s.totalPending)}** orders are currently pending (${pct(s.totalPending,s.totalOrders)} of total).`;
    if(q_.includes("warehouse")) return `🏭 Top warehouse is **${s.topWarehouse?.name}** handling ${fmtN(s.topWarehouse?.value)} orders.`;
    if(q_.includes("state")||q_.includes("geography")||q_.includes("region")) return `🗺️ Top state by revenue is **${s.topState?.name}** with ${fmtM(s.topState?.value)}.`;
    if(q_.includes("order")) return `🗂️ Total orders: **${fmtN(s.totalOrders)}**. Units sold: ${fmtN(s.totalUnits)}. AOV: ${fmtM(s.avgOrderValue)}.`;
    if(q_.includes("prepaid")||q_.includes("cod")||q_.includes("payment")) return `💳 Payment split — Prepaid: **${fmtN(s.prepaid)}** (${pct(s.prepaid,s.totalOrders)}), COD: **${fmtN(s.cod)}** (${pct(s.cod,s.totalOrders)}).`;
    if(q_.includes("unit")) return `📦 Total units sold: **${fmtN(s.totalUnits)}**. Average ${(s.totalUnits/s.totalOrders).toFixed(1)} units per order.`;
    return `📊 Summary: **${fmtN(s.totalOrders)} orders**, **${fmtM(s.totalRevenue)} revenue**, **${s.deliveryRate} delivery rate**, **${s.rtoRate} RTO rate**.\n\nTry asking: revenue, delivery rate, RTO, channels, categories, pending orders, warehouses, states, payment, units.`;
  },[buildSummary]);

  const send = useCallback(async(q) => {
    if(!q.trim()) return;
    setMsgs(prev=>[...prev,{role:"user",content:q}]);
    setInput(""); setLoading(true);
    try {
      const summary = buildSummary(filtered);
      const res = await fetch("/api/chat",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({question:q,summary}),
      });
      if(!res.ok) throw new Error("API not set up");
      const data = await res.json();
      setMsgs(prev=>[...prev,{role:"assistant",content:data.answer}]);
    } catch {
      setMsgs(prev=>[...prev,{role:"assistant",content:localAnswer(q,filtered)}]);
    }
    setLoading(false);
  },[filtered,buildSummary,localAnswer]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  return <>
    <button onClick={()=>setOpen(o=>!o)} style={{position:"fixed",bottom:80,right:20,zIndex:300,width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${P.primary},${P.purple})`,border:"none",fontSize:24,cursor:"pointer",boxShadow:"0 4px 20px rgba(37,99,235,0.4)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
      {open?"✕":"💬"}
    </button>
    {open&&<div style={{position:"fixed",bottom:144,right:20,zIndex:300,width:340,height:480,background:P.card,borderRadius:16,boxShadow:"0 8px 40px rgba(0,0,0,0.2)",display:"flex",flexDirection:"column",border:`1px solid ${P.border}`}}>
      <div style={{background:`linear-gradient(135deg,${P.primary},${P.purple})`,borderRadius:"16px 16px 0 0",padding:"14px 18px",color:"#fff"}}>
        <div style={{fontWeight:800,fontSize:14}}>💬 AI Data Assistant</div>
        <div style={{fontSize:11,opacity:0.8}}>Ask anything about your orders</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"85%",background:m.role==="user"?P.primary:P.light,color:m.role==="user"?"#fff":P.text,borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",padding:"10px 14px",fontSize:12,lineHeight:1.6,whiteSpace:"pre-wrap"}}>
              {m.content}
            </div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",justifyContent:"flex-start"}}>
          <div style={{background:P.light,borderRadius:12,padding:"10px 14px",fontSize:12,color:P.muted}}>Thinking...</div>
        </div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"8px 14px",borderTop:`1px solid ${P.border}`,overflowX:"auto",display:"flex",gap:6,paddingBottom:0}}>
        {quick.map(q=><button key={q} onClick={()=>send(q)} style={{flexShrink:0,fontSize:10,padding:"4px 8px",borderRadius:6,border:`1px solid ${P.border}`,background:P.light,color:P.muted,cursor:"pointer",whiteSpace:"nowrap"}}>{q}</button>)}
      </div>
      <div style={{padding:14,display:"flex",gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)} placeholder="Ask a question..." style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1px solid ${P.border}`,fontSize:12,fontFamily:"inherit",outline:"none"}}/>
        <button onClick={()=>send(input)} style={{background:P.primary,color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,cursor:"pointer",fontWeight:700}}>Send</button>
      </div>
    </div>}
  </>;
};

// ─── PAGE: OVERVIEW ───────────────────────────────────────────────────────────
const Overview = ({d,drill}) => {
  const total=d.length, rev=d.reduce((s,r)=>s+(r.final_revenue||0),0);
  const units=d.reduce((s,r)=>s+(r.qty||0),0), disc=d.reduce((s,r)=>s+(r.discount||0),0);
  const delivered=d.filter(r=>r.Final_Item_Status==="Delivered").length;
  const rto=d.filter(r=>r.Final_Item_Status==="RTO").length;
  const cancelled=d.filter(r=>r.Final_Item_Status==="Cancelled").length;
  const shipped=d.filter(r=>r.Final_Item_Status==="Shipped").length;
  const manifested=d.filter(r=>r.Final_Item_Status==="Manifested").length;
  const packed=d.filter(r=>r.Final_Item_Status==="Packed").length;
  const lost=d.filter(r=>r.Final_Item_Status==="Lost").length;
  const dateData=useMemo(()=>{ const byD=grp(d,"order_date"),rD=d.reduce((a,r)=>{a[r.order_date]=(a[r.order_date]||0)+(r.final_revenue||0);return a;},{}); return Object.entries(byD).sort(([a],[b])=>a.localeCompare(b)).map(([dt,orders])=>({date:dt.slice(5),orders,revenue:Math.round(rD[dt]||0)})); },[d]);
  const statusData=toArr(grp(d,"Final_Item_Status")), monthData=toArr(grp(d,"month","final_revenue"));
  return <div>
    <Divider label="Core Metrics"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}}>
      <KPI label="Total Orders" value={fmtN(total)} sub="order lines" icon="🗂️" color={P.primary} delta={8.2}/>
      <KPI label="Gross Revenue" value={fmtM(rev)} sub={`AOV ${fmtM(total?rev/total:0)}`} icon="💰" color={P.success} delta={12.4}/>
      <KPI label="Units Sold" value={fmtN(units)} sub={`${(units/total).toFixed(1)}/order`} icon="📦" color={P.purple} delta={5.1}/>
      <KPI label="Discount Given" value={fmtM(disc)} sub={`${pct(disc,rev)} rate`} icon="🏷️" color={P.warning} delta={-2.3}/>
    </div>
    <Divider label="Fulfilment Health"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}}>
      <KPI label="Delivery Rate" value={pct(delivered,total)} sub={`${fmtN(delivered)} delivered`} icon="✅" color={P.success} delta={3.1}/>
      <KPI label="RTO Rate" value={pct(rto,total)} sub={`${fmtN(rto)} RTOs`} icon="🔁" color={P.danger} delta={-1.2}/>
      <KPI label="Cancel Rate" value={pct(cancelled,total)} sub={`${fmtN(cancelled)} cancelled`} icon="❌" color={P.orange} delta={-0.8}/>
      <KPI label="In Transit" value={fmtN(shipped+manifested)} sub={pct(shipped+manifested,total)} icon="🚚" color={P.teal}/>
    </div>
    <Card title="📈 Daily Trend"><ResponsiveContainer width="100%" height={180}><ComposedChart data={dateData}><CartesianGrid strokeDasharray="3 3" stroke={P.border}/><XAxis dataKey="date" tick={{fill:P.muted,fontSize:9}} stroke={P.border}/><YAxis yAxisId="l" tick={{fill:P.muted,fontSize:9}} stroke={P.border}/><YAxis yAxisId="r" orientation="right" tick={{fill:P.muted,fontSize:9}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><Tooltip content={<TT/>}/><Legend wrapperStyle={{fontSize:10}}/><Bar yAxisId="l" dataKey="orders" name="Orders" fill={`${P.primary}30`} stroke={P.primary} strokeWidth={1} radius={[2,2,0,0]}/><Line yAxisId="r" type="monotone" dataKey="revenue" name="Revenue" stroke={P.success} strokeWidth={2} dot={false}/></ComposedChart></ResponsiveContainer></Card>
    <div style={{marginTop:16}}><Card title="🚦 Fulfilment Funnel">
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:10}}>
        {[["Packed",packed,P.warning],["Shipped",shipped,P.purple],["Manifested",manifested,P.teal],["Delivered",delivered,P.success]].map(([l,v,c])=>(
          <div key={l} style={{background:P.light,borderRadius:10,padding:"10px 8px",textAlign:"center",border:`2px solid ${c}20`,cursor:"pointer"}} onClick={()=>drill("Final_Item_Status",l)}>
            <div style={{color:c,fontSize:18,fontWeight:800,fontFamily:"monospace"}}>{fmtN(v)}</div>
            <div style={{color:P.muted,fontSize:10,marginTop:2}}>{l} · {pct(v,total)}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {[["RTO",rto,P.danger],["Cancelled",cancelled,P.orange],["Lost",lost,"#94A3B8"]].map(([l,v,c])=>(
          <div key={l} style={{background:`${c}10`,borderRadius:8,padding:"8px",textAlign:"center",cursor:"pointer"}} onClick={()=>drill("Final_Item_Status",l)}>
            <div style={{color:c,fontSize:14,fontWeight:800,fontFamily:"monospace"}}>{fmtN(v)}</div>
            <div style={{color:P.muted,fontSize:10}}>{l} · {pct(v,total)}</div>
          </div>
        ))}
      </div>
    </Card></div>
    <div style={{marginTop:16}}><Card title="📅 Monthly Revenue"><ResponsiveContainer width="100%" height={160}><BarChart data={monthData}><CartesianGrid strokeDasharray="3 3" stroke={P.border}/><XAxis dataKey="name" tick={{fill:P.muted,fontSize:10}} stroke={P.border}/><YAxis tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><Tooltip content={<TT money/>}/><Bar dataKey="value" name="Revenue" radius={[4,4,0,0]}>{monthData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer></Card></div>
    <div style={{marginTop:16}}><Card title="🔵 Status Split"><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40} onClick={d2=>drill("Final_Item_Status",d2.name)}>{statusData.map((x,i)=><Cell key={i} fill={STATUS_C[x.name]||COLORS[i%COLORS.length]} cursor="pointer"/>)}</Pie><Tooltip formatter={v=>[fmtN(v),"Orders"]} contentStyle={{borderRadius:8}}/><Legend iconType="circle" wrapperStyle={{fontSize:10}}/></PieChart></ResponsiveContainer></Card></div>
  </div>;
};

// ─── PAGE: REVENUE ────────────────────────────────────────────────────────────
const Revenue = ({d}) => {
  const rev=d.reduce((s,r)=>s+(r.final_revenue||0),0), disc=d.reduce((s,r)=>s+(r.discount||0),0);
  const chRevData=toArr(grp(d,"marketplace_cat","final_revenue"),8), catRevData=toArr(grp(d,"parent_name","final_revenue"),7);
  const payRevData=toArr(grp(d,"payment_sources","final_revenue"));
  const wkData=useMemo(()=>{ const bW=grp(d,"week","final_revenue"); return Object.entries(bW).sort(([a],[b])=>a.localeCompare(b)).map(([w,v])=>({name:w,value:Math.round(v)})); },[d]);
  return <div>
    <Divider label="Revenue Summary"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}}>
      <KPI label="Gross Revenue" value={fmtM(rev)} sub="Total billed" icon="💰" color={P.success} delta={12.4}/>
      <KPI label="Avg Order Value" value={fmtM(d.length?rev/d.length:0)} sub="per order" icon="📊" color={P.primary} delta={3.2}/>
      <KPI label="Avg Unit Price" value={`₹${fmtN(d.length?d.reduce((s,r)=>s+(r.unitPrice||0),0)/d.length:0)}`} sub="selling price" icon="🏷️" color={P.purple} delta={1.8}/>
      <KPI label="Total Discounts" value={fmtM(disc)} sub={`${pct(disc,rev+disc)} of gross`} icon="🎁" color={P.warning} delta={-2.1}/>
    </div>
    <Card title="📅 Weekly Revenue"><ResponsiveContainer width="100%" height={180}><AreaChart data={wkData}><defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={P.success} stopOpacity={0.2}/><stop offset="95%" stopColor={P.success} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={P.border}/><XAxis dataKey="name" tick={{fill:P.muted,fontSize:10}} stroke={P.border}/><YAxis tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><Tooltip content={<TT money/>}/><Area type="monotone" dataKey="value" name="Revenue" stroke={P.success} fill="url(#rg)" strokeWidth={2} dot={false}/></AreaChart></ResponsiveContainer></Card>
    <div style={{marginTop:16}}><Card title="💰 Revenue by Channel"><ResponsiveContainer width="100%" height={200}><BarChart data={chRevData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false}/><XAxis type="number" tick={{fill:P.muted,fontSize:9}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><YAxis type="category" dataKey="name" tick={{fill:P.text,fontSize:10}} stroke={P.border} width={80}/><Tooltip content={<TT money/>}/><Bar dataKey="value" name="Revenue" radius={[0,4,4,0]}>{chRevData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer></Card></div>
    <div style={{marginTop:16}}><Card title="📚 Revenue by Category"><ResponsiveContainer width="100%" height={200}><BarChart data={catRevData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false}/><XAxis type="number" tick={{fill:P.muted,fontSize:9}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><YAxis type="category" dataKey="name" tick={{fill:P.text,fontSize:10}} stroke={P.border} width={110}/><Tooltip content={<TT money/>}/><Bar dataKey="value" name="Revenue" radius={[0,4,4,0]}>{catRevData.map((_,i)=><Cell key={i} fill={COLORS[(i+3)%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer></Card></div>
    <div style={{marginTop:16}}><Card title="💳 Revenue by Payment"><div style={{marginTop:8}}>{payRevData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={rev} color={COLORS[i]}/>)}</div></Card></div>
  </div>;
};

// ─── PAGE: FULFILMENT ─────────────────────────────────────────────────────────
const Fulfilment = ({d}) => {
  const total=d.length, delivered=d.filter(r=>r.Final_Item_Status==="Delivered").length;
  const rto=d.filter(r=>r.Final_Item_Status==="RTO").length, lost=d.filter(r=>r.Final_Item_Status==="Lost").length;
  const cancelled=d.filter(r=>r.Final_Item_Status==="Cancelled").length;
  const statusData=toArr(grp(d,"Final_Item_Status")), partnerData=toArr(grp(d,"delivery_partner"));
  const whData=toArr(grp(d,"Warehouse")), rtoByChannel=toArr(grp(d.filter(r=>r.Final_Item_Status==="RTO"),"marketplace_cat"));
  const cancelReasons=toArr(grp(d.filter(r=>r.cancellation_reason),"cancellation_reason"));
  return <div>
    <Divider label="Fulfilment Summary"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}}>
      <KPI label="Delivery Rate" value={pct(delivered,total)} sub={`${fmtN(delivered)} delivered`} icon="✅" color={P.success} delta={3.1}/>
      <KPI label="RTO Rate" value={pct(rto,total)} sub={`${fmtN(rto)} RTOs`} icon="🔁" color={P.danger} delta={-1.2}/>
      <KPI label="Lost Rate" value={pct(lost,total)} sub={`${fmtN(lost)} lost`} icon="🚨" color={P.muted}/>
      <KPI label="Cancel Rate" value={pct(cancelled,total)} sub="of all orders" icon="❌" color={P.orange} delta={-0.8}/>
    </div>
    <Card title="📦 Status Breakdown"><div style={{marginTop:8}}>{statusData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={STATUS_C[x.name]||COLORS[i]}/>)}</div></Card>
    <div style={{marginTop:16}}><Card title="🚚 Courier Performance"><div style={{marginTop:8}}>{partnerData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[i]}/>)}</div></Card></div>
    <div style={{marginTop:16}}><Card title="🔁 RTO by Channel"><div style={{marginTop:8}}>{rtoByChannel.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={rto||1} color={COLORS[(i+2)%COLORS.length]}/>)}</div></Card></div>
    <div style={{marginTop:16}}><Card title="🏭 Warehouse Split"><ResponsiveContainer width="100%" height={180}><PieChart><Pie data={whData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={68}>{whData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip formatter={v=>[fmtN(v),"Orders"]} contentStyle={{borderRadius:8}}/><Legend iconType="circle" wrapperStyle={{fontSize:10}}/></PieChart></ResponsiveContainer></Card></div>
    <div style={{marginTop:16}}><Card title="❌ Cancellation Reasons">{cancelReasons.length?<div style={{marginTop:8}}>{cancelReasons.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={cancelled||1} color={COLORS[(i+4)%COLORS.length]}/>)}</div>:<div style={{color:P.muted,fontSize:12,textAlign:"center",padding:20}}>No cancellations in filter</div>}</Card></div>
  </div>;
};

// ─── PAGE: CHANNELS ───────────────────────────────────────────────────────────
const Channels = ({d}) => {
  const [selected,setSelected]=useState(null);
  const total=d.length, chData=toArr(grp(d,"marketplace_cat")), chRevData=toArr(grp(d,"marketplace_cat","final_revenue"));
  const chMatrix=useMemo(()=>chData.map(ch=>{ const sub=d.filter(r=>r.marketplace_cat===ch.name); const del=sub.filter(r=>r.Final_Item_Status==="Delivered").length; const rto=sub.filter(r=>r.Final_Item_Status==="RTO").length; const rev=sub.reduce((s,r)=>s+(r.final_revenue||0),0); return {name:ch.name,orders:sub.length,delivered:del,rto,revenue:rev,deliveryRate:sub.length?((del/sub.length)*100).toFixed(1):0,rtoRate:sub.length?((rto/sub.length)*100).toFixed(1):0}; }),[d,chData]);
  const drillData=selected?toArr(grp(d.filter(r=>r.marketplace_cat===selected),"sub_cat_name","final_revenue"),8):[];
  return <div>
    <Divider label="Channel Analytics"/>
    <Card title="📡 Orders by Channel — tap to drill down">
      <ResponsiveContainer width="100%" height={180}><BarChart data={chData} onClick={e=>e&&setSelected(e.activeLabel)}><CartesianGrid strokeDasharray="3 3" stroke={P.border}/><XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} stroke={P.border}/><YAxis tick={{fill:P.muted,fontSize:9}} stroke={P.border}/><Tooltip content={<TT/>}/><Bar dataKey="value" name="Orders" radius={[4,4,0,0]} cursor="pointer">{chData.map((x,i)=><Cell key={i} fill={selected===x.name?P.primary:COLORS[i%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer>
      <div style={{color:P.muted,fontSize:11,textAlign:"center",marginTop:6}}>Tap a bar to see sub-category breakdown ↓</div>
    </Card>
    {selected&&<div style={{marginTop:12}}><Card title={`🔍 ${selected} — by Sub-Category`} action={<button onClick={()=>setSelected(null)} style={{background:"none",border:"none",cursor:"pointer",color:P.danger,fontWeight:700,fontSize:13}}>✕</button>}><ResponsiveContainer width="100%" height={160}><BarChart data={drillData}><CartesianGrid strokeDasharray="3 3" stroke={P.border}/><XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} stroke={P.border}/><YAxis tick={{fill:P.muted,fontSize:9}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><Tooltip content={<TT money/>}/><Bar dataKey="value" name="Revenue" fill={P.primary} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></Card></div>}
    <div style={{marginTop:16}}><Card title="💰 Revenue by Channel"><ResponsiveContainer width="100%" height={180}><BarChart data={chRevData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false}/><XAxis type="number" tick={{fill:P.muted,fontSize:9}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><YAxis type="category" dataKey="name" tick={{fill:P.text,fontSize:10}} stroke={P.border} width={80}/><Tooltip content={<TT money/>}/><Bar dataKey="value" name="Revenue" radius={[0,4,4,0]}>{chRevData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer></Card></div>
    <div style={{marginTop:16}}><Card title="📊 Channel Performance Matrix" noPad>
      <div style={{overflowX:"auto",padding:20,paddingTop:0}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:500}}>
          <thead><tr style={{background:P.light}}>{["Channel","Orders","Revenue","AOV","Del%","RTO%"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:P.muted,fontWeight:700,fontSize:11,borderBottom:`1px solid ${P.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{chMatrix.map((row,i)=><tr key={i} style={{borderBottom:`1px solid ${P.border}`,cursor:"pointer",background:selected===row.name?`${P.primary}08`:"transparent"}} onClick={()=>setSelected(selected===row.name?null:row.name)}>
            <td style={{padding:"8px 12px",fontWeight:600,color:P.text}}>{row.name}</td>
            <td style={{padding:"8px 12px",fontFamily:"monospace"}}>{fmtN(row.orders)}</td>
            <td style={{padding:"8px 12px",fontFamily:"monospace",color:P.success,fontWeight:700}}>{fmtM(row.revenue)}</td>
            <td style={{padding:"8px 12px",fontFamily:"monospace"}}>{fmtM(row.orders?row.revenue/row.orders:0)}</td>
            <td style={{padding:"8px 12px"}}><Badge label={`${row.deliveryRate}%`} color={row.deliveryRate>50?P.success:P.warning}/></td>
            <td style={{padding:"8px 12px"}}><Badge label={`${row.rtoRate}%`} color={row.rtoRate>10?P.danger:P.success}/></td>
          </tr>)}</tbody>
        </table>
      </div>
    </Card></div>
  </div>;
};

// ─── PAGE: PRODUCTS ───────────────────────────────────────────────────────────
const Products = ({d}) => {
  const [selected,setSelected]=useState(null);
  const total=d.length, catData=toArr(grp(d,"parent_name")), catRevData=toArr(grp(d,"parent_name","final_revenue"));
  const subCatData=selected?toArr(grp(d.filter(r=>r.parent_name===selected),"sub_cat_name","final_revenue"),10):[];
  const omsData=toArr(grp(d,"OMS")), otData=toArr(grp(d,"Order_Type")), plData=toArr(grp(d,"purchase_level"));
  return <div>
    <Divider label="Product Analytics"/>
    <Card title="📚 Orders by Category — tap to drill">
      <ResponsiveContainer width="100%" height={180}><BarChart data={catData} onClick={e=>e&&setSelected(e.activeLabel)}><CartesianGrid strokeDasharray="3 3" stroke={P.border}/><XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} stroke={P.border} angle={-15} textAnchor="end" height={50}/><YAxis tick={{fill:P.muted,fontSize:9}} stroke={P.border}/><Tooltip content={<TT/>}/><Bar dataKey="value" name="Orders" radius={[4,4,0,0]} cursor="pointer">{catData.map((x,i)=><Cell key={i} fill={selected===x.name?P.primary:COLORS[i%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer>
    </Card>
    {selected&&<div style={{marginTop:12}}><Card title={`🔍 ${selected} — Sub Categories`} action={<button onClick={()=>setSelected(null)} style={{background:"none",border:"none",cursor:"pointer",color:P.danger,fontWeight:700,fontSize:13}}>✕</button>}><ResponsiveContainer width="100%" height={150}><BarChart data={subCatData}><CartesianGrid strokeDasharray="3 3" stroke={P.border}/><XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} stroke={P.border}/><YAxis tick={{fill:P.muted,fontSize:9}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><Tooltip content={<TT money/>}/><Bar dataKey="value" name="Revenue" fill={P.purple} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></Card></div>}
    <div style={{marginTop:16}}><Card title="💰 Revenue by Category"><ResponsiveContainer width="100%" height={180}><BarChart data={catRevData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false}/><XAxis type="number" tick={{fill:P.muted,fontSize:9}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><YAxis type="category" dataKey="name" tick={{fill:P.text,fontSize:10}} stroke={P.border} width={110}/><Tooltip content={<TT money/>}/><Bar dataKey="value" name="Revenue" radius={[0,4,4,0]}>{catRevData.map((_,i)=><Cell key={i} fill={COLORS[(i+2)%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer></Card></div>
    <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr",gap:16}}>
      <Card title="🔀 OMS & Order Type">
        <div style={{marginBottom:12}}><div style={{fontSize:11,fontWeight:600,color:P.muted,marginBottom:6}}>OMS Platform</div>{omsData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[i]}/>)}</div>
        <div><div style={{fontSize:11,fontWeight:600,color:P.muted,marginBottom:6}}>Order Type</div>{otData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[(i+3)%COLORS.length]}/>)}</div>
      </Card>
      <Card title="🛒 Purchase Level"><div style={{marginTop:4}}>{plData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[(i+5)%COLORS.length]}/>)}</div></Card>
    </div>
  </div>;
};

// ─── PAGE: SKU ────────────────────────────────────────────────────────────────
const SKU = ({d}) => {
  const [sortBy,setSortBy]=useState("revenue");
  const skuMatrix=useMemo(()=>{
    const byCode=grp(d,"sku_code");
    return Object.keys(byCode).map(code=>{
      const sub=d.filter(r=>r.sku_code===code);
      const del=sub.filter(r=>r.Final_Item_Status==="Delivered").length;
      const rto=sub.filter(r=>r.Final_Item_Status==="RTO").length;
      const rev=sub.reduce((s,r)=>s+(r.final_revenue||0),0);
      const units=sub.reduce((s,r)=>s+(r.qty||0),0);
      const name=sub[0]?.product_name||code;
      return {code,name,orders:sub.length,units,revenue:rev,delivered:del,rto,deliveryRate:sub.length?((del/sub.length)*100).toFixed(1):0,rtoRate:sub.length?((rto/sub.length)*100).toFixed(1):0,avgPrice:sub.length?rev/sub.length:0};
    }).sort((a,b)=>sortBy==="revenue"?b.revenue-a.revenue:sortBy==="orders"?b.orders-a.orders:sortBy==="rto"?b.rtoRate-a.rtoRate:b.deliveryRate-a.deliveryRate).slice(0,15);
  },[d,sortBy]);
  const topRevData=skuMatrix.slice(0,8).map(s=>({name:s.code,value:s.revenue}));
  const topOrdData=skuMatrix.slice(0,8).map(s=>({name:s.code,value:s.orders}));
  const total=d.length, totalRev=d.reduce((s,r)=>s+(r.final_revenue||0),0);
  return <div>
    <Divider label="SKU Level Insights"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}}>
      <KPI label="Unique SKUs" value={fmtN(new Set(d.map(r=>r.sku_code)).size)} sub="in current filter" icon="🏷️" color={P.primary}/>
      <KPI label="Avg SKU Revenue" value={fmtM(totalRev/(new Set(d.map(r=>r.sku_code)).size||1))} sub="per SKU" icon="💰" color={P.success}/>
      <KPI label="Top SKU Orders" value={fmtN(skuMatrix[0]?.orders||0)} sub={skuMatrix[0]?.code||""} icon="📦" color={P.purple}/>
      <KPI label="Top SKU Revenue" value={fmtM(skuMatrix[0]?.revenue||0)} sub={skuMatrix[0]?.code||""} icon="📊" color={P.teal}/>
    </div>
    <Card title="📊 Top SKUs by Revenue"><ResponsiveContainer width="100%" height={180}><BarChart data={topRevData}><CartesianGrid strokeDasharray="3 3" stroke={P.border}/><XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} stroke={P.border}/><YAxis tick={{fill:P.muted,fontSize:9}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><Tooltip content={<TT money/>}/><Bar dataKey="value" name="Revenue" radius={[4,4,0,0]}>{topRevData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer></Card>
    <div style={{marginTop:16}}><Card title="📦 Top SKUs by Orders"><ResponsiveContainer width="100%" height={180}><BarChart data={topOrdData}><CartesianGrid strokeDasharray="3 3" stroke={P.border}/><XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} stroke={P.border}/><YAxis tick={{fill:P.muted,fontSize:9}} stroke={P.border}/><Tooltip content={<TT/>}/><Bar dataKey="value" name="Orders" fill={P.teal} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></Card></div>
    <div style={{marginTop:16}}><Card title="📋 SKU Performance Table" noPad action={
      <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{fontSize:11,padding:"4px 8px",borderRadius:6,border:`1px solid ${P.border}`,background:P.card,fontFamily:"inherit",marginRight:16,marginTop:16}}>
        <option value="revenue">Sort: Revenue</option><option value="orders">Sort: Orders</option><option value="rto">Sort: RTO Rate</option><option value="delivery">Sort: Delivery</option>
      </select>}>
      <div style={{overflowX:"auto",padding:"0 20px 20px"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:600}}>
          <thead><tr style={{background:P.light}}>{["SKU Code","Product Name","Orders","Revenue","Units","Del%","RTO%","AOV"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",color:P.muted,fontWeight:700,fontSize:10,borderBottom:`1px solid ${P.border}`,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>{skuMatrix.map((row,i)=><tr key={i} style={{borderBottom:`1px solid ${P.border}`}}>
            <td style={{padding:"8px 10px",fontFamily:"monospace",color:P.primary,fontWeight:600,whiteSpace:"nowrap"}}>{row.code}</td>
            <td style={{padding:"8px 10px",color:P.text,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={row.name}>{row.name}</td>
            <td style={{padding:"8px 10px",fontFamily:"monospace"}}>{fmtN(row.orders)}</td>
            <td style={{padding:"8px 10px",fontFamily:"monospace",color:P.success,fontWeight:700}}>{fmtM(row.revenue)}</td>
            <td style={{padding:"8px 10px",fontFamily:"monospace"}}>{fmtN(row.units)}</td>
            <td style={{padding:"8px 10px"}}><Badge label={`${row.deliveryRate}%`} color={row.deliveryRate>50?P.success:P.warning}/></td>
            <td style={{padding:"8px 10px"}}><Badge label={`${row.rtoRate}%`} color={row.rtoRate>10?P.danger:P.success}/></td>
            <td style={{padding:"8px 10px",fontFamily:"monospace"}}>{fmtM(row.avgPrice)}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </Card></div>
  </div>;
};

// ─── PAGE: GEOGRAPHIC ─────────────────────────────────────────────────────────
const Geographic = ({d}) => {
  const stRevData=toArr(grp(d,"state","final_revenue"),10), stOrdData=toArr(grp(d,"state"),10);
  const stMatrix=useMemo(()=>toArr(grp(d,"state")).map(s=>{ const sub=d.filter(r=>r.state===s.name); const del=sub.filter(r=>r.Final_Item_Status==="Delivered").length; const rto=sub.filter(r=>r.Final_Item_Status==="RTO").length; const rev=sub.reduce((a,r)=>a+(r.final_revenue||0),0); return {name:s.name,orders:sub.length,delivered:del,rto,revenue:rev,delRate:sub.length?((del/sub.length)*100).toFixed(1):0}; }).sort((a,b)=>b.orders-a.orders).slice(0,10),[d]);
  return <div>
    <Divider label="Geographic Analytics"/>
    <Card title="🌏 Revenue by State"><ResponsiveContainer width="100%" height={220}><BarChart data={stRevData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false}/><XAxis type="number" tick={{fill:P.muted,fontSize:9}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><YAxis type="category" dataKey="name" tick={{fill:P.text,fontSize:10}} stroke={P.border} width={110}/><Tooltip content={<TT money/>}/><Bar dataKey="value" name="Revenue" radius={[0,4,4,0]}>{stRevData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer></Card>
    <div style={{marginTop:16}}><Card title="📦 Orders by State"><ResponsiveContainer width="100%" height={220}><BarChart data={stOrdData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false}/><XAxis type="number" tick={{fill:P.muted,fontSize:9}} stroke={P.border}/><YAxis type="category" dataKey="name" tick={{fill:P.text,fontSize:10}} stroke={P.border} width={110}/><Tooltip content={<TT/>}/><Bar dataKey="value" name="Orders" fill={P.teal} radius={[0,4,4,0]}/></BarChart></ResponsiveContainer></Card></div>
    <div style={{marginTop:16}}><Card title="📊 State Performance Matrix" noPad>
      <div style={{overflowX:"auto",padding:"0 20px 20px"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:500}}>
          <thead><tr style={{background:P.light}}>{["State","Orders","Revenue","AOV","Delivered","RTO","Del Rate"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",color:P.muted,fontWeight:700,fontSize:10,borderBottom:`1px solid ${P.border}`,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>{stMatrix.map((row,i)=><tr key={i} style={{borderBottom:`1px solid ${P.border}`}}>
            <td style={{padding:"8px 10px",fontWeight:600}}>{row.name}</td>
            <td style={{padding:"8px 10px",fontFamily:"monospace"}}>{fmtN(row.orders)}</td>
            <td style={{padding:"8px 10px",fontFamily:"monospace",color:P.success,fontWeight:700}}>{fmtM(row.revenue)}</td>
            <td style={{padding:"8px 10px",fontFamily:"monospace"}}>{fmtM(row.orders?row.revenue/row.orders:0)}</td>
            <td style={{padding:"8px 10px",fontFamily:"monospace",color:P.success}}>{fmtN(row.delivered)}</td>
            <td style={{padding:"8px 10px",fontFamily:"monospace",color:P.danger}}>{fmtN(row.rto)}</td>
            <td style={{padding:"8px 10px"}}><Badge label={`${row.delRate}%`} color={row.delRate>50?P.success:P.warning}/></td>
          </tr>)}</tbody>
        </table>
      </div>
    </Card></div>
  </div>;
};

// ─── PAGE: PENDENCY ───────────────────────────────────────────────────────────
const Pendency = ({d}) => {
  const pending=d.filter(r=>["Packed","Shipped","Manifested"].includes(r.Final_Item_Status));
  const total=pending.length, totalAll=d.length;
  const critical=pending.filter(r=>r.age_bucket==="15+ Days (Critical)").length;
  const aging=pending.filter(r=>r.age_bucket==="8-14 Days (Aging)").length;
  const fresh=pending.filter(r=>r.age_bucket==="0-3 Days (Fresh)").length;
  const avgDays=total?Math.round(pending.reduce((s,r)=>s+(r.days_pending||0),0)/total):0;
  const maxDays=total?Math.max(...pending.map(r=>r.days_pending||0)):0;
  const ageBuckets=["0-3 Days (Fresh)","4-7 Days (Normal)","8-14 Days (Aging)","15+ Days (Critical)"];
  const ageData=ageBuckets.map(b=>({name:b,value:pending.filter(r=>r.age_bucket===b).length}));
  const whPendency=useMemo(()=>toArr(grp(pending,"Warehouse")).map(w=>{ const sub=pending.filter(r=>r.Warehouse===w.name); const crit=sub.filter(r=>r.age_bucket==="15+ Days (Critical)").length; return {...w,critical:crit}; }),[pending]);
  const chPendency=useMemo(()=>toArr(grp(pending,"marketplace_cat")).map(c=>{ const sub=pending.filter(r=>r.marketplace_cat===c.name); const crit=sub.filter(r=>r.age_bucket==="15+ Days (Critical)").length; const avgD=sub.length?Math.round(sub.reduce((s,r)=>s+(r.days_pending||0),0)/sub.length):0; return {...c,critical:crit,avgDays:avgD}; }),[pending]);
  const statusPendency=["Packed","Shipped","Manifested"].map(st=>({ name:st, value:pending.filter(r=>r.Final_Item_Status===st).length, critical:pending.filter(r=>r.Final_Item_Status===st&&r.age_bucket==="15+ Days (Critical)").length }));
  return <div>
    <Divider label="Pendency Analysis"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}}>
      <KPI label="Total Pending" value={fmtN(total)} sub={pct(total,totalAll)+" of orders"} icon="⏳" color={P.warning}/>
      <KPI label="Critical (15+d)" value={fmtN(critical)} sub={pct(critical,total)+" of pending"} icon="🚨" color={P.danger}/>
      <KPI label="Avg Days Pending" value={`${avgDays}d`} sub="average age" icon="📅" color={P.purple}/>
      <KPI label="Max Days Pending" value={`${maxDays}d`} sub="oldest order" icon="⚠️" color={P.orange}/>
    </div>
    <Card title="📊 Pending Orders by Age Bucket">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={ageData}>
          <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
          <XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} stroke={P.border}/>
          <YAxis tick={{fill:P.muted,fontSize:9}} stroke={P.border}/>
          <Tooltip content={<TT/>}/>
          <Bar dataKey="value" name="Orders" radius={[4,4,0,0]}>{ageData.map((x,i)=><Cell key={i} fill={AGE_C[x.name]||COLORS[i]}/>)}</Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
        {ageBuckets.map(b=><div key={b} style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}>
          <div style={{width:10,height:10,borderRadius:2,background:AGE_C[b]}}/>
          <span style={{color:P.muted}}>{b}: {fmtN(pending.filter(r=>r.age_bucket===b).length)}</span>
        </div>)}
      </div>
    </Card>
    <div style={{marginTop:16}}><Card title="🚦 Pending by Status">
      {statusPendency.map((s,i)=>(
        <div key={i} style={{marginBottom:12,padding:"10px 12px",background:P.light,borderRadius:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontWeight:700,color:STATUS_C[s.name]||P.text,fontSize:13}}>{s.name}</span>
            <span style={{fontFamily:"monospace",fontWeight:700,color:P.text}}>{fmtN(s.value)} orders</span>
          </div>
          <div style={{display:"flex",gap:12}}>
            <span style={{fontSize:11,color:P.muted}}>Total: {fmtN(s.value)}</span>
            <span style={{fontSize:11,color:P.danger,fontWeight:700}}>Critical: {fmtN(s.critical)} ({pct(s.critical,s.value||1)})</span>
          </div>
        </div>
      ))}
    </Card></div>
    <div style={{marginTop:16}}><Card title="🏭 Warehouse-wise Pendency" noPad>
      <div style={{overflowX:"auto",padding:"0 20px 20px"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:400}}>
          <thead><tr style={{background:P.light}}>{["Warehouse","Pending Orders","Critical (15+d)","Critical %"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:P.muted,fontWeight:700,fontSize:11,borderBottom:`1px solid ${P.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{whPendency.map((row,i)=><tr key={i} style={{borderBottom:`1px solid ${P.border}`}}>
            <td style={{padding:"8px 12px",fontWeight:600,color:P.text}}>{row.name}</td>
            <td style={{padding:"8px 12px",fontFamily:"monospace"}}>{fmtN(row.value)}</td>
            <td style={{padding:"8px 12px",fontFamily:"monospace",color:P.danger,fontWeight:700}}>{fmtN(row.critical)}</td>
            <td style={{padding:"8px 12px"}}><Badge label={pct(row.critical,row.value||1)} color={row.critical/row.value>0.3?P.danger:P.warning}/></td>
          </tr>)}</tbody>
        </table>
      </div>
    </Card></div>
    <div style={{marginTop:16}}><Card title="📡 Channel-wise Pendency" noPad>
      <div style={{overflowX:"auto",padding:"0 20px 20px"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:400}}>
          <thead><tr style={{background:P.light}}>{["Channel","Pending","Critical","Avg Days"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:P.muted,fontWeight:700,fontSize:11,borderBottom:`1px solid ${P.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{chPendency.map((row,i)=><tr key={i} style={{borderBottom:`1px solid ${P.border}`}}>
            <td style={{padding:"8px 12px",fontWeight:600}}>{row.name}</td>
            <td style={{padding:"8px 12px",fontFamily:"monospace"}}>{fmtN(row.value)}</td>
            <td style={{padding:"8px 12px",fontFamily:"monospace",color:P.danger,fontWeight:700}}>{fmtN(row.critical)}</td>
            <td style={{padding:"8px 12px"}}><Badge label={`${row.avgDays}d`} color={row.avgDays>14?P.danger:row.avgDays>7?P.warning:P.success}/></td>
          </tr>)}</tbody>
        </table>
      </div>
    </Card></div>
  </div>;
};

// ─── PAGE: OPERATIONS ─────────────────────────────────────────────────────────
const Operations = ({d}) => {
  const total=d.length, preorder=d.filter(r=>r.is_pre_order).length, shipTog=d.filter(r=>r.ship_together).length;
  const bom=d.filter(r=>r.Order_Type==="BOM").length, cod=d.filter(r=>r.payment_sources==="COD").length;
  const finData=toArr(grp(d,"finance_exam_category")), ocData=toArr(grp(d,"order_category")).slice(0,7);
  const payData=toArr(grp(d,"payment_sources")), omsData=toArr(grp(d,"OMS"));
  return <div>
    <Divider label="Operational Metrics"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}}>
      <KPI label="Pre-Orders" value={fmtN(preorder)} sub={pct(preorder,total)} icon="⏳" color={P.purple}/>
      <KPI label="Ship Together" value={fmtN(shipTog)} sub={pct(shipTog,total)} icon="📬" color={P.teal}/>
      <KPI label="BOM Orders" value={fmtN(bom)} sub={pct(bom,total)} icon="🧩" color={P.warning}/>
      <KPI label="COD Orders" value={fmtN(cod)} sub={pct(cod,total)} icon="💵" color={P.orange}/>
    </div>
    <Card title="🎓 Finance Category"><ResponsiveContainer width="100%" height={180}><PieChart><Pie data={finData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72}>{finData.map((_,i)=><Cell key={i} fill={COLORS[(i+4)%COLORS.length]}/>)}</Pie><Tooltip formatter={v=>[fmtN(v),"Orders"]} contentStyle={{borderRadius:8}}/><Legend iconType="circle" wrapperStyle={{fontSize:10}}/></PieChart></ResponsiveContainer></Card>
    <div style={{marginTop:16}}><Card title="🛒 Order Category"><div style={{marginTop:8}}>{ocData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[i%COLORS.length]}/>)}</div></Card></div>
    <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Card title="💳 Payment"><div style={{marginTop:4}}>{payData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[(i+2)%COLORS.length]}/>)}</div></Card>
      <Card title="🔀 OMS"><div style={{marginTop:4}}>{omsData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[(i+5)%COLORS.length]}/>)}</div></Card>
    </div>
  </div>;
};

// ─── PAGE: RAW DATA ───────────────────────────────────────────────────────────
const RawData = ({d}) => {
  const [search,setSearch]=useState("");
  const [page,setPage]=useState(0);
  const [sortCol,setSortCol]=useState("order_date");
  const [sortDir,setSortDir]=useState("desc");
  const PER_PAGE=20;
  const cols=[
    {key:"order_date",label:"Date"},{key:"sku_code",label:"SKU"},{key:"product_name",label:"Product"},
    {key:"qty",label:"Qty"},{key:"final_revenue",label:"Revenue"},{key:"Final_Item_Status",label:"Status"},
    {key:"marketplace_cat",label:"Channel"},{key:"parent_name",label:"Category"},
    {key:"Warehouse",label:"Warehouse"},{key:"state",label:"State"},
    {key:"payment_sources",label:"Payment"},{key:"days_pending",label:"Days Pending"},
  ];
  const filtered2=useMemo(()=>{
    let rows=d;
    if(search.trim()) rows=rows.filter(r=>Object.values(r).some(v=>String(v||"").toLowerCase().includes(search.toLowerCase())));
    rows=[...rows].sort((a,b)=>{
      const va=a[sortCol]??"", vb=b[sortCol]??"";
      return sortDir==="asc"?(va<vb?-1:va>vb?1:0):(va>vb?-1:va<vb?1:0);
    });
    return rows;
  },[d,search,sortCol,sortDir]);
  const pageData=filtered2.slice(page*PER_PAGE,(page+1)*PER_PAGE);
  const totalPages=Math.ceil(filtered2.length/PER_PAGE);
  const handleSort=(col)=>{ if(sortCol===col){setSortDir(d=>d==="asc"?"desc":"asc");}else{setSortCol(col);setSortDir("asc");} setPage(0); };
  return <div>
    <Divider label="Raw Data Explorer"/>
    <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
      <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder="🔍 Search any column..." style={{flex:1,minWidth:180,padding:"8px 12px",borderRadius:8,border:`1px solid ${P.border}`,fontSize:12,fontFamily:"inherit",outline:"none"}}/>
      <button onClick={()=>downloadCSV(filtered2)} style={{padding:"8px 16px",borderRadius:8,background:P.success,color:"#fff",border:"none",fontSize:12,cursor:"pointer",fontWeight:700,whiteSpace:"nowrap"}}>⬇ Export CSV ({fmtN(filtered2.length)})</button>
    </div>
    <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${P.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:12,color:P.muted}}>Showing <strong style={{color:P.primary}}>{fmtN(filtered2.length)}</strong> rows</span>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${P.border}`,background:P.card,cursor:page===0?"not-allowed":"pointer",color:page===0?P.muted:P.text,fontSize:12}}>← Prev</button>
          <span style={{fontSize:12,color:P.muted}}>Page {page+1} / {Math.max(1,totalPages)}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${P.border}`,background:P.card,cursor:page>=totalPages-1?"not-allowed":"pointer",color:page>=totalPages-1?P.muted:P.text,fontSize:12}}>Next →</button>
        </div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:700}}>
          <thead><tr style={{background:P.light}}>
            {cols.map(c=><th key={c.key} onClick={()=>handleSort(c.key)} style={{padding:"8px 12px",textAlign:"left",color:P.muted,fontWeight:700,fontSize:10,borderBottom:`1px solid ${P.border}`,whiteSpace:"nowrap",cursor:"pointer",userSelect:"none"}}>
              {c.label} {sortCol===c.key?(sortDir==="asc"?"↑":"↓"):""}
            </th>)}
          </tr></thead>
          <tbody>{pageData.map((row,i)=><tr key={i} style={{borderBottom:`1px solid ${P.border}`,background:i%2===0?"transparent":P.bg}}>
            <td style={{padding:"7px 12px",fontFamily:"monospace",whiteSpace:"nowrap"}}>{row.order_date}</td>
            <td style={{padding:"7px 12px",fontFamily:"monospace",color:P.primary,whiteSpace:"nowrap"}}>{row.sku_code}</td>
            <td style={{padding:"7px 12px",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={row.product_name}>{row.product_name}</td>
            <td style={{padding:"7px 12px",fontFamily:"monospace",textAlign:"center"}}>{row.qty}</td>
            <td style={{padding:"7px 12px",fontFamily:"monospace",color:P.success,fontWeight:700}}>{fmtM(row.final_revenue)}</td>
            <td style={{padding:"7px 12px"}}><Badge label={row.Final_Item_Status} color={STATUS_C[row.Final_Item_Status]||P.muted}/></td>
            <td style={{padding:"7px 12px"}}>{row.marketplace_cat}</td>
            <td style={{padding:"7px 12px",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.parent_name}</td>
            <td style={{padding:"7px 12px"}}>{row.Warehouse}</td>
            <td style={{padding:"7px 12px"}}>{row.state}</td>
            <td style={{padding:"7px 12px"}}>{row.payment_sources}</td>
            <td style={{padding:"7px 12px",fontFamily:"monospace",color:row.days_pending>14?P.danger:row.days_pending>7?P.warning:P.success}}>{row.days_pending>0?`${row.days_pending}d`:"—"}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  </div>;
};

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const STATIC_DATA = generateOrders();

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [page,setPage]=useState("overview");
  const [orders,setOrders]=useState(STATIC_DATA);
  const [lastRefresh,setLastRefresh]=useState(new Date());
  const [nextRefresh,setNextRefresh]=useState(3600);
  const [drillFilter,setDrillFilter]=useState(null);
  const [isMobile,setIsMobile]=useState(false);
  const [filterOpen,setFilterOpen]=useState(false);
  const [filters,setFilters]=useState({
    dateFrom:"2026-01-01",dateTo:"2026-04-30",preset:"",
    marketplace_cat:"all",Warehouse:"all",state:"all",
    payment_sources:"all",OMS:"all",Order_Type:"all",
    purchase_level:"all",Organization:"all",parent_name:"all",
    Final_Item_Status:"all",delivery_partner:"all",
    finance_exam_category:"all",order_category:"all",
  });

  useEffect(()=>{ const check=()=>setIsMobile(window.innerWidth<768); check(); window.addEventListener("resize",check); return()=>window.removeEventListener("resize",check); },[]);

  // Auto refresh every 1 hour
  useEffect(()=>{
    const fetchData=async()=>{
      try {
        // Uncomment when real API ready:
        // const res=await fetch("/api/orders"); const json=await res.json(); setOrders(json.data);
        setOrders(generateOrders());
        setLastRefresh(new Date()); setNextRefresh(3600);
      } catch(err){ console.error("Refresh failed:",err); }
    };
    const countdown=setInterval(()=>{ setNextRefresh(prev=>{ if(prev<=1){fetchData();return 3600;} return prev-1; }); },1000);
    return()=>clearInterval(countdown);
  },[]);

  const filtered=useMemo(()=>{
    return orders.filter(r=>{
      if(filters.dateFrom&&r.order_date<filters.dateFrom) return false;
      if(filters.dateTo&&r.order_date>filters.dateTo) return false;
      const keys=["marketplace_cat","Warehouse","state","payment_sources","OMS","Order_Type","purchase_level","Organization","parent_name","Final_Item_Status","delivery_partner","finance_exam_category","order_category"];
      for(const k of keys){ if(filters[k]&&filters[k]!=="all"&&r[k]!==filters[k]) return false; }
      if(drillFilter&&r[drillFilter.key]!==drillFilter.val) return false;
      return true;
    });
  },[orders,filters,drillFilter]);

  const drill=useCallback((key,val)=>{ setDrillFilter(prev=>(prev?.key===key&&prev?.val===val)?null:{key,val}); },[]);
  const mins=Math.floor(nextRefresh/60), secs=nextRefresh%60;
  const pageProps={d:filtered,drill};

  const renderPage=()=>{
    switch(page){
      case"overview":   return <Overview   {...pageProps}/>;
      case"revenue":    return <Revenue    {...pageProps}/>;
      case"fulfilment": return <Fulfilment {...pageProps}/>;
      case"channel":    return <Channels   {...pageProps}/>;
      case"product":    return <Products   {...pageProps}/>;
      case"sku":        return <SKU        {...pageProps}/>;
      case"geographic": return <Geographic {...pageProps}/>;
      case"pendency":   return <Pendency   {...pageProps}/>;
      case"operations": return <Operations {...pageProps}/>;
      case"rawdata":    return <RawData    {...pageProps}/>;
      default:          return <Overview   {...pageProps}/>;
    }
  };

  // ── MOBILE LAYOUT ──
  if(isMobile){
    return <div style={{display:"flex",flexDirection:"column",height:"100vh",background:P.bg,fontFamily:"'Inter',system-ui,sans-serif",color:P.text}}>
      {/* Mobile top bar */}
      <div style={{background:P.card,borderBottom:`1px solid ${P.border}`,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${P.primary},${P.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>📦</div>
          <div>
            <div style={{fontSize:13,fontWeight:800}}>PW Orders</div>
            <div style={{fontSize:9,color:P.muted}}>{fmtN(filtered.length)} records</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {drillFilter&&<button onClick={()=>setDrillFilter(null)} style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:`${P.primary}12`,border:`1px solid ${P.primary}30`,color:P.primary,cursor:"pointer"}}>🔍 {drillFilter.val} ✕</button>}
          <button onClick={()=>setFilterOpen(true)} style={{background:P.light,border:`1px solid ${P.border}`,borderRadius:8,padding:"6px 10px",fontSize:11,cursor:"pointer",fontWeight:600,color:P.text}}>⚙️ Filter</button>
        </div>
      </div>
      {/* Mobile filter drawer */}
      <FilterPanel orders={orders} filters={filters} onChange={setFilters} isMobile open={filterOpen} onClose={()=>setFilterOpen(false)}/>
      {/* Mobile content */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px",paddingBottom:80}}>{renderPage()}</div>
      {/* Mobile bottom nav */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:P.card,borderTop:`1px solid ${P.border}`,display:"flex",overflowX:"auto",zIndex:100,padding:"4px 0"}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minWidth:60,padding:"6px 4px",border:"none",background:"transparent",cursor:"pointer",color:page===n.id?P.primary:P.muted,fontFamily:"inherit",flexShrink:0}}>
            <span style={{fontSize:18,lineHeight:1}}>{n.icon}</span>
            <span style={{fontSize:9,fontWeight:page===n.id?700:400,marginTop:2,letterSpacing:0.5}}>{n.short}</span>
            {page===n.id&&<div style={{width:20,height:2,background:P.primary,borderRadius:1,marginTop:2}}/>}
          </button>
        ))}
      </div>
      {/* Chatbot */}
      <Chatbot filtered={filtered}/>
    </div>;
  }

  // ── DESKTOP LAYOUT ──
  return <div style={{display:"flex",height:"100vh",overflow:"hidden",background:P.bg,fontFamily:"'Inter',system-ui,sans-serif",color:P.text}}>
    {/* Sidebar */}
    <div style={{width:196,minWidth:196,background:P.card,borderRight:`1px solid ${P.border}`,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"16px 14px",borderBottom:`1px solid ${P.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${P.primary},${P.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📦</div>
          <div><div style={{fontSize:13,fontWeight:800}}>PW Orders</div><div style={{fontSize:10,color:P.muted}}>Intelligence Hub</div></div>
        </div>
      </div>
      <div style={{flex:1,padding:"8px",overflowY:"auto"}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:8,border:"none",cursor:"pointer",marginBottom:1,textAlign:"left",background:page===n.id?`${P.primary}12`:"transparent",color:page===n.id?P.primary:P.muted,fontWeight:page===n.id?700:500,fontSize:12,transition:"all 0.15s",fontFamily:"inherit"}}>
            <span style={{fontSize:15}}>{n.icon}</span><span>{n.label}</span>
            {page===n.id&&<div style={{marginLeft:"auto",width:3,height:14,background:P.primary,borderRadius:2}}/>}
          </button>
        ))}
      </div>
      <div style={{padding:"12px 14px",borderTop:`1px solid ${P.border}`}}>
        <div style={{fontSize:9,color:P.muted,marginBottom:3,fontWeight:600,letterSpacing:1}}>AUTO-REFRESH IN</div>
        <div style={{fontSize:16,fontWeight:800,color:P.primary,fontFamily:"monospace"}}>{String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}</div>
        <div style={{fontSize:9,color:P.muted,marginTop:1}}>Last: {lastRefresh.toLocaleTimeString()}</div>
        <div style={{background:P.light,borderRadius:4,height:3,marginTop:5}}><div style={{background:P.primary,width:`${(nextRefresh/3600)*100}%`,height:3,borderRadius:4,transition:"width 1s linear"}}/></div>
      </div>
    </div>
    {/* Filter panel */}
    <FilterPanel orders={orders} filters={filters} onChange={setFilters} isMobile={false}/>
    {/* Main */}
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{background:P.card,borderBottom:`1px solid ${P.border}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div>
          <div style={{fontSize:16,fontWeight:800}}>{NAV.find(n=>n.id===page)?.icon} {NAV.find(n=>n.id===page)?.label}</div>
          <div style={{fontSize:11,color:P.muted}}>Showing <strong style={{color:P.primary}}>{fmtN(filtered.length)}</strong> of {fmtN(orders.length)} orders · {filters.dateFrom} → {filters.dateTo}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {drillFilter&&<div style={{background:`${P.primary}12`,border:`1px solid ${P.primary}30`,borderRadius:8,padding:"5px 10px",fontSize:11,color:P.primary,display:"flex",alignItems:"center",gap:6}}>
            🔍 {drillFilter.key}: <strong>{drillFilter.val}</strong>
            <span onClick={()=>setDrillFilter(null)} style={{cursor:"pointer",color:P.danger,fontWeight:700}}>✕</span>
          </div>}
          <div style={{background:P.light,borderRadius:8,padding:"5px 12px",fontSize:11,color:P.muted,fontFamily:"monospace"}}>mv_pw_order_master</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"18px 24px"}}>{renderPage()}</div>
    </div>
    {/* Chatbot */}
    <Chatbot filtered={filtered}/>
  </div>;
}