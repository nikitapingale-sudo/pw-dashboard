"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ComposedChart,
} from "recharts";

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
  const pick = (arr, w) => { const r = Math.random(); let c = 0; for (let j = 0; j < arr.length; j++) { c += w[j]; if (r < c) return arr[j]; } return arr[arr.length-1]; };
  return Array.from({ length: 1200 }, (_, i) => {
    const daysAgo = Math.floor(i / 40);
    const date = new Date(2026, 0, 1 + daysAgo);
    const dateStr = date.toISOString().split("T")[0];
    const month = date.toLocaleString("default", { month: "short" }) + " " + date.getFullYear();
    const week = `W${Math.ceil((daysAgo + 1) / 7)}`;
    const cat = cats[i % cats.length];
    const subCatArr = subCats[cat] || ["General"];
    const subCat = subCatArr[i % subCatArr.length];
    const qty = Math.floor(Math.random() * 8) + 1;
    const mrp = Math.floor(Math.random() * 1350) + 150;
    const disc = Math.random() > 0.7 ? Math.floor(Math.random() * mrp * 0.3) : 0;
    const unitPrice = mrp - disc;
    const revenue = unitPrice * qty;
    const status = pick(statuses, sW);
    const ch = pick(channels, cW);
    return {
      order_date: dateStr, month, week, qty, mrp, unitPrice, discount: disc,
      final_revenue: revenue, Final_Item_Status: status, VCO_line_status: status,
      marketplace_cat: ch, VCO_channel_name: ch, parent_name: cat, sub_cat_name: subCat,
      Warehouse: whs[i % whs.length], VC_source_warehouse: whs[i % whs.length],
      state: states[i % states.length], VCO_ship_state: states[i % states.length],
      payment_sources: pick(pays, pW), OMS: Math.random() > 0.45 ? "VC" : "UW",
      Order_Type: pick(ots, otW), VCO_sku_classification: pick(ots, otW),
      purchase_level: ["3P","STORE_PURCHASE","BATCH_PURCHASE"][i % 3],
      order_category: orderCats[i % orderCats.length],
      Organization: Math.random() > 0.12 ? orgs[0] : orgs[1],
      delivery_partner: partners[i % partners.length],
      finance_exam_category: finCats[i % finCats.length],
      VCO_voucher_amount: disc, VCO_mrp: mrp, VCO_unit_price: unitPrice,
      VCO_order_quantity: qty, is_pre_order: Math.random() > 0.9,
      ship_together: Math.random() > 0.7,
      cancellation_reason: status === "Cancelled" ? ["Customer Request","Fraud","Out of Stock","Price Issue"][i % 4] : null,
    };
  });
};

const fmtN = (n) => new Intl.NumberFormat("en-IN").format(Math.round(n));
const fmtM = (n) => n >= 1e7 ? `₹${(n/1e7).toFixed(2)}Cr` : n >= 1e5 ? `₹${(n/1e5).toFixed(1)}L` : `₹${fmtN(n)}`;
const pct = (n, d) => d === 0 ? "0%" : `${((n/d)*100).toFixed(1)}%`;
const grp = (data, key, val=null) => data.reduce((acc, r) => { const k = r[key]||"Unknown"; acc[k]=(acc[k]||0)+(val?r[val]||0:1); return acc; }, {});
const toArr = (obj, limit=50) => Object.entries(obj).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,limit);
const uniq = (arr, key) => [...new Set(arr.map(r=>r[key]).filter(Boolean))].sort();

const P = {
  primary:"#2563EB", success:"#16A34A", danger:"#DC2626", warning:"#D97706",
  purple:"#7C3AED", teal:"#0891B2", orange:"#EA580C",
  bg:"#F8FAFC", card:"#FFFFFF", border:"#E2E8F0", text:"#0F172A", muted:"#64748B", light:"#F1F5F9",
};
const COLORS = ["#2563EB","#16A34A","#DC2626","#D97706","#7C3AED","#0891B2","#DB2777","#EA580C","#0D9488","#4F46E5"];
const STATUS_C = { Delivered:"#16A34A", Manifested:"#2563EB", Shipped:"#7C3AED", Packed:"#D97706", RTO:"#DC2626", Lost:"#94A3B8", Cancelled:"#EA580C" };
const NAV = [
  { id:"overview",   icon:"📊", label:"Overview"   },
  { id:"revenue",    icon:"💰", label:"Revenue"    },
  { id:"fulfilment", icon:"🚚", label:"Fulfilment" },
  { id:"channel",    icon:"📡", label:"Channels"   },
  { id:"product",    icon:"📚", label:"Products"   },
  { id:"geographic", icon:"🗺️", label:"Geographic" },
  { id:"operations", icon:"⚙️", label:"Operations" },
];

const TT = ({ active, payload, label, money=false }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:8, padding:"10px 14px", boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}>
      <div style={{ color:P.muted, fontSize:11, marginBottom:5, fontWeight:600 }}>{label}</div>
      {payload.map((p,i)=><div key={i} style={{ color:p.color||P.primary, fontSize:12, fontWeight:700 }}>{p.name}: {money?fmtM(p.value):fmtN(p.value)}</div>)}
    </div>
  );
};

