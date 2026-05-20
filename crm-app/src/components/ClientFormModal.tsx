import { useState, useEffect } from "react";
import type { Client } from "../types/client";

interface Props {
  open: boolean;
  client: Client | null;
  onClose: () => void;
  onSave: (data: Omit<Client, "id" | "createdAt">) => void;
}

const emptyForm: Omit<Client, "id" | "createdAt"> = {
  name: "",
  cpf: "",
  email: "",
  phone: "",
  status: "lead",
};

export default function ClientFormModal({ open, client, onClose, onSave }: Props) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name,
        cpf: client.cpf,
        email: client.email,
        phone: client.phone,
        status: client.status,
      });
    } else {
      setForm(emptyForm);
    }
  }, [client, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const isValid = form.name.trim() && form.email.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{client ? "Editar Cliente" : "Novo Cliente"}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>
              Nome *
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome completo"
              />
            </label>
            <label>
              CPF
              <input
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </label>
            <label>
              Email *
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </label>
            <label>
              Telefone
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </label>
            <label>
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as Client["status"] })
                }
              >
                <option value="lead">Lead</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={!isValid}>
              {client ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
