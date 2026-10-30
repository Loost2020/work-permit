import {EMPTY_JOB,type ForceMap} from './analyze.ts';
import {ORDER,type Kind,type Flags,type Checks} from './review.ts';
export interface Draft{job:typeof EMPTY_JOB;flags:Flags;checks:Checks;notes:Record<string,string>;picked:Kind|null}
export const blank=():Draft=>({job:{...EMPTY_JOB,forces:{}},flags:{},checks:{},notes:{},picked:null});
export function parseDraft(input:unknown):Draft{
 if(!input||typeof input!=='object')throw Error('Invalid draft file');
 const raw=input as Record<string,unknown>,job=raw.job as Record<string,unknown>;
 if(!job||typeof job.work!=='string'||typeof job.tools!=='string')throw Error('This file does not contain a work permit draft');
 const draft=blank();for(const key of ['plant','location','duration','work','tools'] as const){if(job[key]!==undefined&&typeof job[key]!=='string')throw Error('Invalid job field');draft.job[key]=(job[key] as string)||'';}
 const forceKeys=['hot','cold','cse','line','excavation','crane','hydrocarbon','h2s','height','simops'];
 if(job.forces&&typeof job.forces==='object')draft.job.forces=Object.fromEntries(Object.entries(job.forces).filter(([key,value])=>forceKeys.includes(key)&&(value==='on'||value==='off'))) as ForceMap;
 const fields=['flags','checks','notes'] as const;
 for(const field of fields){const value=raw[field];if(value&&typeof value==='object'&&!Array.isArray(value)){const entries=Object.entries(value).filter(([key,item])=>field==='flags'?/^(hot|cold|cse|line)\|/.test(key)&&typeof item==='boolean':field==='checks'?/^(hot|cold|cse|line)\|q\d+$/.test(key)&&['Y','N','NA'].includes(item):ORDER.includes(key as Kind)&&typeof item==='string');Object.assign(draft[field],Object.fromEntries(entries));}}
 if(ORDER.includes(raw.picked as Kind))draft.picked=raw.picked as Kind;
 return draft;
}
