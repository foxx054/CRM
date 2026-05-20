import { useState, useEffect } from "react";
import type { Deal, DealStage } from "../types/deal";
import { stageLabels } from "../types/deal";

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
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (deal) {
      setForm({
        title: deal.title,
        company: deal.company,
        value: deal.value,
        stage: deal.stage,
        contactName: deal.contactName,
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
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Site institucional"
              />
            </label>
            <label>
              Empresa *
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Nome da empresa"
              />
            </label>
            <label>
              Contato
              <input
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                placeholder="Nome do contato"
              />
            </label>
            <label>
              Valor
              <input
                type="number"
                value={form.value || ""}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                placeholder="15000"
              />
            </label>
            <label>
              Estágio
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value as DealStage })}
              >
                {Object.entries(stageLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={!isValid}>
              {deal ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
