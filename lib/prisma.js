import { PrismaPg } from '@prisma/adapter-pg'

// Cloudflare Workers can't use Prisma's default binary/Node-API query engine
// (no native binaries, no raw TCP sockets), so both environments go through
// driver adapters + node-postgres. What differs is which PrismaClient build
// gets loaded, and that has to be decided at runtime:
//
//   - On Workers we must import from '@prisma/client/wasm' explicitly.
//     Wrangler's bundler doesn't reliably honour the `workerd` export
//     condition, so a bare '@prisma/client' import there resolves to the
//     Node build and fails trying to load a native Linux engine binary.
//
//   - Under plain `next dev` on Node, the reverse is true: the wasm build
//     fails to initialise ("The loaded wasm module was unexpectedly
//     undefined or null"), which meant no database-backed route could be
//     exercised locally at all.
//
// Hence the dynamic import below rather than a static one.

const globalForPrisma = globalThis

async function getCloudflareEnv() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const { env } = await getCloudflareContext({ async: true })
    return env
  } catch {
    // Not running under the Cloudflare adapter — this is local Node dev.
    return null
  }
}

async function loadPrismaClient(onWorkers) {
  const mod = onWorkers
    ? await import('@prisma/client/wasm')
    : await import('@prisma/client')
  return mod.PrismaClient
}

// `WebSocketPair` is a Workers-runtime-native global (part of the Workers
// API surface itself, not something `nodejs_compat` polyfills or removes) —
// present under real workerd, absent under plain Node. Whether
// `getCloudflareContext()` resolves a Hyperdrive binding is NOT a reliable
// signal for "am I actually inside workerd": opennextjs-cloudflare's dev
// integration provides one under plain `next dev` too (no explicit
// `initOpenNextCloudflareForDev()` call needed in this version), which
// means that branch used to run locally as well as on a real deploy — and
// the `/wasm` client genuinely does fail to initialise under Next's dev
// bundler, so anything routed into it locally broke every DB-backed route.
const isWorkerd = typeof WebSocketPair !== 'undefined'

export async function getPrisma() {
  const env = await getCloudflareEnv()
  const hyperdrive = env?.HYPERDRIVE?.connectionString

  if (hyperdrive && isWorkerd) {
    // Workers: a fresh client per call. The underlying pg pool can't safely
    // be reused across requests in this runtime, per opennextjs-cloudflare's
    // guidance — hence maxUses: 1.
    const PrismaClient = await loadPrismaClient(true)
    const adapter = new PrismaPg({ connectionString: hyperdrive, maxUses: 1 })
    return new PrismaClient({ adapter })
  }

  // Local Node dev: cache across hot-reloads so we don't leak connections.
  //
  // Deliberately NOT using `hyperdrive` here even when the dev-context
  // helper resolved one. It reads wrangler.jsonc's static
  // `hyperdrive[].localConnectionString` directly rather than going through
  // wrangler's own `.dev.vars`-driven local-Hyperdrive resolution — so
  // under `next dev` it was silently returning the placeholder value that
  // field holds purely to satisfy `opennextjs-cloudflare deploy`'s
  // unrelated local-proxy validation (see wrangler.jsonc's comment), and
  // every local query failed auth against a fake `user:pass@localhost`.
  // DATABASE_URL is the one value actually meant for local dev.
  if (!globalForPrisma.__prisma) {
    const PrismaClient = await loadPrismaClient(false)
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 5 })
    globalForPrisma.__prisma = new PrismaClient({ adapter })
  }
  return globalForPrisma.__prisma
}
