import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
export function validateAcademies(rows) {
  if (!Array.isArray(rows) || rows.length===0 || rows.length>20000) throw new Error('Expected 1–20000 academy records');
  const ids=new Set(), locations=new Set(), instructorIds=new Set();
  const fail=(id,message)=>{throw new Error(`${id}: ${message}`)};
  const url=(s)=>{try { return ['https:','http:'].includes(new URL(s).protocol); } catch {return false;}};
  for(const a of rows) {
    if(!a || typeof a!=='object') throw new Error('Invalid academy');
    for(const k of ['id','name','city','state','county','initials','color','description','website','checked']) if(typeof a[k]!=='string'||!a[k].trim()) fail(a.id,`Missing ${k}`);
    if(!/^[a-z0-9-]+$/.test(a.id)||ids.has(a.id)) fail(a.id,'Invalid or duplicate ID'); ids.add(a.id);
    const location=[a.name,a.city,a.state].map(s=>s.trim().toLowerCase()).join('|');
    if(locations.has(location)) fail(a.id,'Duplicate name and city'); locations.add(location);
    if(a.state!=='CA'||!['Los Angeles','Orange','Riverside','San Bernardino','San Diego'].includes(a.county)) fail(a.id,'Outside supported Southern California scope');
    for(const k of ['zip','address']) if(a[k]!==null&&typeof a[k]!=='string') fail(a.id,`Invalid ${k}`);
    if(!/^#[0-9a-f]{6}$/i.test(a.color)) fail(a.id,'Invalid display color');
    if(a.space!==null&&(!Number.isFinite(a.space)||a.space<=0)) fail(a.id,'Invalid mat space');
    if(!url(a.website)||!Array.isArray(a.sources)||!a.sources.length||!a.sources.every(url)) fail(a.id,'Invalid source URLs');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(a.checked)||!Number.isFinite(Date.parse(a.checked))) fail(a.id,'Invalid verification date');
    if(!Array.isArray(a.programs)||!a.programs.every(p=>typeof p==='string'&&p.length>0)) fail(a.id,'Invalid programs');
    if(!Array.isArray(a.instructors)) fail(a.id,'Invalid instructors');
    for(const i of a.instructors){
      for(const k of ['id','name','role','focus']) if(typeof i[k]!=='string'||!i[k].trim()) fail(a.id,`Invalid instructor ${k}`);
      if(!/^[a-z0-9-]+$/.test(i.id)||instructorIds.has(i.id)||ids.has(i.id)) fail(a.id,'Duplicate or invalid instructor ID');
      instructorIds.add(i.id);
      if(i.belt!==null&&typeof i.belt!=='string') fail(a.id,'Invalid instructor belt');
    }
  }
  for(const id of ids) if(instructorIds.has(id)) fail(id,'Academy/instructor ID collision');
  return rows;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const rows=validateAcademies(JSON.parse(fs.readFileSync(process.argv[2]||'academies.json','utf8')));console.log(`Validated ${rows.length} academies`);}
