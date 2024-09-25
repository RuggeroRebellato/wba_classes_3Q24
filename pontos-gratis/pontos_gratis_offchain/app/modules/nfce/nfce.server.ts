import { JSDOM } from 'jsdom'
import type { ReceiptData } from './nfce.types'
import { prisma } from '@/utils/db.server'

export async function processNFCeReceipt(htmlString: string): Promise<ReceiptData> {
  const dom = new JSDOM(htmlString)
  const document = dom.window.document

  // Extract business name
  const businessName =
    document.querySelector('#u20.txtTopo')?.textContent?.trim() ?? 'Unknown Business'

  // Extract CNPJ
  const cnpjElement = document.querySelector('.text')
  const cnpj =
    cnpjElement?.textContent?.match(/CNPJ:\s*([\d\.\/\-]+)/)?.[1].replace(/[^\d]/g, '') ??
    ''

  if (!cnpj) {
    throw new Error('CNPJ not found in the receipt')
  }

  // Extract other data
  const accessKey =
    document.querySelector('.chave')?.textContent?.replace(/\s/g, '') ?? ''

  const issuedAtText =
    document
      .querySelector('.ui-collapsible-content')
      ?.textContent?.match(/Emissão:\s*(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2})/)?.[1] ??
    ''
  const issuedAt = issuedAtText
    ? new Date(issuedAtText.split('/').reverse().join('-'))
    : new Date()

  const totalPaidText =
    document
      .querySelector('.linhaShade .totalNumb')
      ?.textContent?.replace('R$', '')
      .trim() ?? '0'
  const totalPaid = Math.round(parseFloat(totalPaidText.replace(',', '.')) * 100)

  // Extract discount
  const discountText =
    Array.from(document.querySelectorAll('#linhaTotal'))
      .find((el) => el.textContent?.includes('Descontos'))
      ?.querySelector('.totalNumb')
      ?.textContent?.trim() ?? '0'
  const discount = Math.round(parseFloat(discountText.replace(',', '.')) * 100)

  // Extract payment method
  const paymentMethodElement = document.querySelector('#linhaTotal:not(.linhaShade)')
  const paymentMethod =
    paymentMethodElement?.textContent?.trim().split(' ')[0] ?? 'Unknown'

  const items = Array.from(document.querySelectorAll('tr'))
    .map((tr) => {
      const txtTit = tr.querySelector('.txtTit')
      if (!txtTit) return null

      const name = txtTit.textContent?.trim() ?? undefined
      const quantityText =
        tr.querySelector('.Rqtd')?.textContent?.match(/Qtde\.:\s*([\d,]+)/)?.[1] ??
        undefined
      const quantity = quantityText
        ? parseFloat(quantityText.replace(',', '.'))
        : undefined
      const unit =
        tr.querySelector('.RUN')?.textContent?.match(/UN:\s*(\w+)/)?.[1] ?? undefined
      const unitPriceText =
        tr
          .querySelector('.RvlUnit')
          ?.textContent?.match(/Vl\. Unit\.:\s*([\d,]+)/)?.[1] ?? undefined
      const unitPrice = unitPriceText
        ? Math.round(parseFloat(unitPriceText.replace(',', '.')) * 100)
        : undefined
      const totalPriceText = tr.querySelector('.valor')?.textContent?.trim() ?? undefined
      const totalPrice = totalPriceText
        ? Math.round(parseFloat(totalPriceText.replace(',', '.')) * 100)
        : undefined

      return {
        name,
        quantity,
        unit,
        unitPrice,
        totalPrice,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  // Extract address, city, and state
  const addressElement = document.querySelector('.text:nth-of-type(3)')
  let address = '',
    city = '',
    state = ''
  if (addressElement) {
    const addressParts = addressElement.textContent?.split(',').map((s) => s.trim()) ?? []
    address = addressParts.slice(0, -2).join(', ')
    city = addressParts[addressParts.length - 2] ?? ''
    state = addressParts[addressParts.length - 1] ?? ''
  }

  return {
    accessKey,
    cnpj,
    businessName,
    issuedAt,
    amount: totalPaid,
    discount,
    totalPaid,
    paymentMethod,
    items,
    address,
    city,
    state,
  }
}

export async function findExistingReceipt(accessKey: string) {
  return prisma.nfceReceipt.findUnique({
    where: { accessKey },
  })
}

export async function createNfceReceipt(
  data: ReceiptData,
  userId: string,
  businessId: string,
  location?: string,
) {
  return prisma.nfceReceipt.create({
    data: {
      accessKey: data.accessKey,
      businessId,
      userId,
      issuedAt: data.issuedAt,
      amount: data.amount,
      discount: data.discount,
      totalPaid: data.totalPaid,
      paymentMethod: data.paymentMethod,
      location,
      items: {
        create: data.items?.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      },
    },
  })
}
