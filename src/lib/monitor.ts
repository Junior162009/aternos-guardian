export type ServerState = 'online' | 'offline' | 'unknown';
export interface ServerStatus { state: ServerState; host?: string; port?: number; playersOnline?: number; playersMax?: number; motd?: string; latencyMs?: number; checkedAt: string; source: 'provider' | 'unconfigured' | 'error'; message?: string; }
export interface StatusPayload { online: boolean; host?: string; port?: number; players?: { online?: number; max?: number }; motd?: string | string[]; latencyMs?: number; }
export function parseProviderPayload(payload: unknown, checkedAt = new Date().toISOString()): ServerStatus {
 if (!payload || typeof payload !== 'object' || !('online' in payload) || typeof (payload as {online: unknown}).online !== 'boolean') throw new Error('Respuesta inválida: se esperaba online booleano.');
 const p = payload as StatusPayload; const motd = Array.isArray(p.motd) ? p.motd.join(' ') : p.motd;
 return {state:p.online?'online':'offline',host:typeof p.host==='string'?p.host:undefined,port:typeof p.port==='number'?p.port:undefined,playersOnline:typeof p.players?.online==='number'?p.players.online:undefined,playersMax:typeof p.players?.max==='number'?p.players.max:undefined,motd:typeof motd==='string'?motd:undefined,latencyMs:typeof p.latencyMs==='number'?p.latencyMs:undefined,checkedAt,source:'provider'};
}
export async function checkPublicStatus(url:string,signal?:AbortSignal):Promise<ServerStatus>{
 if(!url.trim()) return {state:'unknown',checkedAt:new Date().toISOString(),source:'unconfigured',message:'Configura un proveedor de estado público para consultar el servidor.'};
 try {const res=await fetch(url,{signal,headers:{Accept:'application/json'}});if(!res.ok)throw new Error('Proveedor HTTP '+res.status);return parseProviderPayload(await res.json());}
 catch(e){if(e instanceof DOMException&&e.name==='AbortError')throw e;return {state:'unknown',checkedAt:new Date().toISOString(),source:'error',message:e instanceof Error?e.message:'No fue posible consultar el proveedor.'};}
}