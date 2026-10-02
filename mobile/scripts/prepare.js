const fs=require('fs'),path=require('path');
const role=process.argv[2];
const api=process.env.MIZARI_API_URL||'';
const meta={
 passenger:{appId:'af.mizari.online.passenger',appName:'میزاری آنلاین - مسافر'},
 driver:{appId:'af.mizari.online.driver',appName:'میزاری آنلاین - راننده'},
 admin:{appId:'af.mizari.online.admin',appName:'میزاری آنلاین - مدیریت'}
};
if(!meta[role]) throw new Error('Use passenger, driver or admin');

const root=path.resolve(__dirname,'../..');
const src=path.join(root,'apps',role), out=path.join(root,'mobile','www',role);
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const name of fs.readdirSync(src)){const p=path.join(src,name);if(fs.statSync(p).isFile())fs.copyFileSync(p,path.join(out,name));}
fs.writeFileSync(path.join(out,'config.js'),`window.MIZARI_API=${JSON.stringify(api.replace(/\/$/,''))}; window.MIZARI_ROLE=${JSON.stringify(role)};\n`);
fs.writeFileSync(path.join(root,'mobile','capacitor.config.ts'),`import type { CapacitorConfig } from '@capacitor/cli';\nconst config: CapacitorConfig={appId:${JSON.stringify(meta[role].appId)},appName:${JSON.stringify(meta[role].appName)},webDir:${JSON.stringify('www/'+role)},server:{androidScheme:'https'}};\nexport default config;\n`);
console.log(`Prepared ${role}; API=${api}`);
