import type {ServerStatus} from './monitor';
const SERVER_KEY='ag.server-config.v1', HISTORY_KEY='ag.status-history.v1';
export interface ServerConfig {name:string;host:string;port:number}
export function loadServerConfig():ServerConfig{try{const x=JSON.parse(localStorage.getItem(SERVER_KEY)||'null') as ServerConfig|null;if(x&&typeof x.name==='string'&&typeof x.host==='string'&&Number.isInteger(x.port))return x;}catch{}return{name:'Mi servidor Bedrock',host:'',port:19132};}
export function saveServerConfig(x:ServerConfig){localStorage.setItem(SERVER_KEY,JSON.stringify(x));}
export function loadHistory():ServerStatus[]{try{return(JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]') as ServerStatus[]).slice(0,100);}catch{return[];}}
export function saveStatus(x:ServerStatus){localStorage.setItem(HISTORY_KEY,JSON.stringify([x,...loadHistory()].slice(0,100)));}