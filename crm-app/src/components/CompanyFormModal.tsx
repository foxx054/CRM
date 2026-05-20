import { useState, useEffect } from "react";
import type { Company } from "../types/company";

interface Props {
  open: boolean;
  company: Company | null;
  onClose: () => void;
  onSave: (data: Omit<Company, "id" | "createdAt">) => void;
}

const emptyForm: Omit<Company, "id" | "createdAt"> = {
  nomeFantasia: "",
  razaoSocial: "",
  cnpj: "",
  segmento: "",
  areasAtuacao: "",
  site: "",
  telefone: "",
  cidade: "",
  estado: "",
  pais: "Brasil",
  status: "active",
};

export default function CompanyFormModal({ open, company, onClose, onSave }: Props) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (company) {
      setForm({
        nomeFantasia: company.nomeFantasia,
        razaoSocial: company.razaoSocial,
        cnpj: company.cnpj,
        segmento: company.segmento,
        areasAtuacao: company.areasAtuacao,
        site: company.site,
        telefone: company.telefone,
        cidade: company.cidade,
        estado: company.estado,
        pais: company.pais,
        status: company.status,
      });
    } else {
      setForm(emptyForm);
    }
  }, [company, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const isValid = form.nomeFantasia.trim() && form.cnpj.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{company ? "Editar Empresa" : "Nova Empresa"}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-row">
              <label>
                Nome Fantasia *
                <input value={form.nomeFantasia} onChange={(e) => setForm({ ...form, nomeFantasia: e.target.value })} placeholder="Lojas Becker" />
              </label>
              <label>
                Razão Social
                <input value={form.razaoSocial} onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })} placeholder="LOJAS BECKER LTDA" />
              </label>
            </div>
            <div className="modal-row">
              <label>
                CNPJ *
                <input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} placeholder="00.000.000/0001-00" />
              </label>
              <label>
                Segmento
                <input value={form.segmento} onChange={(e) => setForm({ ...form, segmento: e.target.value })} placeholder="Varejo" />
              </label>
            </div>
            <label>
              Áreas de Atuação
              <input value={form.areasAtuacao} onChange={(e) => setForm({ ...form, areasAtuacao: e.target.value })} placeholder="móveis, eletrodomésticos, informática" />
            </label>
            <div className="modal-row">
              <label>
                Site
                <input value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} placeholder="https://www.lojasbecker.com.br" />
              </label>
              <label>
                Telefone
                <input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(55) 3359-3500" />
              </label>
            </div>
            <div className="modal-row triple">
              <label>
                Cidade
                <input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="Cerro Largo" />
              </label>
              <label>
                Estado
                <input value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} placeholder="Rio Grande do Sul" />
              </label>
              <label>
                País
                <input value={form.pais} onChange={(e) => setForm({ ...form, pais: e.target.value })} placeholder="Brasil" />
              </label>
            </div>
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Company["status"] })}>
                <option value="active">Ativa</option>
                <option value="inactive">Inativa</option>
              </select>
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={!isValid}>
              {company ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
