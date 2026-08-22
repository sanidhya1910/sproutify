// Seeds the EcoToken redeem-shop catalog. Run with `npx prisma db seed`
// (or automatically after `prisma migrate dev`/`migrate reset`).
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const rewards = [
  {
    name: 'Reusable Water Bottle',
    description: 'Eco-friendly stainless steel bottle.',
    cost: 50,
    imageUrl: '/rewards/water-bottle.png',
  },
  {
    name: 'Plantable Seed Pencil',
    description: 'Pencil that grows into a plant.',
    cost: 20,
    imageUrl: '/rewards/seed-pencil.png',
  },
  {
    name: 'Organic Tote Bag',
    description: 'Reusable organic cotton tote.',
    cost: 40,
    imageUrl: '/rewards/tote-bag.png',
  },
]

async function main() {
  for (const reward of rewards) {
    const existing = await prisma.reward.findFirst({ where: { name: reward.name } })
    if (existing) {
      await prisma.reward.update({ where: { id: existing.id }, data: reward })
    } else {
      await prisma.reward.create({ data: reward })
    }
  }
  console.log(`Seeded ${rewards.length} rewards.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
