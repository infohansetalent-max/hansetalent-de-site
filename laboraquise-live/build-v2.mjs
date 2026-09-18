import AdmZip from 'adm-zip';
import {readFile,writeFile,cp,mkdir,rm} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=process.cwd(),tmp=resolve(root,'.bundle'),overlay=resolve(root,'.changes');
const raw='https://raw.githubusercontent.com/infohansetalent-max/hansetalent-de-site/';
async function text(u){const r=await fetch(u,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('Source unavailable '+r.status);return (await r.text()).trim();}
const b64=(await Promise.all(Array.from({length:7},(_,i)=>text(raw+'d196bd241cc0e64bf174139186a26c0344de9402/sales-live-preview/chunk0'+i+'.b64')))).join('');
const zipped=Buffer.from(b64,'base64');
if(createHash('sha256').update(zipped).digest('hex')!=='379670dd682f6f47ccd69f6db60714dad8d288ec5d23167b19a4cc28c600ec99')throw Error('Original source checksum mismatch');
await rm(tmp,{recursive:true,force:true});await mkdir(tmp,{recursive:true});new AdmZip(zipped).extractAllTo(tmp,true);
const names=['overlay-0.b64','overlay-1.b64',...Array.from({length:11},(_,i)=>'fragment-'+String(i+8).padStart(2,'0')+'.b64')];
const encoded=(await Promise.all(names.map(n=>text(raw+'716e2641e9b3e388902a6dc4f82c926e6d49510f/laboraquise-live/'+n)))).join('');
if(createHash('sha256').update(encoded).digest('hex')!=='a22eb73e23a35fabb0b20f3a4109c3a01ca05909d95bbbc28f8051b61fe33fde')throw Error('Design checksum mismatch');
const patches=JSON.parse(gunzipSync(Buffer.from(encoded,'base64')).toString());
for(const [name,data]of Object.entries(patches)){if(name.includes('..'))throw Error('Invalid path');const p=join(overlay,name);await mkdir(dirname(p),{recursive:true});await writeFile(p,data);}
const src=join(tmp,'hansetalent-live');execFileSync(process.execPath,[join(overlay,'rebrand.mjs')],{cwd:src,stdio:'inherit'});
await rm('public',{recursive:true,force:true});await cp(join(src,'public'),'public',{recursive:true});await cp(join(overlay,'public'),'public',{recursive:true});await cp(join(src,'content'),'content',{recursive:true});await mkdir('server',{recursive:true});await cp(join(src,'server/config.mjs'),'server/config.mjs');await cp(join(overlay,'api/rpc.js'),'server/vercel-rpc.mjs');await cp(join(overlay,'api/verify.js'),'server/vercel-verify.mjs');
let lib=await readFile('public/app/lib.js','utf8');if(!lib.includes('await fetch(path,'))throw Error('Transport patch failed');lib=lib.replace('await fetch(path,',"await fetch('/api/rpc?p='+encodeURIComponent(path),");await writeFile('public/app/lib.js',lib);await cp(join(overlay,'vercel-sync.js'),'public/app/sync.js');
const assets=JSON.parse(await readFile('assets.json','utf8'));await mkdir('public/media',{recursive:true});
const blobHash=b=>createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
async function bytes(u){const r=await fetch(u,{signal:AbortSignal.timeout(20000)});if(!r.ok)return null;return Buffer.from(await r.arrayBuffer());}
let fontUrls;
async function portalFonts(){if(fontUrls)return fontUrls;const origin='https://portal.lokalejobsuche.de',html=await text(origin);const links=[...html.matchAll(/href="([^"]+\.css(?:\?[^"]*)?)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),origin).href);const css=await Promise.all([...new Set(links)].slice(0,10).map(text));fontUrls=[...new Set(css.flatMap((s,i)=>[...s.matchAll(/url\(["']?([^\)"']+\.woff2)["']?\)/g)].map(m=>new URL(m[1],links[i]).href)))].slice(0,20);return fontUrls;}
for(const item of assets){let b=await bytes(item.url);if(!b||blobHash(b)!==item.sha){console.log('Trying public portal asset:',item.name);const urls=item.name.endsWith('.png')?['https://portal.lokalejobsuche.de/laboraquise-logo.png']:await portalFonts();for(const u of urls){const q=await bytes(u);if(q&&blobHash(q)===item.sha){b=q;break;}}}if(!b||blobHash(b)!==item.sha)throw Error('Original branding asset unavailable: '+item.name);await writeFile('public/media/'+item.name,b);console.log('Verified original portal asset:',item.name,b.length,'bytes');}
await rm(tmp,{recursive:true,force:true});await rm(overlay,{recursive:true,force:true});console.log('laboraquise.de Portal Design 2.0 built.');