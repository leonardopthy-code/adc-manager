import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../services/firebase";

import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardCheck,
  FaChartBar,
} from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [carregando, setCarregando] =
    useState(false);

  async function entrar(e) {
    e.preventDefault();

    setErro("");

    if (!usuario.trim()) {
      setErro("Digite seu e-mail.");
      return;
    }

    if (!senha) {
      setErro("Digite sua senha.");
      return;
    }

    try {
      setCarregando(true);

      const credencial =
        await signInWithEmailAndPassword(
          auth,
          usuario.trim(),
          senha
        );

      console.log(
        "LOGIN REALIZADO:",
        credencial.user
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "ERRO FIREBASE:",
        error
      );

      console.error(
        "CÓDIGO DO ERRO:",
        error.code
      );

      console.error(
        "MENSAGEM:",
        error.message
      );

      setErro(
        `${error.code} - ${error.message}`
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">

      {/* DECORAÇÕES */}

      <div className="login-bola login-bola-1" />
      <div className="login-bola login-bola-2" />

      {/* ESCUDO GRANDE DE FUNDO */}

      <img
        src="/escudo-adc.png"
        alt=""
        className="login-escudo-fundo"
      />

      <div className="login-box">

        {/* PAINEL ESQUERDO */}

        <div className="login-apresentacao">

          <div className="login-marca">

            <img
              src="/escudo-adc.png"
              alt="Escudo da Associação Desportiva Cicynho"
            />

            <div>
              <span>
                ASSOCIAÇÃO DESPORTIVA
              </span>

              <h1>
                CICYNHO
              </h1>
            </div>

          </div>

          <div className="login-chamada">

            <span className="login-badge">
              ADC MANAGER
            </span>

            <h2>
              Gestão esportiva
              <br />
              em um só lugar.
            </h2>

            <p>
              Organize atletas, mensalidades,
              presenças e relatórios da ADC de
              maneira simples e eficiente.
            </p>

          </div>

          <div className="login-recursos">

            <div>
              <FaUsers />
              <span>Atletas</span>
            </div>

            <div>
              <FaMoneyBillWave />
              <span>Financeiro</span>
            </div>

            <div>
              <FaClipboardCheck />
              <span>Presença</span>
            </div>

            <div>
              <FaChartBar />
              <span>Relatórios</span>
            </div>

          </div>

          <div className="login-apresentacao-rodape">
            ADC Manager • Sistema de Gestão
          </div>

        </div>

        {/* FORMULÁRIO */}

        <div className="login-form-area">

          <div className="login-mobile-logo">

            <img
              src="/escudo-adc.png"
              alt="Escudo ADC"
            />

            <strong>
              ADC Manager
            </strong>

          </div>

          <div className="login-form-header">

            <span className="dashboard-badge">
              ÁREA ADMINISTRATIVA
            </span>

            <h2>
              Bem-vindo de volta
            </h2>

            <p>
              Entre com seu e-mail e senha
              cadastrados no sistema.
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={entrar}
          >

            {/* E-MAIL */}

            <div className="login-campo">

              <label>
                E-mail
              </label>

              <div className="login-input">

                <FaUser />

                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={usuario}
                  onChange={(e) =>
                    setUsuario(
                      e.target.value
                    )
                  }
                  autoComplete="username"
                />

              </div>

            </div>

            {/* SENHA */}

            <div className="login-campo">

              <label>
                Senha
              </label>

              <div className="login-input">

                <FaLock />

                <input
                  type={
                    mostrarSenha
                      ? "text"
                      : "password"
                  }
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) =>
                    setSenha(
                      e.target.value
                    )
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="login-ver-senha"
                  onClick={() =>
                    setMostrarSenha(
                      !mostrarSenha
                    )
                  }
                  aria-label={
                    mostrarSenha
                      ? "Ocultar senha"
                      : "Mostrar senha"
                  }
                >
                  {mostrarSenha ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* ERRO */}

            {erro && (
              <div className="login-erro">

                <span>
                  !
                </span>

                <div>
                  {erro}
                </div>

              </div>
            )}

            {/* ENTRAR */}

            <button
              type="submit"
              className="login-entrar"
              disabled={carregando}
            >

              <span>
                {carregando
                  ? "Entrando..."
                  : "Entrar no sistema"}
              </span>

              {!carregando && (
                <FaArrowRight />
              )}

            </button>

          </form>

          <div className="login-form-footer">

            <span>
              🐊 ADC Manager
            </span>

            <small>
              Associação Desportiva Cicynho
            </small>

          </div>

        </div>

      </div>
    </div>
  );
}