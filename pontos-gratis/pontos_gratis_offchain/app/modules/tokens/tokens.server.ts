import { prisma } from '@/utils/db.server'
import type { CreateOffChainTransactionParams } from './tokens.types'

export async function createOffChainTransaction({
  tokenId,
  userId,
  receiptId,
  amount,
}: CreateOffChainTransactionParams) {
  return prisma.offChainTransaction.create({
    data: {
      token: { connect: { id: tokenId } },
      user: { connect: { id: userId } },
      receipt: { connect: { id: receiptId } },
      amount,
    },
  })
}
