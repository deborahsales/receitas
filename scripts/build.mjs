import { cp, mkdir, readdir, stat, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'src');
const output=path.join(root,'dist');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp(source,output,{recursive:true,force:true});
async function size(dir){
 let bytes=0;
 for(const name of await readdir(dir)){
  const p=path.join(dir,name),info=await stat(p);
  bytes+=info.isDirectory()?await size(p):info.size;
 }
 return bytes;
}
console.log(`Site pronto em dist/ (${(await size(output)/1048576).toFixed(1)} MiB).`);
