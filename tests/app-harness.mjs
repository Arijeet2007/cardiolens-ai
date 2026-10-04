// Tests execute the app in an isolated VM with minimal DOM stubs.
// Real browser interaction is verified separately; these are logic/render regression tests.
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import * as core from '../dist/core.js';
class Element {
  constructor(){this.innerHTML='';this.textContent='';this.value='';this.open=false;this.classes=new Set();this.classList={add:x=>this.classes.add(x),remove:x=>this.classes.delete(x)};}
  addEventListener(type,listener){this['on'+type]=listener;}
  querySelector(){return new Element();}
  querySelectorAll(){return [];}
  showModal(){this.open=true;}
  close(){this.open=false;}
  append(){}
  remove(){}
  click(){}
  focus(){}
}
export function appHarness(saved=null){
  const elements=new Map();const node=key=>{if(!elements.has(key))elements.set(key,new Element());return elements.get(key);};
  const storage=new Map();if(saved!==null)storage.set('cardiolens-session',typeof saved==='string'?saved:JSON.stringify(saved));
  const downloads=[];const windows=[];
  const window={scrollTo(){},addEventListener(){},print(){},open(){const popup={html:'',document:{open(){},close(){},write(html){popup.html=html;}},focus(){},print(){popup.printed=true;}};windows.push(popup);return popup;}};
  const context=vm.createContext({...core,console,crypto:webcrypto,URL,URLSearchParams,Blob,FormData,Date,window,location:{hash:'#/dashboard'},setTimeout(){return 1;},clearTimeout(){},sessionStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},document:{title:'',querySelector:node,querySelectorAll(){return [];},getElementById:key=>node('#'+key),createElement(){const a=new Element();a.click=()=>downloads.push({name:a.download,url:a.href});return a;},body:new Element()}});
  const original=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
  const source=original.replace(/^import[^\n]+\r?\n/,'').replace(/prepareAssessment\(\);try\{thresholds=[\s\S]*$/,'');
  vm.runInContext(source+`\nthis.api={defaultState,restoreSession,saveRecords,reportContext,openPatient,sampleRecords,patients,icon,esc,brand,latest,fmt,dateLabel,name,initials,badge,heading,btn,banner,sampleNotice,completeness,shell,metricCard,riskCard,chart,chartCard,factorCard,recentTable,completeCard,dashboard,home,recordRows,history,timeline,risk,inputField,selectField,checkField,assessment,reports,profile,patientTable,doctor,patientList,patientDetail,models,versions,auditPage,evidence,auth,render,go,prepareAssessment,collectForm,formSubmit,modal,addRecord,inspect,upload,reviewImport,downloadFile,reportHTML,generateReport,confirmClear,action,bind,persist,audit,toast,getState:()=>state,setState:v=>state=v,setDraft:v=>draft=v,getDraft:()=>draft,setSymptoms:v=>draftSymptoms=v,setStep:v=>formStep=v,getStep:()=>formStep,setRoute:v=>route=v,setMetric:v=>metric=v,setPeriod:v=>period=v,setPatient:v=>activePatient=v,setThresholds:v=>thresholds=v};`,context,{filename:'cardiolens-app-under-test.js'});
  const config=JSON.parse(readFileSync(new URL('../dist/risk_thresholds.json',import.meta.url),'utf8'));
  context.api.setThresholds(config);context.api.prepareAssessment();
  return {api:context.api,context,elements,node,storage,downloads,windows};
}
