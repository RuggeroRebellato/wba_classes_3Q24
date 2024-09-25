import { PrismaClient } from '@prisma/client'
import { prisma } from '@/utils/db.server'

const client = new PrismaClient()

async function seed() {
  /**
   * Users, Roles and Permissions.
   */
  const entities = ['user']
  const actions = ['create', 'read', 'update', 'delete']
  const accesses = ['own', 'any'] as const

  // Using upsert to avoid unique constraint error
  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        await prisma.permission.upsert({
          where: {
            action_entity_access: {
              action,
              entity,
              access,
            },
          },
          update: {}, // No update logic needed, just ensure it exists
          create: {
            entity,
            action,
            access,
          },
        })
      }
    }
  }

  // Create the roles and connect them to permissions
  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {}, // No updates, just ensure existence
    create: {
      name: 'admin',
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: { access: 'any' },
        }),
      },
    },
  })

  await prisma.role.upsert({
    where: { name: 'user' },
    update: {}, // No updates, just ensure existence
    create: {
      name: 'user',
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: { access: 'own' },
        }),
      },
    },
  })

  // Create the admin user and assign both admin and user roles
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {}, // No updates, just ensure existence
    create: {
      email: 'admin@admin.com',
      username: 'admin',
      roles: { connect: [{ name: 'admin' }, { name: 'user' }] },
    },
  })

  console.info(`🎭 User roles and permissions have been successfully created.`)
}

seed()
  .catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await client.$disconnect()
  })
