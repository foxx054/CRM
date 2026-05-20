import { useState } from "react";
import type { Client } from "../types/client";
import ClientFormModal from "../components/ClientFormModal";
import "../components/ClientFormModal.css";
import "./Clients.css";

const initialClients: Client[] = [
  { id: "1", name: "João Silva", email: "joao@exemplo.com", phone: "(11) 99999-0001", company: "Tech Ltda", status: "active", createdAt: "2025-01-15" },
  { id: "2", name: "Maria Souza", email: "maria@exemplo.com", phone: "(11) 99999-0002", company: "Design Studio", status: "lead", createdAt: "2025-03-20" },
  { id: "3", name: "Carlos Pereira", email: "carlos@exemplo.com", phone: "(11) 99999-0003", company: "Construtora ABC", status: "inactive", createdAt: "2025-02-10" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR");
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filtered = clients.filter((c) =>
    [c.name, c.email, c.company, c.phone].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const statusLabels: Record<Client["status"], string> = {
    active: "Ativo",
    inactive: "Inativo",
    lead: "Lead",
  };

  function handleSave(data: Omit<Client, "id" | "createdAt">) {
    if (editingClient) {
      setClients((prev) =>
        prev.map((c) => (c.id === editingClient.id ? { ...c, ...data } : c))
      );
    } else {
      const newClient: Client = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setClients((prev) => [newClient, ...prev]);
    }
  }

  function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setClients((prev) => prev.filter((c) => c.id !== id));
    }
  }

  function openEdit(client: Client) {
    setEditingClient(client);
    setModalOpen(true);
  }

  function openCreate() {
    setEditingClient(null);
    setModalOpen(true);
  }

  return (
    <div className="clients-page">
      <div className="clients-header">
        <div>
          <h1>Clientes</h1>
          <p className="subtitle">{clients.length} clientes cadastrados</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Novo Cliente
        </button>
      </div>

      <div className="search-bar">
        <input
          placeholder="Buscar por nome, email, empresa ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Empresa</th>
              <th>Status</th>
              <th>Cadastro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr key={client.id}>
                <td className="cell-name">{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.company}</td>
                <td>
                  <span className={`status status-${client.status}`}>
                    {statusLabels[client.status]}
                  </span>
                </td>
                <td className="cell-date">{formatDate(client.createdAt)}</td>
                <td className="cell-actions">
                  <button className="btn-icon" onClick={() => openEdit(client)} title="Editar">
                    ✏️
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(client.id)} title="Excluir">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">
                  Nenhum cliente encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ClientFormModal
        open={modalOpen}
        client={editingClient}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
