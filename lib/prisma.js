// Imported from the explicit `/wasm` subpath rather than the bare
// `@prisma/client` — Wrangler/esbuild don't reliably honor the `workerd`
// export condition that would otherwise pick this build automatically,
// which left the Worker trying (and failing) to load a native Linux query
// engine binary. This subpath always resolves to the wasm-engine build.
import { PrismaClient } from '@prisma/client/wasm'
import { PrismaPg } from '@prisma/adapter-pg'

// Cloudflare Workers can't use Prisma's default binary/Node-API query
// engine (no native binaries, no raw TCP sockets), so on Workers we always
// go through the `driverAdapters` preview feature + node-postgres via the
// Hyperdrive binding. Locally (plain `next dev`/`next build`) there's no
// Workers runtime, so we fall back to a normal `DATABASE_URL`-backed pool.
//
// Per @opennextjs/cloudflare's guidance, a Hyperdrive-backed client must be
// created fresh per request (not cached across requests/isolates) since the
// underlying pg Pool's connection can't safely be reused that way on
// Workers — see https://opennext.js.org/cloudflare/howtos/db. Locally we
// keep the usual singleton so Next.js's dev-mode hot-reload doesn't leak
// connections.

const globalForPrisma = globalThis

async function getCloudflareEnv() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const { env } = await getCloudflareContext({ async: true })
    return env
  } catch {
    return null
  }
}

export async function getPrisma() {
  const env = await getCloudflareEnv()

  if (env?.HYPERDRIVE?.connectionString) {
    // Workers: fresh client per call, per opennextjs-cloudflare's guidance.
    const adapter = new PrismaPg({ connectionString: env.HYPERDRIVE.connectionString, maxUses: 1 })
    return new PrismaClient({ adapter })
  }

  // Local Node.js dev: cache across hot-reloads.
  if (!globalForPrisma.__prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 5 })
    globalForPrisma.__prisma = new PrismaClient({ adapter })
  }
  return globalForPrisma.__prisma
}
