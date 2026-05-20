import { createContext, useContext, useState, type ReactNode } from "react";
import type { Client } from "../types/client";
import type { Company } from "../types/company";
import type { Deal } from "../types/deal";
import type { Sale } from "../types/sale";

interface Task {
  id: string;
  title: string;
  done: boolean;
  relatedTo?: string;
  createdAt: string;
}

interface DataContextType {
  clients: Client[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  sales: Sale[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  addTask: (title: string, relatedTo?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const defaultClients: Client[] = [
  { id: "c1", name: "João Silva", cpf: "529.982.247-25", email: "joao@exemplo.com", phone: "(11) 99999-0001", totalSpent: 12500, status: "active", favoriteProducts: "Smart TVs, Geladeiras", favoriteBrand: "Samsung", preferredCategory: "Eletrodomésticos", purchaseFrequency: "Mensal", preferredChannel: "WhatsApp", createdAt: "2025-01-15" },
  { id: "c2", name: "Maria Souza", cpf: "384.561.739-10", email: "maria@exemplo.com", phone: "(11) 99999-0002", totalSpent: 3200, status: "lead", favoriteProducts: "Móveis para sala", favoriteBrand: "Móveis Becker", preferredCategory: "Móveis", purchaseFrequency: "Trimestral", preferredChannel: "E-mail", createdAt: "2025-03-20" },
  { id: "c3", name: "Carlos Pereira", cpf: "176.438.902-55", email: "carlos@exemplo.com", phone: "(11) 99999-0003", totalSpent: 8700, status: "inactive", favoriteProducts: "Ferramentas, Tintas", favoriteBrand: "Vonder", preferredCategory: "Materiais de Construção", purchaseFrequency: "Semestral", preferredChannel: "Ligação", createdAt: "2025-02-10" },
  { id: "c4", name: "Ana Martins", cpf: "721.845.963-00", email: "ana@exemplo.com", phone: "(11) 99999-0004", totalSpent: 4500, status: "active", favoriteProducts: "Notebooks, Monitores", favoriteBrand: "Dell", preferredCategory: "Informática", purchaseFrequency: "Mensal", preferredChannel: "WhatsApp", createdAt: "2025-04-01" },
  { id: "c5", name: "Pedro Lima", cpf: "638.291.475-88", email: "pedro@exemplo.com", phone: "(11) 99999-0005", totalSpent: 2200, status: "lead", favoriteProducts: "Telefones, Fones", favoriteBrand: "Xiaomi", preferredCategory: "Telefonia", purchaseFrequency: "Quinzenal", preferredChannel: "E-mail", createdAt: "2025-05-10" },
];

const defaultCompanies: Company[] = [
  { id: "e1", nomeFantasia: "Lojas Becker", razaoSocial: "LOJAS BECKER LTDA", cnpj: "90.518.362/0001-70", segmento: "Varejo", areasAtuacao: "móveis, eletrodomésticos, informática, telefonia, materiais de construção", site: "https://www.lojasbecker.com.br", telefone: "(55) 3359-3500", cidade: "Cerro Largo", estado: "Rio Grande do Sul", pais: "Brasil", status: "active", createdAt: "2025-01-01" },
  { id: "e2", nomeFantasia: "Tech Sul", razaoSocial: "TECH SUL LTDA", cnpj: "11.222.333/0001-44", segmento: "Tecnologia", areasAtuacao: "informática, suprimentos", site: "", telefone: "(51) 3333-4444", cidade: "Porto Alegre", estado: "Rio Grande do Sul", pais: "Brasil", status: "active", createdAt: "2025-02-15" },
];

const defaultDeals: Deal[] = [
  { id: "d1", title: "Sala de estar completa", company: "Lojas Becker", value: 0, stage: "atendimento", contactName: "Ana Martins", createdAt: "2025-05-15", clientId: "c4", companyId: "e1" },
  { id: "d2", title: "Kit cozinha industrial", company: "Lojas Becker", value: 0, stage: "atendimento", contactName: "Carlos Silva", createdAt: "2025-05-14", clientId: "c3", companyId: "e1" },
  { id: "d3", title: "Home theater", company: "Lojas Becker", value: 4500, stage: "orcamento", contactName: "Julia Pereira", createdAt: "2025-05-10", clientId: "c2", companyId: "e1" },
  { id: "d4", title: "Móveis quarto casal", company: "Lojas Becker", value: 3200, stage: "orcamento", contactName: "Rodrigo Oliveira", createdAt: "2025-05-08" },
  { id: "d5", title: "Ar condicionado 12000 BTUs", company: "Lojas Becker", value: 2800, stage: "negociacao", contactName: "Maria Souza", createdAt: "2025-05-05", clientId: "c2" },
  { id: "d6", title: "Máquina de lavar + secadora", company: "Lojas Becker", value: 4200, stage: "negociacao", contactName: "João Silva", createdAt: "2025-05-03", clientId: "c1" },
  { id: "d7", title: "Smart TV 55\"", company: "Lojas Becker", value: 3500, stage: "venda_concluida", contactName: "Lucas Oliveira", createdAt: "2025-04-28" },
  { id: "d8", title: "Geladeira frost free", company: "Lojas Becker", value: 3800, stage: "venda_concluida", contactName: "Ana Costa", createdAt: "2025-04-25" },
  { id: "d9", title: "Suporte técnico TV", company: "Lojas Becker", value: 150, stage: "pos_venda", contactName: "Carlos Pereira", createdAt: "2025-04-20" },
  { id: "d10", title: "Troca de produto", company: "Lojas Becker", value: 0, stage: "pos_venda", contactName: "Maria Souza", createdAt: "2025-04-18" },
];

const defaultTasks: Task[] = [
  { id: "t1", title: "Ligar para Ana Martins sobre orçamento", done: false, relatedTo: "Ana Martins", createdAt: "2025-05-16" },
  { id: "t2", title: "Enviar proposta de home theater para Julia", done: false, relatedTo: "Julia Pereira", createdAt: "2025-05-15" },
  { id: "t3", title: "Verificar disponibilidade de ar condicionado", done: true, relatedTo: "Maria Souza", createdAt: "2025-05-14" },
];

const defaultSales: Sale[] = [
  {
    id: "s1", saleNumber: "V-2025-0001", date: "2025-05-10", store: "Lojas Becker - Cerro Largo", seller: "Carlos Vendedor", cashier: "Caixa 02",
    channel: "loja_fisica", clientId: "c1", clientName: "João Silva",
    items: [
      { sku: "TV-55-SAM", barcode: "7891234560010", product: "Smart TV 55\" 4K", brand: "Samsung", category: "Eletrodomésticos", quantity: 1, unitPrice: 3500, discount: 150, taxes: 280, warranty: "12 meses" },
      { sku: "SB-Q800", barcode: "7891234560027", product: "Soundbar Q800", brand: "Samsung", category: "Eletrodomésticos", quantity: 1, unitPrice: 1200, discount: 0, taxes: 96, warranty: "12 meses" },
    ],
    paymentMethod: "credit_card", installments: 6, cardBrand: "Mastercard", cashback: 45, paymentStatus: "paid", total: 4550,
  },
  {
    id: "s2", saleNumber: "V-2025-0002", date: "2025-05-12", store: "Lojas Becker - Cerro Largo", seller: "Carlos Vendedor", cashier: "Caixa 01",
      channel: "whatsapp", clientId: "c1", clientName: "João Silva",
    items: [
      { sku: "RF-440", barcode: "7891234560034", product: "Geladeira Frost Free 440L", brand: "Electrolux", category: "Eletrodomésticos", quantity: 1, unitPrice: 3800, discount: 200, taxes: 304, warranty: "24 meses" },
    ],
    paymentMethod: "pix", installments: 1, cardBrand: "", pixKey: "joao@exemplo.com", cashback: 76, paymentStatus: "paid", total: 3600,
  },
  {
    id: "s3", saleNumber: "V-2025-0003", date: "2025-05-08", store: "Lojas Becker - Cerro Largo", seller: "Maria Atendente", cashier: "Caixa 03",
      channel: "loja_fisica", clientId: "c2", clientName: "Maria Souza",
    items: [
      { sku: "MVS-3PC", barcode: "7891234560041", product: "Sofá 3 lugares", brand: "Móveis Becker", category: "Móveis", quantity: 1, unitPrice: 2500, discount: 300, taxes: 200, warranty: "36 meses" },
      { sku: "MSA-MESA", barcode: "7891234560058", product: "Mesa de centro", brand: "Móveis Becker", category: "Móveis", quantity: 1, unitPrice: 700, discount: 0, taxes: 56, warranty: "12 meses" },
    ],
    paymentMethod: "credit_card", installments: 3, cardBrand: "Visa", cashback: 30, paymentStatus: "paid", total: 3200,
  },
  {
    id: "s4", saleNumber: "V-2025-0004", date: "2025-05-05", store: "Lojas Becker - Online", seller: "E-commerce", cashier: "CX-WEB",
      channel: "ecommerce", clientId: "c4", clientName: "Ana Martins",
    items: [
      { sku: "NB-DELL", barcode: "7891234560065", product: "Notebook Dell Inspiron", brand: "Dell", category: "Informática", quantity: 1, unitPrice: 4200, discount: 350, taxes: 336, warranty: "24 meses" },
      { sku: "MN-24", barcode: "7891234560072", product: "Monitor 24\" Full HD", brand: "Dell", category: "Informática", quantity: 1, unitPrice: 900, discount: 0, taxes: 72, warranty: "12 meses" },
      { sku: "M-KB", barcode: "7891234560089", product: "Teclado Mecânico", brand: "Logitech", category: "Informática", quantity: 1, unitPrice: 250, discount: 25, taxes: 20, warranty: "6 meses" },
    ],
    paymentMethod: "credit_card", installments: 10, cardBrand: "Mastercard", cashback: 90, paymentStatus: "paid", total: 5350,
  },
  {
    id: "s5", saleNumber: "V-2025-0005", date: "2025-05-02", store: "Lojas Becker - Marketplace", seller: "Marketplace", cashier: "CX-MKT",
      channel: "marketplace", clientId: "c5", clientName: "Pedro Lima",
    items: [
      { sku: "IP-16", barcode: "7891234560096", product: "iPhone 16 128GB", brand: "Apple", category: "Telefonia", quantity: 1, unitPrice: 5500, discount: 0, taxes: 440, warranty: "12 meses" },
    ],
    paymentMethod: "pix", installments: 1, cardBrand: "", pixKey: "pedro@exemplo.com", cashback: 110, paymentStatus: "paid", total: 5500,
  },
  {
    id: "s6", saleNumber: "V-2025-0006", date: "2025-04-28", store: "Lojas Becker - Cerro Largo", seller: "Carlos Vendedor", cashier: "Caixa 02",
      channel: "loja_fisica", clientId: "c1", clientName: "João Silva",
    items: [
      { sku: "M-LAV", barcode: "7891234560102", product: "Máquina de Lavar 12kg", brand: "LG", category: "Eletrodomésticos", quantity: 1, unitPrice: 2800, discount: 200, taxes: 224, warranty: "24 meses" },
      { sku: "SEC-7", barcode: "7891234560119", product: "Secadora 7kg", brand: "LG", category: "Eletrodomésticos", quantity: 1, unitPrice: 2200, discount: 100, taxes: 176, warranty: "24 meses" },
    ],
    paymentMethod: "credit_card", installments: 4, cardBrand: "Visa", cashback: 50, paymentStatus: "paid", total: 5000,
  },
  {
    id: "s7", saleNumber: "V-2025-0007", date: "2025-04-25", store: "Lojas Becker - Cerro Largo", seller: "Maria Atendente", cashier: "Caixa 01",
      channel: "loja_fisica", clientId: "c3", clientName: "Carlos Pereira",
    items: [
      { sku: "FUR-COMP", barcode: "7891234560126", product: "Furadeira de Impacto", brand: "Bosch", category: "Ferramentas", quantity: 1, unitPrice: 350, discount: 0, taxes: 28, warranty: "12 meses" },
      { sku: "TIN-18L", barcode: "7891234560133", product: "Tinta Acrílica 18L", brand: "Suvinil", category: "Materiais de Construção", quantity: 2, unitPrice: 180, discount: 20, taxes: 30, warranty: "—" },
    ],
    paymentMethod: "debit_card", installments: 1, cardBrand: "Elo", cashback: 0, paymentStatus: "paid", total: 710,
  },
];

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(defaultClients);
  const [companies, setCompanies] = useState<Company[]>(defaultCompanies);
  const [deals, setDeals] = useState<Deal[]>(defaultDeals);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [sales, setSales] = useState<Sale[]>(defaultSales);

  function addTask(title: string, relatedTo?: string) {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      done: false,
      relatedTo,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTasks((prev) => [task, ...prev]);
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <DataContext.Provider value={{ clients, companies, deals, tasks, sales, setClients, setCompanies, setDeals, setTasks, setSales, addTask, toggleTask, deleteTask }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

export type { Task };
