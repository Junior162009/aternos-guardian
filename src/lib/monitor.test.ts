import {describe,expect,it} from 'vitest';
import {parseProviderPayload} from './monitor';

describe('parseProviderPayload',()=>{
 it('parses online status and optional metrics',()=>{
  const x=parseProviderPayload({online:true,host:'play.example.net',port:19132,players:{online:3,max:20},motd:['Hello','world'],latencyMs:42},'2026-01-01T00:00:00.000Z');
  expect(x.state).toBe('online');
  expect(x.playersOnline).toBe(3);
  expect(x.playersMax).toBe(20);
  expect(x.motd).toBe('Hello world');
  expect(x.latencyMs).toBe(42);
 });
 it('parses offline status without inventing players',()=>{
  const x=parseProviderPayload({online:false});
  expect(x.state).toBe('offline');
  expect(x.playersOnline).toBeUndefined();
 });
 it('rejects responses without a boolean online field',()=>{
  expect(()=>parseProviderPayload({status:'online'})).toThrow(/online booleano/);
 });
 it('rejects invalid ports',()=>{
  expect(()=>parseProviderPayload({online:true,port:70000})).toThrow(/port debe estar/);
 });
 it('rejects negative or fractional player counts',()=>{
  expect(()=>parseProviderPayload({online:true,players:{online:-1}})).toThrow(/entero no negativo/);
  expect(()=>parseProviderPayload({online:true,players:{online:1.5}})).toThrow(/entero no negativo/);
 });
 it('rejects player counts greater than the maximum',()=>{
  expect(()=>parseProviderPayload({online:true,players:{online:5,max:4}})).toThrow(/no puede superar/);
 });
 it('rejects invalid latency',()=>{
  expect(()=>parseProviderPayload({online:true,latencyMs:-5})).toThrow(/latencyMs/);
 });
});