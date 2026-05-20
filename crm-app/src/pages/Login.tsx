import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { IconChartDots } from "@tabler/icons-react";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    const ok = login(username, password);
    if (!ok) setError(true);
    else navigate("/", { replace: true });
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <IconChartDots size={24} />
          </div>
          NovaCRM
        </div>
        <p className="login-subtitle">Faça login para continuar</p>
        <form onSubmit={handleSubmit}>
          <label>
            Usuário
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Seu usuário"
              autoFocus
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
            />
          </label>
          {error && <span className="login-error">Usuário ou senha inválidos</span>}
          <button type="submit" className="btn btn-primary login-btn">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