const KPI = ({ label, value, sub, delta, color=P.primary, icon, onClick }) => {
  const isPos = delta > 0;
  return (
    <div onClick={onClick}
      style={{ background:P.card, border:`1px solid ${P.border}`, borderRadius:12, padding:"18px 20px", cursor:onClick?"pointer":"default", transition:"all 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", position:"relative", overflow:"hidden" }}
      onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(37,99,235,0.12)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; }}>
      <div style={{ position:"absolute", top:0, right:0, width:56, height:56, borderRadius:"0 12px 0 56px", background:`${color}12` }}/>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <span style={{ fontSize:10, fontWeight:700, color:P.muted, letterSpacing:1, textTransform:"uppercase" }}>{label}</span>
        <span style={{ fontSize:18 }}>{icon}</span>
      </div>
      <div style={{ fontSize:26, fontWeight:800, color:P.text, fontFamily:"monospace", lineHeight:1, marginBottom:6 }}>{value}</div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {delta!==undefined && <span style={{ fontSize:11, fontWeight:700, color:isPos?"#16A34A":"#DC2626", background:isPos?"#F0FDF4":"#FEF2F2", borderRadius:4, padding:"2px 6px" }}>{isPos?"↑":"↓"} {Math.abs(delta)}%</span>}
        {sub && <span style={{ color:P.muted, fontSize:11 }}>{sub}</span>}
      </div>
    </div>
  );
};

