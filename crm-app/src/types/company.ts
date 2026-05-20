export interface Company {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  segmento: string;
  areasAtuacao: string;
  site: string;
  telefone: string;
  cidade: string;
  estado: string;
  pais: string;
  status: "active" | "inactive";
  createdAt: string;
}
