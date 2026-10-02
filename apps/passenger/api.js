const DEMO_KEY='mizari_demo_state_v1';
function demoState(){try{return JSON.parse(localStorage.getItem(DEMO_KEY)||'null')||{users:0,rides:[],nextRide:1,driver:{online:false,verified:true},complaints:[],earnings:0}}catch{return {users:0,rides:[],nextRide:1,driver:{online:false,verified:true},complaints:[],earnings:0}}}
function saveDemo(s){localStorage.setItem(DEMO_KEY,JSON.stringify(s));}
function demoUser(){const role=window.MIZARI_ROLE||'passenger'; return {id:1,role,phone:localStorage.getItem('mizari_demo_phone')||'0700000000',name:role==='admin'?'مدیر میزاری':role==='driver'?'راننده آزمایشی':'مسافر آزمایشی'};}
async function demoCall(path,opt={}){
 const s=demoState(), method=(opt.method||'GET').toUpperCase(), body=opt.body?JSON.parse(opt.body):{};
 if(path==='/me') return {user:demoUser()};
 if(path==='/rides' && method==='GET') return {rides:s.rides};
 if(path==='/rides' && method==='POST'){const d={id:s.nextRide++,origin_text:body.originText||'مبدا آزمایشی',destination_text:body.destinationText||'مقصد آزمایشی',distance_km:Number(body.distanceKm||5),duration_min:Number(body.durationMin||15),fare:Math.round(50+Number(body.distanceKm||5)*20),payment_method:body.paymentMethod||'cash',status:'searching',created_at:new Date().toISOString()};s.rides.unshift(d);saveDemo(s);return {ride:d};}
 const rm=path.match(/^\/rides\/(\d+)$/); if(rm&&method==='GET'){const r=s.rides.find(x=>x.id==rm[1]);return {ride:r||null};}
 const acc=path.match(/^\/rides\/(\d+)\/accept$/); if(acc&&method==='POST'){const r=s.rides.find(x=>x.id==acc[1]);if(!r)throw Error('سفر پیدا نشد');r.status='driver_assigned';saveDemo(s);return {ride:r};}
 const st=path.match(/^\/rides\/(\d+)\/status$/); if(st&&method==='POST'){const r=s.rides.find(x=>x.id==st[1]);if(!r)throw Error('سفر پیدا نشد');r.status=body.status||r.status;if(r.status==='completed')s.earnings+=r.fare;saveDemo(s);return {ride:r};}
 if(path==='/drivers/status'&&method==='POST'){s.driver.online=!!body.online;saveDemo(s);return {driver:s.driver};}
 if(path==='/drivers/earnings')return {earnings:s.earnings};
 if(path==='/admin/stats')return {users:1,drivers:1,onlineDrivers:s.driver.online?1:0,rides:s.rides.length,activeRides:s.rides.filter(r=>r.status!=='completed').length,complaints:s.complaints.length};
 if(path==='/admin/drivers')return {drivers:[{id:1,phone:'0700000000',vehicle_model:'Toyota Corolla',plate:'DEMO-001',verified:true}]};
 if(path==='/admin/complaints')return {complaints:s.complaints};
 const vr=path.match(/^\/drivers\/verify\/\d+$/); if(vr&&method==='POST')return {ok:true};
 if(path==='/complaints'&&method==='POST'){s.complaints.unshift({id:s.complaints.length+1,category:body.category||'support',message:body.message||''});saveDemo(s);return {ok:true};}
 return {};
}
const API={
 token:()=>localStorage.getItem('mizari_token'),
 async call(path,opt={}){if(!window.MIZARI_API)return demoCall(path,opt);let h={'Content-Type':'application/json',...(opt.headers||{})};if(this.token())h.Authorization='Bearer '+this.token();let r=await fetch(window.MIZARI_API+path,{...opt,headers:h}),d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'خطای سرور');return d},
 async otp(p){if(!window.MIZARI_API){localStorage.setItem('mizari_demo_phone',p);return {demoCode:'123456'}}return this.call('/auth/request-otp',{method:'POST',body:JSON.stringify({phone:p})})},
 async verify(p,c){if(!window.MIZARI_API){if(c!=='123456')throw Error('کد آزمایشی: 123456');localStorage.setItem('mizari_demo_phone',p);localStorage.setItem('mizari_token','demo-token');return {token:'demo-token',user:demoUser()}}return this.call('/auth/verify-otp',{method:'POST',body:JSON.stringify({phone:p,code:c})})},
 me:()=>API.call('/me'),rides:()=>API.call('/rides')
};
