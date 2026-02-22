
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Clean up existing data
  await prisma.deal.deleteMany()
  await prisma.destination.deleteMany()

  const destinations = [
    {
      name: 'Paris',
      country: 'France',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80',
      slug: 'paris-france',
      lat: 48.8566,
      lng: 2.3522,
    },
    {
      name: 'Thailand',
      country: 'Thailand',
      imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80',
      slug: 'thailand',
      lat: 13.7563,
      lng: 100.5018,
    },
    {
      name: 'London',
      country: 'United Kingdom',
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80',
      slug: 'london-uk',
      lat: 51.5074,
      lng: -0.1278,
    },
    {
      name: 'New York',
      country: 'USA',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80',
      slug: 'new-york-usa',
      lat: 40.7128,
      lng: -74.0060,
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80',
      slug: 'tokyo-japan',
      lat: 35.6762,
      lng: 139.6503,
    }
  ]

  for (const dest of destinations) {
    const createdDest = await prisma.destination.create({
      data: dest,
    })
    console.log(`Created destination with id: ${createdDest.id}`)

    // Create 2 deals for each destination
    await prisma.deal.create({
      data: {
        title: `7 Nights in ${dest.name}`,
        price: 799,
        originalPrice: 1299,
        currency: 'USD',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-08'),
        imageUrl: dest.imageUrl,
        isFeatured: true,
        destinationId: createdDest.id
      }
    })

    await prisma.deal.create({
      data: {
        title: `Weekend Getaway to ${dest.name}`,
        price: 499,
        originalPrice: 899,
        currency: 'USD',
        startDate: new Date('2024-07-12'),
        endDate: new Date('2024-07-15'),
        imageUrl: dest.imageUrl,
        isFeatured: false,
        destinationId: createdDest.id
      }
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
