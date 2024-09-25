import { json } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'
import { processNFCeReceipt, createNfceReceipt } from '@/modules/nfce/nfce.server'
import { findOrCreateBusinessWithEconomicGroup } from '@/modules/business/business.server'
import { createOffChainTransaction } from '@/modules/tokens/tokens.server'

export const ROUTE_PATH = '/api/transact/nfc-e' as const

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  let data
  try {
    data = await request.json()
  } catch (error) {
    return json({ error: 'Invalid JSON data' }, { status: 400 })
  }

  const { nfceHtml, userId } = data

  if (typeof nfceHtml !== 'string' || typeof userId !== 'string') {
    return json(
      { error: 'Invalid data: nfceHtml and userId must be strings' },
      { status: 400 },
    )
  }

  try {
    const receiptData = await processNFCeReceipt(nfceHtml)

    const { business, token } = await findOrCreateBusinessWithEconomicGroup(receiptData)

    const nfceReceipt = await createNfceReceipt(receiptData, userId, business.id)

    if (business.onboarded && token.onChain) {
      // TODO: Implement on-chain token minting logic
      console.log('On-chain minting not implemented yet')
    } else {
      await createOffChainTransaction({
        tokenId: token.id,
        userId,
        receiptId: nfceReceipt.id,
        amount: Math.floor(receiptData.totalPaid), // 1 token per centavo spent
      })
    }

    return json({
      success: true,
      receiptId: nfceReceipt.id,
      tokenAmount: Math.floor(receiptData.totalPaid),
      businessName: business.name,
      tokenName: token.name,
    })
  } catch (error) {
    console.error('Failed to process NFC-e receipt:', error)
    return json(
      {
        success: false,
        error:
          'Failed to process receipt: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 },
    )
  }
}
