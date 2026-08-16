import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../services/firebase";

export default function Header() {
  const navigate = useNavigate();

  async function sair() {
    try {
      await signOut(auth);

      navigate("/");
    } catch (erro) {
      console.error(
        "Erro ao sair:",
        erro
      );

      alert(
        "Não foi possível sair do sistema."
      );
    }
  }

  return (
    <header className="main-header">

      <div className="header-titulo">
        <div>
          <h1>ADC Manager</h1>

          <span>
            Painel de gestão
          </span>
        </div>
      </div>

      <div className="header-direita">

        <div className="admin-info">

          <div className="admin-avatar">
            A
          </div>

          <div className="admin-dados">
            <strong>
              Administrador
            </strong>

            <span>
              <i></i>
              Online
            </span>
          </div>

        </div>

        <button
          className="botao-sair"
          onClick={sair}
        >
          🚪 Sair
        </button>

      </div>

    </header>
  );
}