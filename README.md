# Aternos Guardian 24/7

PWA para monitorizar la disponibilidad pública de un servidor Minecraft Bedrock, registrar comprobaciones y preparar solicitudes de inicio manual.

> **Límite importante:** Aternos no ofrece una API pública de administración. Esta app no automatiza su web, no inicia/reinicia el servidor y no puede garantizar uptime 24/7.

## Stack
- Vite + TypeScript
- Supabase (Postgres/Auth/RLS; esquema inicial en `supabase/migrations`)
- PWA instalable
- Vitest

## Desarrollo

```bash
npm install
cp .env.example .env
npm run dev
```

Variables opcionales: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STATUS_PROVIDER_URL`. Sin un proveedor compatible, el estado aparece como **SIN DATOS**; no se inventan resultados. El proveedor debe devolver JSON con `online: boolean`, y opcionalmente `host`, `port`, `players: { online, max }`, `motd`, `latencyMs`.

Para Supabase, ejecuta `supabase/migrations/0001_initial_schema.sql` en el SQL Editor. Nunca expongas la clave `service_role` en el navegador.

## Build y pruebas
`npm test` · `npm run build`

## Despliegue
Cualquier hosting estático compatible con Vite (Netlify, Vercel, Cloudflare Pages). Para monitorización cuando la app está cerrada hace falta un backend/scheduler separado, configurado con límites razonables del proveedor.

## Funciones incluidas
- Dashboard responsive y PWA
- Estado online/offline/unknown vía proveedor configurable
- Historial local
- Configuración de servidor
- Solicitud manual copiable
- Esquema inicial de Supabase con RLS
- Pruebas de parser y CI

## No objetivos
Automatizar login/clics de Aternos, usar endpoints privados/cookies, generar actividad falsa o prometer que el servidor gratuito permanezca encendido.