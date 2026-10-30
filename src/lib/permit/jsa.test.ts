import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,EMPTY_JOB} from './analyze.ts';
import {withSupplementarySelection,buildSummary} from './review.ts';
const job={...EMPTY_JOB,work:'PM check on local transmitter',tools:'Instrument devices'};
test('routine PM does not imply a JSA document',()=>{const r=analyze(job);assert.equal(r.sections.A.find(f=>f.id==='jsa')?.on,false);assert.equal(r.checklist.find(q=>q.id==='q2')?.suggest,'NA')});
test('hot or confined permit does not by itself establish JSA requirement',()=>{for(const work of ['Weld pipe support','Enter confined tank'])assert.equal(analyze({...job,work}).sections.A.find(f=>f.id==='jsa')?.on,false)});
test('manual JSA selection updates applicable-forms checklist and handover',()=>{const r=analyze(job);assert.equal(withSupplementarySelection(r,{'A:jsa':true}).checklist.find(q=>q.id==='q2')?.suggest,'Y');const text=buildSummary(job,r,{'cold|A:jsa':true},{},{});assert.match(text,/Selected controls: Job Safety Analysis/);assert.match(text,/2\. Y —/)});
test('other required supplementary forms keep checklist applicable without JSA',()=>{const r=analyze({...job,work:'Open gas line flange'});assert.equal(r.sections.A.find(f=>f.id==='jsa')?.on,false);assert.equal(r.checklist.find(q=>q.id==='q2')?.suggest,'Y')});
