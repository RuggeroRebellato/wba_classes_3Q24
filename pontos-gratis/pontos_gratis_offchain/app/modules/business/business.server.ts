import { prisma } from '@/utils/db.server'
import type { ReceiptData } from '@/modules/nfce/nfce.types'
import type { Business, Token, EconomicGroup } from '@prisma/client'

interface BusinessWithRelations extends Business {
  economicGroup: EconomicGroup & {
    tokens: Token[]
  }
}

interface BusinessWithToken {
  business: BusinessWithRelations
  token: Token
}

export async function findOrCreateBusinessWithEconomicGroup(
  receiptData: ReceiptData,
): Promise<BusinessWithToken> {
  const businessName = receiptData.businessName
  const economicGroupName = `${businessName} Group`

  return await prisma.$transaction(async (prisma) => {
    let economicGroup = await prisma.economicGroup.findFirst({
      where: { name: economicGroupName },
    })

    if (!economicGroup) {
      economicGroup = await prisma.economicGroup.create({
        data: { name: economicGroupName },
      })
    }

    const business = await prisma.business.upsert({
      where: { cnpj: receiptData.cnpj },
      update: {
        name: businessName,
        economicGroupId: economicGroup.id,
        address: receiptData.address,
        city: receiptData.city,
        state: receiptData.state,
      },
      create: {
        name: businessName,
        cnpj: receiptData.cnpj,
        address: receiptData.address,
        city: receiptData.city,
        state: receiptData.state,
        economicGroupId: economicGroup.id,
      },
    })

    let token = await prisma.token.findFirst({
      where: { economicGroupId: economicGroup.id },
    })

    if (!token) {
      token = await prisma.token.create({
        data: {
          name: `${businessName} Token`,
          symbol: `${businessName.substring(0, 3).toUpperCase()}T`,
          decimals: 2,
          economicGroupId: economicGroup.id,
        },
      })
    }

    const businessWithRelations: BusinessWithRelations = {
      ...business,
      economicGroup: {
        ...economicGroup,
        tokens: [token],
      },
    }

    return {
      business: businessWithRelations,
      token,
    }
  })
}

export async function findBusinessByCNPJ(cnpj: string) {
  return prisma.business.findUnique({
    where: { cnpj },
    include: { economicGroup: { include: { tokens: true } } },
  })
}
