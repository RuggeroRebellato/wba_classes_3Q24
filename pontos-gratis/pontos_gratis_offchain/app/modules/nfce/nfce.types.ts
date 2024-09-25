export interface ReceiptData {
  accessKey: string
  cnpj: string
  businessName: string
  issuedAt: Date
  amount: number
  discount: number | null
  totalPaid: number
  paymentMethod: string
  address: string
  city: string
  state: string
  items?: Array<{
    name?: string
    quantity?: number
    unit?: string
    unitPrice?: number
    totalPrice?: number
  }>
}
