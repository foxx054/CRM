export interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  totalSpent: number;
  status: "active" | "inactive" | "lead";
  favoriteProducts: string;
  favoriteBrand: string;
  preferredCategory: string;
  purchaseFrequency: string;
  preferredChannel: string;
  createdAt: string;
}
