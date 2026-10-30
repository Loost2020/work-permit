import type {Analysis, Flag, JobInput} from './analyze.ts';
export type Kind='hot'|'cold'|'cse'|'line';
export type Mark='Y'|'N'|'NA';
export type Flags=Record<string,boolean|undefined>;
export type Checks=Record<string,Mark|undefined>;
export const ORDER:Kind[]=['hot','cold','cse','line'];
export function sheetAnalysis(result:Analysis,kind:Kind):Analysis{
 const entry=result.permits.some(p=>p.code==='cse'&&p.required);
 const required=result.gas.required;
 const spark=result.sections.E.some(f=>f.id==='goggles'&&f.on)&&result.sections.fire.some(f=>f.id==='barriers'&&f.on);
 const periodic=required&&(kind==='cse'||(kind!=='line'&&(entry||spark||result.sections.A.some(f=>f.id==='excavationList'&&f.on))));
 const frequency=!required?result.gas.frequency:kind==='line'?'Test before break and after break. Periodic monitoring: No.':kind==='cse'?'Initial test before entry with mechanical ventilation off, then every 2 hours while anyone is inside.':periodic?'Initial and renewed tests. Monitor periodically during the work; follow the approved site frequency.':'Initial and renewed tests. Periodic monitoring: No, unless site conditions require it.';
 return {...result,gas:{...result.gas,periodic,readings:kind==='line'?'break':'shift',frequency}};
}
export function withSupplementarySelection(result:Analysis,flags:Flags):Analysis{
 const selected=result.sections.A.some(form=>flags['A:'+form.id]??form.on);
 return {...result,checklist:result.checklist.map(item=>item.id==='q2'?{...item,suggest:selected?'Y':'NA',why:selected?'Review and brief the crew on the selected supplementary forms.':'N/A. No supplementary forms selected.'}:item)};
}
export function scoped<T>(values:Record<string,T|undefined>,kind:Kind):Record<string,T|undefined>{return Object.fromEntries(Object.entries(values).filter(([key])=>key.startsWith(kind+'|')).map(([key,value])=>[key.slice(kind.length+1),value]));}
export function allControls(r:Analysis):[string,Flag][]{return [...(['A','B','C','D','E'] as const).flatMap(group=>r.sections[group].map(f=>[`${group}:${f.id}`,f] as [string,Flag])),...r.sections.fire.map(f=>[`F:${f.id}`,f] as [string,Flag]),[`G:${r.sections.sewer.id}`,r.sections.sewer],[`H:${r.sections.standby.id}`,r.sections.standby],[`H:${r.sections.fireWatch.id}`,r.sections.fireWatch]];}
export function removedControls(r:Analysis,flags:Flags){return allControls(r).filter(([key,f])=>f.on&&flags[key]===false).map(([,f])=>f.en).concat(r.gas.required&&flags['gas:required']===false?['Gas testing required']:[]);}
export function effectiveGas(r:Analysis,flags:Flags){
 const required=flags['gas:required']??r.gas.required;
 const periodic=required&&(flags['gas:periodic']??r.gas.periodic);
 const manual=flags['gas:required']!==undefined||flags['gas:periodic']!==undefined;
 const frequency=!required?'No gas test selected on this draft.':manual?`Monitoring manually set to ${periodic?'Yes — record the site-approved frequency before work.':'No.'}`:r.gas.frequency;
 return {required,periodic,frequency};
}
export function buildSummary(job:JobInput,result:Analysis,flags:Flags,checks:Checks,notes:Record<string,string>):string{
 const required=result.permits.filter(p=>p.required);
 const lines=['WORK PERMIT PREPARATION — DRAFT ONLY',`Plant: ${job.plant}`,`Location: ${job.location}`,`Duration: ${job.duration||'One shift'}`,`Work: ${job.work}`,`Tools: ${job.tools}`,`${required.length} permit(s): ${required.map(p=>p.titleEn+' '+p.form).join(' + ')}`];
 for(const permit of required){const f=scoped(flags,permit.code),c=scoped(checks,permit.code),r=withSupplementarySelection(sheetAnalysis(result,permit.code),f);const gas=effectiveGas(r,f);const stop=r.checklist.filter(q=>(c[q.id]??q.suggest)==='N');lines.push('',`${permit.titleEn} (${permit.form})`,stop.length?`STOP — ${stop.length} unresolved hazard(s)`:'Checklist: Y / N/A', 'Selected controls: '+allControls(r).filter(([key,item])=>f[key]??item.on).map(([,item])=>item.en).join('; '),`Gas testing: ${gas.required?'Required':'Not required'}`,`Periodic: ${gas.periodic?'Yes':'No'}`,gas.frequency,...r.checklist.map((q,i)=>`${i+1}. ${(c[q.id]??q.suggest)==='NA'?'N/A':c[q.id]??q.suggest} — ${q.en}`),'Site precautions: '+(notes[permit.code]||'For site review'));const removed=removedControls(r,f);if(removed.length)lines.push('Suggested controls removed manually: '+removed.join('; '));}
 return lines.concat('','Gas readings, badge numbers and signatures intentionally blank. Joint site inspection and official authorization required.').join('\n');
}
