export type ServerState = 'online' | 'offline' | 'unknown';
export interface ServerStatus { state: ServerState; host?: string; port?: number; playersOnline?: number; playersMax?: number; motd?: string; latencyMs?: number; checkedAt: string; source: 'provider' | 'unconfigured' | 'error'; message?: string; }
export interface StatusPayload { online: boolean; host?: string; port?: number; players?: { online?: number; max?: number }; motd?: string | string[]; latencyMs?: number; }

function optionalCount(value: unknown, field: string): number | undefined {
 if (value === undefined || value === null) return undefined;
 if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw new Error(`Respuesta inválida: ${field} debe ser un entero no negativo.`);
 return value;
}

export function parseProviderPayload(payload: unknown, checkedAt = new Date().toISOString()): ServerStatus {
 if (!payload || typeof payload !== 'object' || !('online' in payload) || typeof (payload as {online: unknown}).online !== 'boolean') {
  throw new Error('Respuesta inválida: se esperaba online booleano.');
 }
 const p = payload as StatusPayload;
 if (p.host !== undefined && (typeof p.host !== 'string' || p.host.length > 255)) throw new Error('Respuesta inválida: host debe ser texto de máximo 255 caracteres.');
 if (p.port !== undefined && (typeof p.port !== 'number' || !Number.isInteger(p.port) || p.port < 1 || p.port > 65535)) throw new Error('Respuesta inválida: port debe estar entre 1 y 65535.');
 if (p.players !== undefined && (!p.players || typeof p.players !== 'object' || Array.isArray(p.players))) throw new Error('Respuesta inválida: players debe ser un objeto.');
 const playersOnline = optionalCount(p.players?.online, 'players.online');
 const playersMax = optionalCount(p.players?.max, 'players.max');
 const latencyMs = optionalCount(p.latencyMs, 'latencyMs');
 if (playersOnline !== undefined && playersMax !== undefined && playersOnline > playersMax) throw new Error('Respuesta inválida: players.online no puede superar players.max.');
 if (p.motd !== undefined && typeof p.motd !== 'string' && !(Array.isArray(p.motd) && p.motd.every(x => typeof x === 'string'))) throw new Error('Respuesta inválida: motd debe ser texto o una lista de textos.');
 const motd = Array.isArray(p.motd) ? p.motd.join(' ') : p.motd;
 return {state:p.online?'online':'offline',host:typeof p.host==='string'?p.host:undefined,port:p.port,playersOnline,playersMax,motd:typeof motd==='string'?motd:undefined,latencyMs,checkedAt,source:'provider'};
}
export async function checkPublicStatus(url:string,signal?:AbortSignal):Promise<ServerStatus>{
 if(!url.trim()) return {state:'unknown',checkedAt:new Date().toISOString(),source:'unconfigured',message:'Configura un proveedor de estado público para consultar el servidor.'};
 try {const res=await fetch(url,{signal,headers:{Accept:'application/json'}});if(!res.ok)throw new Error('Proveedor HTTP '+res.status);return parseProviderPayload(await res.json());}
 catch(e){if(e instanceof DOMException&&e.name==='AbortError')throw e;return {state:'unknown',checkedAt:new Date().toISOString(),source:'error',message:e instanceof Error?e.message:'No fue posible consultar el proveedor.'};}
}