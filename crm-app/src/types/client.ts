export interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "lead";
  createdAt: string;
}