const Card = ({ title, children, action, col }) => (
  <div style={{ background:P.card, border:`1px solid ${P.border}`, borderRadius:12, padding:20, gridColumn:col?`span ${col}`:undefined, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
      <div style={{ fontSize:13, fontWeight:700, color:P.text }}>{title}</div>
      {action&&<div style={{ fontSize:11, color:P.primary, cursor:"pointer", fontWeight:600 }}>{action}</div>}
    </div>
    {children}
  </div>
);

const ProgBar = ({ label, value, total, color }) => (
  <div style={{ marginBottom:10 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
      <span style={{ color:P.text, fontSize:12, fontWeight:500 }}>{label}</span>
      <span style={{ color, fontSize:12, fontWeight:700, fontFamily:"monospace" }}>{fmtN(value)} <span style={{color:P.muted,fontWeight:400}}>({pct(value,total)})</span></span>
    </div>
    <div style={{ background:P.light, borderRadius:4, height:6 }}>
      <div style={{ background:color, width:pct(value,total), height:6, borderRadius:4, transition:"width 0.6s ease" }}/>
    </div>
  </div>
);

const Badge = ({ label, color }) => (
  <span style={{ background:`${color}15`, color, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700 }}>{label}</span>
);

const Divider = ({ label }) => (
  <div style={{ color:P.muted, fontSize:10, letterSpacing:2, textTransform:"uppercase", fontWeight:700, marginBottom:14, paddingBottom:8, borderBottom:`1px solid ${P.border}` }}>{label}</div>
);

const FilterPanel = ({ orders, filters, onChange }) => {
  const defs = [
    {key:"marketplace_cat",label:"Channel"},{key:"Warehouse",label:"Warehouse"},
    {key:"state",label:"State"},{key:"payment_sources",label:"Payment"},
    {key:"OMS",label:"OMS"},{key:"Order_Type",label:"Order Type"},
    {key:"purchase_level",label:"Purchase Level"},{key:"Organization",label:"Organization"},
    {key:"parent_name",label:"Category"},{key:"Final_Item_Status",label:"Status"},
    {key:"delivery_partner",label:"Courier"},{key:"finance_exam_category",label:"Finance Cat"},
    {key:"order_category",label:"Order Category"},
  ];
  const sel = { width:"100%", padding:"6px 8px", borderRadius:8, border:`1px solid ${P.border}`, fontSize:12, color:P.text, background:P.card, marginBottom:10, fontFamily:"inherit", cursor:"pointer" };
  const presets = [{label:"7D",days:7},{label:"30D",days:30},{label:"90D",days:90},{label:"YTD",days:120}];
  return (
    <div style={{ width:196, minWidth:196, background:P.card, borderRight:`1px solid ${P.border}`, padding:"18px 14px", overflowY:"auto" }}>
      <div style={{ fontSize:11, fontWeight:800, color:P.text, marginBottom:2, letterSpacing:1 }}>FILTERS</div>
      <div style={{ fontSize:10, color:P.muted, marginBottom:16 }}>All matview fields</div>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, fontWeight:600, color:P.muted, marginBottom:6 }}>Date Range</div>
        <input type="date" value={filters.dateFrom} onChange={e=>onChange({...filters,dateFrom:e.target.value,preset:""})} style={{...sel,marginBottom:6}}/>
        <input type="date" value={filters.dateTo}   onChange={e=>onChange({...filters,dateTo:e.target.value,preset:""})}   style={sel}/>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {presets.map(p=>{
            const to   = new Date(2026,3,30).toISOString().split("T")[0];
            const from = new Date(new Date(2026,3,30)-p.days*864e5).toISOString().split("T")[0];
            const active = filters.preset===p.label;
            return <button key={p.label} onClick={()=>onChange({...filters,dateFrom:from,dateTo:to,preset:p.label})} style={{ fontSize:10, padding:"3px 8px", borderRadius:5, border:`1px solid ${active?P.primary:P.border}`, background:active?P.primary:"transparent", color:active?"#fff":P.muted, cursor:"pointer", fontWeight:600 }}>{p.label}</button>;
          })}
        </div>
      </div>
      {defs.map(({key,label})=>(
        <div key={key} style={{ marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:600, color:P.muted, marginBottom:4 }}>{label}</div>
          <select style={sel} value={filters[key]||"all"} onChange={e=>onChange({...filters,[key]:e.target.value})}>
            <option value="all">All</option>
            {uniq(orders,key).map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}
      <button onClick={()=>onChange({dateFrom:"2026-01-01",dateTo:"2026-04-30",preset:""})} style={{ width:"100%", padding:"8px", borderRadius:8, border:`1px solid ${P.border}`, background:P.light, color:P.muted, fontSize:12, cursor:"pointer", fontWeight:600, marginTop:8 }}>Reset All</button>
    </div>
  );
};

const Overview = ({ d, drill }) => {
  const total=d.length, rev=d.reduce((s,r)=>s+(r.final_revenue||0),0), units=d.reduce((s,r)=>s+(r.qty||0),0), disc=d.reduce((s,r)=>s+(r.discount||0),0);
  const delivered=d.filter(r=>r.Final_Item_Status==="Delivered").length, rto=d.filter(r=>r.Final_Item_Status==="RTO").length;
  const cancelled=d.filter(r=>r.Final_Item_Status==="Cancelled").length, intransit=d.filter(r=>["Shipped","Manifested"].includes(r.Final_Item_Status)).length;
  const packed=d.filter(r=>r.Final_Item_Status==="Packed").length, lost=d.filter(r=>r.Final_Item_Status==="Lost").length;
  const manifested=d.filter(r=>r.Final_Item_Status==="Manifested").length, shipped=d.filter(r=>r.Final_Item_Status==="Shipped").length;
  const dateData=useMemo(()=>{ const byD=grp(d,"order_date"),revD=d.reduce((acc,r)=>{ acc[r.order_date]=(acc[r.order_date]||0)+(r.final_revenue||0); return acc; },{}); return Object.entries(byD).sort(([a],[b])=>a.localeCompare(b)).map(([dt,orders])=>({date:dt.slice(5),orders,revenue:Math.round(revD[dt]||0)})); },[d]);
  const statusData=toArr(grp(d,"Final_Item_Status")), monthData=toArr(grp(d,"month","final_revenue"));
  return (
    <div>
      <Divider label="Core Metrics"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <KPI label="Total Orders"   value={fmtN(total)}  sub="order lines"                          icon="🗂️" color={P.primary} delta={8.2}/>
        <KPI label="Gross Revenue"  value={fmtM(rev)}    sub={`AOV ${fmtM(total?rev/total:0)}`}    icon="💰" color={P.success} delta={12.4}/>
        <KPI label="Units Sold"     value={fmtN(units)}  sub={`${(units/total).toFixed(1)} per order`} icon="📦" color={P.purple} delta={5.1}/>
        <KPI label="Discount Given" value={fmtM(disc)}   sub={`${pct(disc,rev)} rate`}              icon="🏷️" color={P.warning} delta={-2.3}/>
      </div>
      <Divider label="Fulfilment Health"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <KPI label="Delivery Rate"     value={pct(delivered,total)}  sub={`${fmtN(delivered)} delivered`} icon="✅" color={P.success} delta={3.1}/>
        <KPI label="RTO Rate"          value={pct(rto,total)}        sub={`${fmtN(rto)} RTOs`}           icon="🔁" color={P.danger}  delta={-1.2}/>
        <KPI label="Cancellation Rate" value={pct(cancelled,total)}  sub={`${fmtN(cancelled)} cancelled`} icon="❌" color={P.orange}  delta={-0.8}/>
        <KPI label="In Transit"        value={fmtN(intransit)}       sub={pct(intransit,total)}           icon="🚚" color={P.teal}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:16 }}>
        <Card title="📈 Daily Orders & Revenue Trend">
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={dateData}>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
              <XAxis dataKey="date" tick={{fill:P.muted,fontSize:10}} stroke={P.border}/>
              <YAxis yAxisId="l" tick={{fill:P.muted,fontSize:10}} stroke={P.border}/>
              <YAxis yAxisId="r" orientation="right" tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
              <Tooltip content={<TT/>}/><Legend wrapperStyle={{fontSize:11}}/>
              <Bar yAxisId="l" dataKey="orders" name="Orders" fill={`${P.primary}30`} stroke={P.primary} strokeWidth={1} radius={[3,3,0,0]}/>
              <Line yAxisId="r" type="monotone" dataKey="revenue" name="Revenue" stroke={P.success} strokeWidth={2} dot={false}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        <Card title="🔵 Order Status Split">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} onClick={d=>drill("Final_Item_Status",d.name)}>
                {statusData.map((x,i)=><Cell key={i} fill={STATUS_C[x.name]||COLORS[i%COLORS.length]} cursor="pointer"/>)}
              </Pie>
              <Tooltip formatter={v=>[fmtN(v),"Orders"]} contentStyle={{borderRadius:8}}/><Legend iconType="circle" wrapperStyle={{fontSize:10}}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card title="📅 Monthly Revenue">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
              <XAxis dataKey="name" tick={{fill:P.muted,fontSize:10}} stroke={P.border}/>
              <YAxis tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
              <Tooltip content={<TT money/>}/>
              <Bar dataKey="value" name="Revenue" radius={[4,4,0,0]}>{monthData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="🚦 Fulfilment Funnel">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 }}>
            {[["Packed",packed,P.warning],["Shipped",shipped,P.purple],["Manifested",manifested,P.teal],["Delivered",delivered,P.success]].map(([lbl,val,clr])=>(
              <div key={lbl} style={{ background:P.light, borderRadius:10, padding:"12px 8px", textAlign:"center", border:`2px solid ${clr}20`, cursor:"pointer" }} onClick={()=>drill("Final_Item_Status",lbl)}>
                <div style={{ color:clr, fontSize:20, fontWeight:800, fontFamily:"monospace" }}>{fmtN(val)}</div>
                <div style={{ color:P.muted, fontSize:10, marginTop:3 }}>{lbl}</div>
                <div style={{ color:clr, fontSize:10, fontWeight:700 }}>{pct(val,total)}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[["RTO",rto,P.danger],["Cancelled",cancelled,P.orange],["Lost",lost,"#94A3B8"]].map(([lbl,val,clr])=>(
              <div key={lbl} style={{ background:`${clr}10`, borderRadius:8, padding:"8px", textAlign:"center", cursor:"pointer" }} onClick={()=>drill("Final_Item_Status",lbl)}>
                <div style={{ color:clr, fontSize:16, fontWeight:800, fontFamily:"monospace" }}>{fmtN(val)}</div>
                <div style={{ color:P.muted, fontSize:10 }}>{lbl} · {pct(val,total)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const Revenue = ({ d }) => {
  const rev=d.reduce((s,r)=>s+(r.final_revenue||0),0), disc=d.reduce((s,r)=>s+(r.discount||0),0);
  const chRevData=toArr(grp(d,"marketplace_cat","final_revenue"),8), catRevData=toArr(grp(d,"parent_name","final_revenue"),7);
  const payRevData=toArr(grp(d,"payment_sources","final_revenue")), orgRevData=toArr(grp(d,"Organization","final_revenue"));
  const wkData=useMemo(()=>{ const byW=grp(d,"week","final_revenue"); return Object.entries(byW).sort(([a],[b])=>a.localeCompare(b)).map(([w,v])=>({name:w,value:Math.round(v)})); },[d]);
  return (
    <div>
      <Divider label="Revenue Summary"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <KPI label="Gross Revenue"   value={fmtM(rev)}                                                          sub="Total billed"      icon="💰" color={P.success} delta={12.4}/>
        <KPI label="Avg Order Value" value={fmtM(d.length?rev/d.length:0)}                                      sub="per order line"    icon="📊" color={P.primary} delta={3.2}/>
        <KPI label="Avg Unit Price"  value={`₹${fmtN(d.length?d.reduce((s,r)=>s+(r.unitPrice||0),0)/d.length:0)}`} sub="selling price" icon="🏷️" color={P.purple} delta={1.8}/>
        <KPI label="Total Discounts" value={fmtM(disc)}                                                         sub={`${pct(disc,rev+disc)} of gross`} icon="🎁" color={P.warning} delta={-2.1}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <Card title="💰 Revenue by Channel">
          <ResponsiveContainer width="100%" height={220}><BarChart data={chRevData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false}/>
            <XAxis type="number" tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
            <YAxis type="category" dataKey="name" tick={{fill:P.text,fontSize:11}} stroke={P.border} width={90}/>
            <Tooltip content={<TT money/>}/>
            <Bar dataKey="value" name="Revenue" radius={[0,4,4,0]}>{chRevData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar>
          </BarChart></ResponsiveContainer>
        </Card>
        <Card title="📚 Revenue by Category">
          <ResponsiveContainer width="100%" height={220}><BarChart data={catRevData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false}/>
            <XAxis type="number" tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
            <YAxis type="category" dataKey="name" tick={{fill:P.text,fontSize:11}} stroke={P.border} width={120}/>
            <Tooltip content={<TT money/>}/>
            <Bar dataKey="value" name="Revenue" radius={[0,4,4,0]}>{catRevData.map((_,i)=><Cell key={i} fill={COLORS[(i+3)%COLORS.length]}/>)}</Bar>
          </BarChart></ResponsiveContainer>
        </Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
        <Card title="📅 Weekly Revenue">
          <ResponsiveContainer width="100%" height={180}><AreaChart data={wkData}>
            <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={P.success} stopOpacity={0.2}/><stop offset="95%" stopColor={P.success} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
            <XAxis dataKey="name" tick={{fill:P.muted,fontSize:10}} stroke={P.border}/>
            <YAxis tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
            <Tooltip content={<TT money/>}/>
            <Area type="monotone" dataKey="value" name="Revenue" stroke={P.success} fill="url(#rg)" strokeWidth={2} dot={false}/>
          </AreaChart></ResponsiveContainer>
        </Card>
        <Card title="💳 Revenue by Payment"><div style={{marginTop:8}}>{payRevData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={rev} color={COLORS[i]}/>)}</div></Card>
        <Card title="🏢 By Organization">
          <ResponsiveContainer width="100%" height={160}><PieChart>
            <Pie data={orgRevData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={68}>{orgRevData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}</Pie>
            <Tooltip formatter={v=>[fmtM(v),"Revenue"]} contentStyle={{borderRadius:8}}/><Legend iconType="circle" wrapperStyle={{fontSize:11}}/>
          </PieChart></ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

const Fulfilment = ({ d }) => {
  const total=d.length, delivered=d.filter(r=>r.Final_Item_Status==="Delivered").length;
  const rto=d.filter(r=>r.Final_Item_Status==="RTO").length, lost=d.filter(r=>r.Final_Item_Status==="Lost").length;
  const cancelled=d.filter(r=>r.Final_Item_Status==="Cancelled").length;
  const statusData=toArr(grp(d,"Final_Item_Status")), partnerData=toArr(grp(d,"delivery_partner"));
  const whData=toArr(grp(d,"Warehouse")), rtoByChannel=toArr(grp(d.filter(r=>r.Final_Item_Status==="RTO"),"marketplace_cat"));
  const cancelReasons=toArr(grp(d.filter(r=>r.cancellation_reason),"cancellation_reason"));
  return (
    <div>
      <Divider label="Fulfilment Summary"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <KPI label="Delivery Rate"     value={pct(delivered,total)} sub={`${fmtN(delivered)} delivered`} icon="✅" color={P.success} delta={3.1}/>
        <KPI label="RTO Rate"          value={pct(rto,total)}       sub={`${fmtN(rto)} RTOs`}           icon="🔁" color={P.danger}  delta={-1.2}/>
        <KPI label="Lost Rate"         value={pct(lost,total)}      sub={`${fmtN(lost)} lost`}           icon="🚨" color={P.muted}/>
        <KPI label="Cancellation Rate" value={pct(cancelled,total)} sub="of all orders"                  icon="❌" color={P.orange}  delta={-0.8}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <Card title="📦 Status Breakdown"><div style={{marginTop:8}}>{statusData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={STATUS_C[x.name]||COLORS[i]}/>)}</div></Card>
        <Card title="🚚 Courier Performance"><div style={{marginTop:8}}>{partnerData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[i]}/>)}</div></Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
        <Card title="🏭 Warehouse Dispatch">
          <ResponsiveContainer width="100%" height={180}><PieChart>
            <Pie data={whData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={68}>{whData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie>
            <Tooltip formatter={v=>[fmtN(v),"Orders"]} contentStyle={{borderRadius:8}}/><Legend iconType="circle" wrapperStyle={{fontSize:10}}/>
          </PieChart></ResponsiveContainer>
        </Card>
        <Card title="🔁 RTO by Channel"><div style={{marginTop:8}}>{rtoByChannel.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={rto||1} color={COLORS[(i+2)%COLORS.length]}/>)}</div></Card>
        <Card title="❌ Cancellation Reasons">
          {cancelReasons.length ? <div style={{marginTop:8}}>{cancelReasons.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={cancelled||1} color={COLORS[(i+4)%COLORS.length]}/>)}</div>
          : <div style={{color:P.muted,fontSize:12,textAlign:"center",paddingTop:20}}>No cancellations in current filter</div>}
        </Card>
      </div>
    </div>
  );
};

const Channels = ({ d, drill }) => {
  const [selected, setSelected] = useState(null);
  const total=d.length, chData=toArr(grp(d,"marketplace_cat")), chRevData=toArr(grp(d,"marketplace_cat","final_revenue"));
  const chMatrix=useMemo(()=>chData.map(ch=>{ const sub=d.filter(r=>r.marketplace_cat===ch.name), del=sub.filter(r=>r.Final_Item_Status==="Delivered").length, rto=sub.filter(r=>r.Final_Item_Status==="RTO").length, rev=sub.reduce((s,r)=>s+(r.final_revenue||0),0); return {name:ch.name,orders:sub.length,delivered:del,rto,revenue:rev,deliveryRate:sub.length?((del/sub.length)*100).toFixed(1):0,rtoRate:sub.length?((rto/sub.length)*100).toFixed(1):0}; }),[d,chData]);
  const drillData=selected?toArr(grp(d.filter(r=>r.marketplace_cat===selected),"sub_cat_name","final_revenue"),10):[];
  return (
    <div>
      <Divider label="Channel Analytics"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <Card title="📡 Orders by Channel — click bar to drill down">
          <ResponsiveContainer width="100%" height={200}><BarChart data={chData} onClick={e=>e&&setSelected(e.activeLabel)}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
            <XAxis dataKey="name" tick={{fill:P.muted,fontSize:10}} stroke={P.border}/>
            <YAxis tick={{fill:P.muted,fontSize:10}} stroke={P.border}/>
            <Tooltip content={<TT/>}/>
            <Bar dataKey="value" name="Orders" radius={[4,4,0,0]} cursor="pointer">{chData.map((x,i)=><Cell key={i} fill={selected===x.name?P.primary:COLORS[i%COLORS.length]}/>)}</Bar>
          </BarChart></ResponsiveContainer>
          <div style={{color:P.muted,fontSize:11,textAlign:"center",marginTop:6}}>Click any bar to drill into sub-categories ↓</div>
        </Card>
        <Card title="💰 Revenue by Channel">
          <ResponsiveContainer width="100%" height={200}><BarChart data={chRevData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false}/>
            <XAxis type="number" tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
            <YAxis type="category" dataKey="name" tick={{fill:P.text,fontSize:11}} stroke={P.border} width={90}/>
            <Tooltip content={<TT money/>}/>
            <Bar dataKey="value" name="Revenue" radius={[0,4,4,0]}>{chRevData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar>
          </BarChart></ResponsiveContainer>
        </Card>
      </div>
      {selected && (
        <Card title={`🔍 Drill Down: ${selected} — Revenue by Sub-Category`} action={<span onClick={()=>setSelected(null)} style={{cursor:"pointer",color:P.danger}}>✕ Close</span>}>
          <ResponsiveContainer width="100%" height={180}><BarChart data={drillData}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
            <XAxis dataKey="name" tick={{fill:P.muted,fontSize:10}} stroke={P.border} angle={-15} textAnchor="end" height={50}/>
            <YAxis tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
            <Tooltip content={<TT money/>}/>
            <Bar dataKey="value" name="Revenue" fill={P.primary} radius={[4,4,0,0]}/>
          </BarChart></ResponsiveContainer>
        </Card>
      )}
      <Card title="📊 Channel Performance Matrix">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:P.light}}>
              {["Channel","Orders","Revenue","Avg Order Value","Delivered","RTO","Delivery Rate","RTO Rate"].map(h=>(
                <th key={h} style={{padding:"10px 14px",textAlign:"left",color:P.muted,fontWeight:700,fontSize:11,borderBottom:`1px solid ${P.border}`}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{chMatrix.map((row,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${P.border}`,cursor:"pointer",background:selected===row.name?`${P.primary}08`:"transparent"}} onClick={()=>setSelected(selected===row.name?null:row.name)}>
                <td style={{padding:"10px 14px",fontWeight:600,color:P.text}}>{row.name}</td>
                <td style={{padding:"10px 14px",fontFamily:"monospace"}}>{fmtN(row.orders)}</td>
                <td style={{padding:"10px 14px",fontFamily:"monospace",color:P.success,fontWeight:700}}>{fmtM(row.revenue)}</td>
                <td style={{padding:"10px 14px",fontFamily:"monospace"}}>{fmtM(row.orders?row.revenue/row.orders:0)}</td>
                <td style={{padding:"10px 14px",fontFamily:"monospace",color:P.success}}>{fmtN(row.delivered)}</td>
                <td style={{padding:"10px 14px",fontFamily:"monospace",color:P.danger}}>{fmtN(row.rto)}</td>
                <td style={{padding:"10px 14px"}}><Badge label={`${row.deliveryRate}%`} color={row.deliveryRate>50?P.success:P.warning}/></td>
                <td style={{padding:"10px 14px"}}><Badge label={`${row.rtoRate}%`} color={row.rtoRate>10?P.danger:P.success}/></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const Products = ({ d }) => {
  const [selected, setSelected] = useState(null);
  const total=d.length, catData=toArr(grp(d,"parent_name")), catRevData=toArr(grp(d,"parent_name","final_revenue"));
  const subCatData=selected?toArr(grp(d.filter(r=>r.parent_name===selected),"sub_cat_name","final_revenue"),10):[];
  const omsData=toArr(grp(d,"OMS")), otData=toArr(grp(d,"Order_Type")), plData=toArr(grp(d,"purchase_level"));
  return (
    <div>
      <Divider label="Product Analytics"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <Card title="📚 Orders by Category — click to drill down">
          <ResponsiveContainer width="100%" height={210}><BarChart data={catData} onClick={e=>e&&setSelected(e.activeLabel)}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
            <XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} stroke={P.border} angle={-15} textAnchor="end" height={55}/>
            <YAxis tick={{fill:P.muted,fontSize:10}} stroke={P.border}/>
            <Tooltip content={<TT/>}/>
            <Bar dataKey="value" name="Orders" radius={[4,4,0,0]} cursor="pointer">{catData.map((x,i)=><Cell key={i} fill={selected===x.name?P.primary:COLORS[i%COLORS.length]}/>)}</Bar>
          </BarChart></ResponsiveContainer>
          <div style={{color:P.muted,fontSize:11,textAlign:"center",marginTop:4}}>Click any bar to drill into sub-categories ↓</div>
        </Card>
        <Card title="💰 Revenue by Category">
          <ResponsiveContainer width="100%" height={210}><BarChart data={catRevData}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
            <XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} stroke={P.border} angle={-15} textAnchor="end" height={55}/>
            <YAxis tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
            <Tooltip content={<TT money/>}/>
            <Bar dataKey="value" name="Revenue" radius={[4,4,0,0]}>{catRevData.map((_,i)=><Cell key={i} fill={COLORS[(i+2)%COLORS.length]}/>)}</Bar>
          </BarChart></ResponsiveContainer>
        </Card>
      </div>
      {selected && (
        <Card title={`🔍 Drill Down: ${selected} — Sub Categories`} action={<span onClick={()=>setSelected(null)} style={{cursor:"pointer",color:P.danger}}>✕ Close</span>}>
          <ResponsiveContainer width="100%" height={160}><BarChart data={subCatData}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
            <XAxis dataKey="name" tick={{fill:P.muted,fontSize:10}} stroke={P.border}/>
            <YAxis tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
            <Tooltip content={<TT money/>}/>
            <Bar dataKey="value" name="Revenue" fill={P.purple} radius={[4,4,0,0]}/>
          </BarChart></ResponsiveContainer>
        </Card>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
        <Card title="🔀 OMS Split">      <div style={{marginTop:8}}>{omsData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[i]}/>)}</div></Card>
        <Card title="📦 Order Type">     <div style={{marginTop:8}}>{otData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[(i+3)%COLORS.length]}/>)}</div></Card>
        <Card title="🛒 Purchase Level"> <div style={{marginTop:8}}>{plData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[(i+5)%COLORS.length]}/>)}</div></Card>
      </div>
    </div>
  );
};

const Geographic = ({ d }) => {
  const stRevData=toArr(grp(d,"state","final_revenue"),10), stOrdData=toArr(grp(d,"state"),10);
  const stMatrix=useMemo(()=>toArr(grp(d,"state")).map(s=>{ const sub=d.filter(r=>r.state===s.name),del=sub.filter(r=>r.Final_Item_Status==="Delivered").length,rto=sub.filter(r=>r.Final_Item_Status==="RTO").length,rev=sub.reduce((a,r)=>a+(r.final_revenue||0),0); return {name:s.name,orders:sub.length,delivered:del,rto,revenue:rev,delRate:sub.length?((del/sub.length)*100).toFixed(1):0}; }).sort((a,b)=>b.orders-a.orders).slice(0,10),[d]);
  return (
    <div>
      <Divider label="Geographic Analytics"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <Card title="🌏 Revenue by State (Top 10)">
          <ResponsiveContainer width="100%" height={260}><BarChart data={stRevData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false}/>
            <XAxis type="number" tick={{fill:P.muted,fontSize:10}} stroke={P.border} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
            <YAxis type="category" dataKey="name" tick={{fill:P.text,fontSize:11}} stroke={P.border} width={120}/>
            <Tooltip content={<TT money/>}/>
            <Bar dataKey="value" name="Revenue" radius={[0,4,4,0]}>{stRevData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar>
          </BarChart></ResponsiveContainer>
        </Card>
        <Card title="📦 Orders by State (Top 10)">
          <ResponsiveContainer width="100%" height={260}><BarChart data={stOrdData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false}/>
            <XAxis type="number" tick={{fill:P.muted,fontSize:10}} stroke={P.border}/>
            <YAxis type="category" dataKey="name" tick={{fill:P.text,fontSize:11}} stroke={P.border} width={120}/>
            <Tooltip content={<TT/>}/>
            <Bar dataKey="value" name="Orders" fill={P.teal} radius={[0,4,4,0]}/>
          </BarChart></ResponsiveContainer>
        </Card>
      </div>
      <Card title="📊 State Performance Matrix">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:P.light}}>
              {["State","Orders","Revenue","Avg Order Value","Delivered","RTO","Delivery Rate"].map(h=>(
                <th key={h} style={{padding:"10px 14px",textAlign:"left",color:P.muted,fontWeight:700,fontSize:11,borderBottom:`1px solid ${P.border}`}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{stMatrix.map((row,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${P.border}`}}>
                <td style={{padding:"10px 14px",fontWeight:600}}>{row.name}</td>
                <td style={{padding:"10px 14px",fontFamily:"monospace"}}>{fmtN(row.orders)}</td>
                <td style={{padding:"10px 14px",fontFamily:"monospace",color:P.success,fontWeight:700}}>{fmtM(row.revenue)}</td>
                <td style={{padding:"10px 14px",fontFamily:"monospace"}}>{fmtM(row.orders?row.revenue/row.orders:0)}</td>
                <td style={{padding:"10px 14px",fontFamily:"monospace",color:P.success}}>{fmtN(row.delivered)}</td>
                <td style={{padding:"10px 14px",fontFamily:"monospace",color:P.danger}}>{fmtN(row.rto)}</td>
                <td style={{padding:"10px 14px"}}><Badge label={`${row.delRate}%`} color={row.delRate>50?P.success:P.warning}/></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const Operations = ({ d }) => {
  const total=d.length, preorder=d.filter(r=>r.is_pre_order).length, shipTog=d.filter(r=>r.ship_together).length;
  const bom=d.filter(r=>r.Order_Type==="BOM").length, cod=d.filter(r=>r.payment_sources==="COD").length;
  const whData=toArr(grp(d,"Warehouse")), finData=toArr(grp(d,"finance_exam_category"));
  const ocData=toArr(grp(d,"order_category")).slice(0,7), payData=toArr(grp(d,"payment_sources")), omsData=toArr(grp(d,"OMS"));
  return (
    <div>
      <Divider label="Operational Metrics"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <KPI label="Pre-Orders"    value={fmtN(preorder)} sub={pct(preorder,total)} icon="⏳" color={P.purple}/>
        <KPI label="Ship Together" value={fmtN(shipTog)}  sub={pct(shipTog,total)}  icon="📬" color={P.teal}/>
        <KPI label="BOM Orders"    value={fmtN(bom)}      sub={pct(bom,total)}      icon="🧩" color={P.warning}/>
        <KPI label="COD Orders"    value={fmtN(cod)}      sub={pct(cod,total)}      icon="💵" color={P.orange}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <Card title="🏭 Warehouse Distribution">
          <ResponsiveContainer width="100%" height={200}><PieChart>
            <Pie data={whData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>{whData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie>
            <Tooltip formatter={v=>[fmtN(v),"Orders"]} contentStyle={{borderRadius:8}}/><Legend iconType="circle" wrapperStyle={{fontSize:11}}/>
          </PieChart></ResponsiveContainer>
        </Card>
        <Card title="🎓 Finance Exam Category">
          <ResponsiveContainer width="100%" height={200}><PieChart>
            <Pie data={finData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>{finData.map((_,i)=><Cell key={i} fill={COLORS[(i+4)%COLORS.length]}/>)}</Pie>
            <Tooltip formatter={v=>[fmtN(v),"Orders"]} contentStyle={{borderRadius:8}}/><Legend iconType="circle" wrapperStyle={{fontSize:11}}/>
          </PieChart></ResponsiveContainer>
        </Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
        <Card title="🛒 Order Category Mix"><div style={{marginTop:8}}>{ocData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[i%COLORS.length]}/>)}</div></Card>
        <Card title="💳 Payment Mode">      <div style={{marginTop:8}}>{payData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[(i+2)%COLORS.length]}/>)}</div></Card>
        <Card title="🔀 OMS Platform">      <div style={{marginTop:8}}>{omsData.map((x,i)=><ProgBar key={i} label={x.name} value={x.value} total={total} color={COLORS[(i+5)%COLORS.length]}/>)}</div></Card>
      </div>
    </div>
  );
};

// ── Static data loaded once on app start ──────────────────────────────────────
const STATIC_DATA = generateOrders();

export default function Dashboard() {
  const [page, setPage]               = useState("overview");
  const [orders, setOrders]           = useState(STATIC_DATA);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [nextRefresh, setNextRefresh] = useState(3600);
  const [drillFilter, setDrillFilter] = useState(null);
  const [filters, setFilters]         = useState({
    dateFrom:"2026-01-01", dateTo:"2026-04-30", preset:"",
    marketplace_cat:"all", Warehouse:"all", state:"all",
    payment_sources:"all", OMS:"all", Order_Type:"all",
    purchase_level:"all", Organization:"all", parent_name:"all",
    Final_Item_Status:"all", delivery_partner:"all",
    finance_exam_category:"all", order_category:"all",
  });

  // ── AUTO-REFRESH EVERY 1 HOUR ─────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        // When real DB is ready, replace the line below with:
        // const res = await fetch("/api/orders");
        // const json = await res.json();
        // setOrders(json.data);
        setOrders(generateOrders()); // ← remove this when real DB connected
        setLastRefresh(new Date());
        setNextRefresh(3600);
      } catch (err) {
        console.error("Refresh failed:", err);
      }
    };
    const countdown = setInterval(() => {
      setNextRefresh(prev => {
        if (prev <= 1) { fetchData(); return 3600; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // ── APPLY ALL FILTERS ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return orders.filter(r => {
      if (filters.dateFrom && r.order_date < filters.dateFrom) return false;
      if (filters.dateTo   && r.order_date > filters.dateTo)   return false;
      const keys = ["marketplace_cat","Warehouse","state","payment_sources","OMS","Order_Type","purchase_level","Organization","parent_name","Final_Item_Status","delivery_partner","finance_exam_category","order_category"];
      for (const k of keys) { if (filters[k] && filters[k] !== "all" && r[k] !== filters[k]) return false; }
      if (drillFilter && r[drillFilter.key] !== drillFilter.val) return false;
      return true;
    });
  }, [orders, filters, drillFilter]);

  const drill = useCallback((key, val) => {
    setDrillFilter(prev => (prev?.key===key && prev?.val===val) ? null : { key, val });
  }, []);

  const mins = Math.floor(nextRefresh / 60);
  const secs = nextRefresh % 60;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:P.bg, fontFamily:"'Inter',system-ui,sans-serif", color:P.text }}>

      {/* SIDEBAR */}
      <div style={{ width:200, minWidth:200, background:P.card, borderRight:`1px solid ${P.border}`, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"18px 16px", borderBottom:`1px solid ${P.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${P.primary},${P.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📦</div>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:P.text }}>PW Orders</div>
              <div style={{ fontSize:10, color:P.muted }}>Intelligence Hub</div>
            </div>
          </div>
        </div>
        <div style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, border:"none", cursor:"pointer", marginBottom:2, textAlign:"left", background:page===n.id?`${P.primary}12`:"transparent", color:page===n.id?P.primary:P.muted, fontWeight:page===n.id?700:500, fontSize:13, transition:"all 0.15s" }}>
              <span style={{fontSize:16}}>{n.icon}</span>
              <span>{n.label}</span>
              {page===n.id&&<div style={{marginLeft:"auto",width:3,height:16,background:P.primary,borderRadius:2}}/>}
            </button>
          ))}
        </div>
        <div style={{ padding:"14px 16px", borderTop:`1px solid ${P.border}` }}>
          <div style={{ fontSize:10, color:P.muted, marginBottom:4, fontWeight:600, letterSpacing:1 }}>AUTO-REFRESH IN</div>
          <div style={{ fontSize:18, fontWeight:800, color:P.primary, fontFamily:"monospace" }}>{String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}</div>
          <div style={{ fontSize:10, color:P.muted, marginTop:2 }}>Last: {lastRefresh.toLocaleTimeString()}</div>
          <div style={{ background:P.light, borderRadius:4, height:3, marginTop:6 }}>
            <div style={{ background:P.primary, width:`${(nextRefresh/3600)*100}%`, height:3, borderRadius:4, transition:"width 1s linear" }}/>
          </div>
        </div>
      </div>

      {/* FILTER PANEL */}
      <FilterPanel orders={orders} filters={filters} onChange={setFilters}/>

      {/* MAIN CONTENT */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ background:P.card, borderBottom:`1px solid ${P.border}`, padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:17, fontWeight:800, color:P.text }}>{NAV.find(n=>n.id===page)?.icon} {NAV.find(n=>n.id===page)?.label}</div>
            <div style={{ fontSize:11, color:P.muted }}>Showing <strong style={{color:P.primary}}>{fmtN(filtered.length)}</strong> of {fmtN(orders.length)} orders · {filters.dateFrom} → {filters.dateTo}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {drillFilter&&(
              <div style={{ background:`${P.primary}12`, border:`1px solid ${P.primary}30`, borderRadius:8, padding:"6px 12px", fontSize:12, color:P.primary, display:"flex", alignItems:"center", gap:8 }}>
                🔍 {drillFilter.key}: <strong>{drillFilter.val}</strong>
                <span onClick={()=>setDrillFilter(null)} style={{cursor:"pointer",color:P.danger,fontWeight:700}}>✕</span>
              </div>
            )}
            <div style={{ background:P.light, borderRadius:8, padding:"6px 14px", fontSize:11, color:P.muted, fontFamily:"monospace" }}>mv_pw_order_master</div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          {page==="overview"   && <Overview   d={filtered} drill={drill}/>}
          {page==="revenue"    && <Revenue    d={filtered}/>}
          {page==="fulfilment" && <Fulfilment d={filtered}/>}
          {page==="channel"    && <Channels   d={filtered} drill={drill}/>}
          {page==="product"    && <Products   d={filtered}/>}
          {page==="geographic" && <Geographic d={filtered}/>}
          {page==="operations" && <Operations d={filtered}/>}
        </div>
      </div>
    </div>
  );
}