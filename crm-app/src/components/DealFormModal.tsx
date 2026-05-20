import { useState, useEffect } from "react";
import type { Deal, DealStage } from "../types/deal";
import { stageLabels } from "../types/deal";
import { useData } from "../contexts/DataContext";

interface Props {
  open: boolean;
  deal: Deal | null;
  onClose: () => void;
  onSave: (data: Omit<Deal, "id" | "createdAt">) => void;
}

const emptyForm: Omit<Deal, "id" | "createdAt"> = {
  title: "",
  company: "",
  value: 0,
  stage: "atendimento",
  contactName: "",
};

export default function DealFormModal({ open, deal, onClose, onSave }: Props) {
  const { clients, companies } = useData();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (deal) {
      setForm({
        title: deal.title,
        company: deal.company,
        value: deal.value,
        stage: deal.stage,
        contactName: deal.contactName,
        clientId: deal.clientId,
        companyId: deal.companyId,
      });
    } else {
      setForm(emptyForm);
    }
  }, [deal, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const isValid = form.title.trim() && form.company.trim();

  function onClientSelect(clientId: string) {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setForm({ ...form, clientId, contactName: client.name });
    }
  }

  function onCompanySelect(companyId: string) {
    const company = companies.find((c) => c.id === companyId);
    if (company) {
      setForm({ ...form, companyId, company: company.nomeFantasia });
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{deal ? "Editar Negócio" : "Novo Negócio"}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>
              Título *
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Site institucional" />
            </label>
            <div className="modal-row">
              <label>
                Cliente
                <select value={form.clientId || ""} onChange={(e) => onClientSelect(e.target.value)}>
                  <option value="">Selecione um cliente</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label>
                Empresa
                <select value={form.companyId || ""} onChange={(e) => onCompanySelect(e.target.value)}>
                  <option value="">Selecione uma empresa</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.nomeFantasia}</option>)}
                </select>
              </label>
            </div>
            <label>
              Contato
              <input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="Nome do contato" />
            </label>
            <label>
              Valor (R$)
              <input type="number" value={form.value || ""} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} placeholder="15000" />
            </label>
            <label>
              Estágio
              <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as DealStage })}>
                {Object.entries(stageLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={!isValid}>{deal ? "Salvar" : "Criar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
