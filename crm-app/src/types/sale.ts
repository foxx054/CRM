export interface SaleItem {
  sku: string;
  barcode: string;
  product: string;
  brand: string;
  category: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxes: number;
  warranty: string;
}

export type SaleChannel = "loja_fisica" | "ecommerce" | "marketplace" | "whatsapp";
export type PaymentStatus = "paid" | "pending" | "cancelled" | "refunded";

export interface Sale {
  id: string;
  saleNumber: string;
  date: string;
  store: string;
  seller: string;
  cashier: string;
  channel: SaleChannel;
  clientId: string;
  clientName: string;
  items: SaleItem[];
  paymentMethod: string;
  installments: number;
  cardBrand: string;
  pixKey?: string;
  cashback: number;
  paymentStatus: PaymentStatus;
  total: number;
}

export const channelLabels: Record<SaleChannel, string> = {
  loja_fisica: "Loja Física",
  ecommerce: "E-commerce",
  marketplace: "Marketplace",
  whatsapp: "WhatsApp",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  paid: "Pago",
  pending: "Pendente",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export const paymentStatusColors: Record<PaymentStatus, string> = {
  paid: "#1D9E75",
  pending: "#EF9F27",
  cancelled: "#D85A30",
  refunded: "#3C3489",
};
