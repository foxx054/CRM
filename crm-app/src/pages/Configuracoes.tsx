import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Configuracoes.css";

interface AppSettings {
  crmName: string;
  staleDays: number;
  stages: { key: string; label: string; color: string }[];
}

const defaultSettings: AppSettings = {
  crmName: "NovaCRM",
  staleDays: 14,
  stages: [
    { key: "atendimento", label: "Atendimento", color: "#378ADD" },
    { key: "orcamento", label: "Orçamento", color: "#EF9F27" },
    { key: "negociacao", label: "Negociação", color: "#D85A30" },
    { key: "venda_concluida", label: "Venda Concluída", color: "#1D9E75" },
    { key: "pos_venda", label: "Pós-Venda", color: "#3C3489" },
  ],
};

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem("crm_settings");
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export default function Configuracoes() {
  const { user, users, updateProfile, changePassword, addUser, removeUser } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [tab, setTab] = useState("perfil");

  // — Perfil
  const [name, setName] = useState(user?.name ?? "");
  const [role, setRole] = useState(user?.role ?? "");
  // — Senha
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  // — Novo usuário
  const [nuName, setNuName] = useState("");
  const [nuUser, setNuUser] = useState("");
  const [nuPass, setNuPass] = useState("");
  const [nuRole, setNuRole] = useState("");
  const [nuMsg, setNuMsg] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  // — Notificações
  const [staleDays, setStaleDays] = useState(settings.staleDays);
  // — CRM Name
  const [crmName, setCrmName] = useState(settings.crmName);
  // — Estágios
  const [stages, setStages] = useState(settings.stages);

  useEffect(() => { setName(user?.name ?? ""); setRole(user?.role ?? ""); }, [user]);

  function saveSettings(s: AppSettings) {
    setSettings(s);
    localStorage.setItem("crm_settings", JSON.stringify(s));
  }

  function handleProfile(e: React.FormEvent) {
    e.preventDefault();
    updateProfile(name, role);
    alert("Perfil atualizado!");
  }

  function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassMsg("");
    const ok = changePassword(curPass, newPass);
    if (ok) { setPassMsg("Senha alterada com sucesso!"); setCurPass(""); setNewPass(""); }
    else setPassMsg("Senha atual incorreta");
  }

  function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setNuMsg("");
    if (!nuUser || !nuPass || !nuName) { setNuMsg("Preencha todos os campos"); return; }
    const ok = addUser(nuUser, nuPass, nuName, nuRole || "Usuário");
    if (ok) { setNuMsg("Usuário cadastrado!"); setNuName(""); setNuUser(""); setNuPass(""); setNuRole(""); }
    else setNuMsg("Usuário já existe");
  }

  function handleNotifSave() {
    saveSettings({ ...settings, staleDays, crmName, stages });
    alert("Configurações salvas!");
  }

  function updateStage(index: number, field: string, value: string) {
    setStages((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  }

  const version = "1.0.0";

  return (
    <div className="config-page">
      <h1>Configurações</h1>
      <p className="subtitle">Personalize seu CRM</p>

      <div className="config-tabs">
        {["perfil", "senha", "usuarios", "notificacoes", "personalizar", "estagios", "backup", "sobre"].map((t) => (
          <button key={t} className={`config-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "perfil" ? "Perfil" : t === "senha" ? "Senha" : t === "usuarios" ? "Usuários" : t === "notificacoes" ? "Notificações" : t === "personalizar" ? "Personalizar" : t === "estagios" ? "Estágios" : t === "backup" ? "Backup" : "Sobre"}
          </button>
        ))}
      </div>

      <div className="config-content">
        {/* — Perfil — */}
        {tab === "perfil" && (
          <form onSubmit={handleProfile} className="config-form">
            <h2>Perfil do Usuário</h2>
            <label>Nome <input value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label>Cargo <input value={role} onChange={(e) => setRole(e.target.value)} /></label>
            <label>Usuário <input value={user?.username ?? ""} disabled /></label>
            <button type="submit" className="btn btn-primary">Salvar Perfil</button>
          </form>
        )}

        {/* — Senha — */}
        {tab === "senha" && (
          <form onSubmit={handlePassword} className="config-form">
            <h2>Alterar Senha</h2>
            <label>Senha atual <input type="password" value={curPass} onChange={(e) => setCurPass(e.target.value)} /></label>
            <label>Nova senha <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} /></label>
            <button type="submit" className="btn btn-primary">Alterar Senha</button>
            {passMsg && <p className="config-msg">{passMsg}</p>}
          </form>
        )}

        {/* — Usuários — */}
        {tab === "usuarios" && (
          <div className="config-form">
            {selectedUser ? (
              <>
                <div className="config-back-bar">
                  <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>← Voltar</button>
                </div>
                <h2>{selectedUser.name}</h2>
                <div className="config-user-detail">
                  <div className="detail-field">
                    <span className="detail-label">Usuário</span>
                    <span>{selectedUser.username}</span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-label">Cargo</span>
                    <span>{selectedUser.role}</span>
                  </div>
                  {selectedUser.username === user?.username && (
                    <p className="config-hint">Edite seu perfil na aba "Perfil"</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2>Gerenciar Usuários</h2>
                <div className="config-user-list">
                  {users.map((u) => (
                    <div key={u.username} className="config-user-row">
                      <button className="config-user-name-btn" onClick={() => setSelectedUser(u)}>
                        <strong>{u.name}</strong>
                        <span className="config-user-info">{u.username} · {u.role}</span>
                      </button>
                      {u.username !== user?.username && (
                        <button className="btn btn-secondary" onClick={() => { if (confirm(`Remover ${u.name}?`)) removeUser(u.username); }}>Remover</button>
                      )}
                    </div>
                  ))}
                </div>
                <hr />
                <h3>Adicionar Usuário</h3>
                <form onSubmit={handleAddUser} className="config-inline-form">
                  <label>Nome <input value={nuName} onChange={(e) => setNuName(e.target.value)} /></label>
                  <label>Usuário <input value={nuUser} onChange={(e) => setNuUser(e.target.value)} /></label>
                  <label>Senha <input type="password" value={nuPass} onChange={(e) => setNuPass(e.target.value)} /></label>
                  <label>Cargo <input value={nuRole} onChange={(e) => setNuRole(e.target.value)} placeholder="Usuário" /></label>
                  <button type="submit" className="btn btn-primary">Adicionar</button>
                </form>
                {nuMsg && <p className="config-msg">{nuMsg}</p>}
              </>
            )}
          </div>
        )}

        {/* — Notificações — */}
        {tab === "notificacoes" && (
          <div className="config-form">
            <h2>Notificações</h2>
            <label>
              Dias para considerar negócio "parado"
              <input type="number" value={staleDays} onChange={(e) => setStaleDays(Number(e.target.value))} min={1} />
            </label>
            <button className="btn btn-primary" onClick={handleNotifSave}>Salvar</button>
          </div>
        )}

        {/* — Personalizar — */}
        {tab === "personalizar" && (
          <div className="config-form">
            <h2>Personalização</h2>
            <label>
              Nome do CRM
              <input value={crmName} onChange={(e) => setCrmName(e.target.value)} />
            </label>
            <button className="btn btn-primary" onClick={handleNotifSave}>Salvar</button>
          </div>
        )}

        {/* — Estágios — */}
        {tab === "estagios" && (
          <div className="config-form">
            <h2>Estágios do Pipeline</h2>
            <p className="config-hint">Personalize os nomes e cores das colunas do kanban.</p>
            {stages.map((s, i) => (
              <div key={s.key} className="config-stage-row">
                <label>Nome <input value={s.label} onChange={(e) => updateStage(i, "label", e.target.value)} /></label>
                <label>Cor <input type="color" value={s.color} onChange={(e) => updateStage(i, "color", e.target.value)} /></label>
              </div>
            ))}
            <button className="btn btn-primary" onClick={handleNotifSave}>Salvar</button>
          </div>
        )}

        {/* — Backup — */}
        {tab === "backup" && (
          <div className="config-form">
            <h2>Backup / Exportar</h2>
            <p className="config-hint">Exporte seus dados para CSV ou JSON.</p>
            <div className="config-btns">
              <button className="btn btn-primary" onClick={() => alert("Funcionalidade de exportação será implementada em breve.")}>
                Exportar Clientes (CSV)
              </button>
              <button className="btn btn-secondary" onClick={() => alert("Funcionalidade de exportação será implementada em breve.")}>
                Exportar Negócios (CSV)
              </button>
            </div>
          </div>
        )}

        {/* — Sobre — */}
        {tab === "sobre" && (
          <div className="config-form">
            <h2>Sobre</h2>
            <div className="config-about">
              <p><strong>{crmName}</strong></p>
              <p>Versão {version}</p>
              <p className="config-hint">CRM desenvolvido para Lojas Becker</p>
              <p className="config-hint">React + TypeScript + Vite</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
