import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🐊 ADC Manager</h1>

        <p>Associação Desportiva Cicynho</p>

        <input
          type="text"
          placeholder="Usuário"
        />

        <input
          type="password"
          placeholder="Senha"
        />

        <button onClick={() => navigate("/dashboard")}>
          Entrar
        </button>
      </div>
    </div>
  );
}