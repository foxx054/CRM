import { createContext, useContext, useState, type ReactNode } from "react";
import type { Client } from "../types/client";
import type { Company } from "../types/company";
import type { Deal } from "../types/deal";

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
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (title: string, relatedTo?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const defaultClients: Client[] = [
  { id: "c1", name: "João Silva", cpf: "529.982.247-25", email: "joao@exemplo.com", phone: "(11) 99999-0001", totalSpent: 12500, status: "active", createdAt: "2025-01-15" },
  { id: "c2", name: "Maria Souza", cpf: "384.561.739-10", email: "maria@exemplo.com", phone: "(11) 99999-0002", totalSpent: 3200, status: "lead", createdAt: "2025-03-20" },
  { id: "c3", name: "Carlos Pereira", cpf: "176.438.902-55", email: "carlos@exemplo.com", phone: "(11) 99999-0003", totalSpent: 8700, status: "inactive", createdAt: "2025-02-10" },
  { id: "c4", name: "Ana Martins", cpf: "721.845.963-00", email: "ana@exemplo.com", phone: "(11) 99999-0004", totalSpent: 4500, status: "active", createdAt: "2025-04-01" },
  { id: "c5", name: "Pedro Lima", cpf: "638.291.475-88", email: "pedro@exemplo.com", phone: "(11) 99999-0005", totalSpent: 2200, status: "lead", createdAt: "2025-05-10" },
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

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(defaultClients);
  const [companies, setCompanies] = useState<Company[]>(defaultCompanies);
  const [deals, setDeals] = useState<Deal[]>(defaultDeals);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

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
    <DataContext.Provider value={{ clients, companies, deals, tasks, setClients, setCompanies, setDeals, setTasks, addTask, toggleTask, deleteTask }}>
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
