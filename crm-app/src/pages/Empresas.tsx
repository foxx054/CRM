import { useState } from "react";
import type { Company } from "../types/company";
import { useData } from "../contexts/DataContext";
import CompanyFormModal from "../components/CompanyFormModal";
import "../components/ClientFormModal.css";
import "./Empresas.css";

export default function Empresas() {
  const { companies, setCompanies } = useData();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const filtered = companies.filter((c) =>
    [c.nomeFantasia, c.razaoSocial, c.cnpj, c.segmento, c.cidade, c.estado].some((f) =>
      f.toLowerCase().includes(search.toLowerCase())
    )
  );

  function handleSave(data: Omit<Company, "id" | "createdAt">) {
    if (editingCompany) {
      setCompanies((prev) => prev.map((c) => (c.id === editingCompany.id ? { ...c, ...data } : c)));
    } else {
      const newCompany: Company = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setCompanies((prev) => [newCompany, ...prev]);
    }
  }

  function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir esta empresa?")) {
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    }
  }

  function openEdit(company: Company) { setEditingCompany(company); setModalOpen(true); }
  function openCreate() { setEditingCompany(null); setModalOpen(true); }

  return (
    <div className="empresas-page">
      <div className="empresas-header">
        <div>
          <h1>Empresas</h1>
          <p className="subtitle">{companies.length} empresas cadastradas</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nova Empresa</button>
      </div>

      <div className="search-bar">
        <input placeholder="Buscar por nome fantasia, razão social, CNPJ, cidade..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nome Fantasia</th>
              <th>Razão Social</th>
              <th>CNPJ</th>
              <th>Segmento</th>
              <th>Atuação</th>
              <th>Cidade</th>
              <th>Telefone</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((company) => (
              <tr key={company.id}>
                <td className="cell-name">{company.nomeFantasia}</td>
                <td>{company.razaoSocial}</td>
                <td className="cell-cnpj">{company.cnpj}</td>
                <td>{company.segmento}</td>
                <td className="cell-areas">{company.areasAtuacao}</td>
                <td>{company.cidade} - {company.estado}</td>
                <td>{company.telefone}</td>
                <td>
                  <span className={`status status-${company.status}`}>
                    {company.status === "active" ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td className="cell-actions">
                  <button className="btn-icon" onClick={() => openEdit(company)} title="Editar">✏️</button>
                  <button className="btn-icon" onClick={() => handleDelete(company.id)} title="Excluir">🗑️</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={9} className="empty">Nenhuma empresa encontrada</td></tr>}
          </tbody>
        </table>
      </div>

      <CompanyFormModal open={modalOpen} company={editingCompany} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  );
}
