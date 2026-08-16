import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

export default function Configuracoes() {
  const [nomeProjeto, setNomeProjeto] = useState(
    "Associação Desportiva Cicynho"
  );

  const [mensalidade, setMensalidade] = useState("20");
  const [telefone, setTelefone] = useState("");
  const [localTreino, setLocalTreino] = useState(
    "Campo Alternativo"
  );

  const [salvo, setSalvo] = useState(false);

  // CARREGAR CONFIGURAÇÕES SALVAS
  useEffect(() => {
    const configuracoesSalvas =
      localStorage.getItem("adc_configuracoes");

    if (configuracoesSalvas) {
      const dados = JSON.parse(configuracoesSalvas);

      setNomeProjeto(
        dados.nomeProjeto ||
          "Associação Desportiva Cicynho"
      );

      setMensalidade(
        dados.mensalidade || "20"
      );

      setTelefone(
        dados.telefone || ""
      );

      setLocalTreino(
        dados.localTreino ||
          "Campo Alternativo"
      );
    }
  }, []);

  function salvarConfiguracoes(e) {
    e.preventDefault();

    localStorage.setItem(
      "adc_configuracoes",
      JSON.stringify({
        nomeProjeto,
        mensalidade,
        telefone,
        localTreino,
      })
    );

    setSalvo(true);

    setTimeout(() => {
      setSalvo(false);
    }, 3000);
  }

  return (
    <MainLayout>
      {/* CABEÇALHO */}

      <div className="atletas-header">
        <div>
          <span className="dashboard-badge">
            ADMINISTRAÇÃO
          </span>

          <h1>Configurações</h1>

          <p>
            Gerencie as informações gerais do ADC Manager.
          </p>
        </div>
      </div>

      {/* MENSAGEM */}

      {salvo && (
        <div className="config-sucesso">
          <span>✓</span>

          <div>
            <strong>
              Configurações salvas
            </strong>

            <p>
              As informações foram atualizadas com sucesso.
            </p>
          </div>
        </div>
      )}

      {/* GRID PRINCIPAL */}

      <div className="config-grid">

        {/* FORMULÁRIO */}

        <form
          className="config-card"
          onSubmit={salvarConfiguracoes}
        >
          <div className="config-card-header">
            <div>
              <span className="box-mini-title">
                DADOS DA ADC
              </span>

              <h2>
                Informações da associação
              </h2>

              <p>
                Configure os dados utilizados pelo sistema.
              </p>
            </div>

            <div className="config-header-icon">
              ⚙️
            </div>
          </div>

          <div className="config-form-grid">

            {/* NOME */}

            <div className="config-campo config-campo-grande">
              <label>
                Nome do projeto
              </label>

              <input
                type="text"
                value={nomeProjeto}
                onChange={(e) =>
                  setNomeProjeto(
                    e.target.value
                  )
                }
                placeholder="Nome da ADC"
              />
            </div>

            {/* MENSALIDADE */}

            <div className="config-campo">
              <label>
                Valor da mensalidade
              </label>

              <div className="config-dinheiro">
                <span>R$</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={mensalidade}
                  onChange={(e) =>
                    setMensalidade(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* TELEFONE */}

            <div className="config-campo">
              <label>
                Telefone / WhatsApp
              </label>

              <input
                type="tel"
                value={telefone}
                onChange={(e) =>
                  setTelefone(
                    e.target.value
                  )
                }
                placeholder="(00) 00000-0000"
              />
            </div>

            {/* LOCAL */}

            <div className="config-campo config-campo-grande">
              <label>
                Local principal dos treinos
              </label>

              <input
                type="text"
                value={localTreino}
                onChange={(e) =>
                  setLocalTreino(
                    e.target.value
                  )
                }
                placeholder="Local dos treinos"
              />
            </div>

          </div>

          <div className="config-acoes">
            <button type="submit">
              💾 Salvar configurações
            </button>
          </div>
        </form>

        {/* PAINEL LATERAL */}

        <div className="config-lateral">

          <div className="config-info-card">
            <span className="box-mini-title">
              SISTEMA
            </span>

            <h2>
              ADC Manager
            </h2>

            <p>
              Sistema de gerenciamento da Associação
              Desportiva Cicynho.
            </p>

            <div className="config-info-lista">
              <div>
                <span>👥</span>

                <div>
                  <strong>Atletas</strong>
                  <small>
                    Cadastro e organização
                  </small>
                </div>
              </div>

              <div>
                <span>💰</span>

                <div>
                  <strong>Mensalidades</strong>
                  <small>
                    Controle financeiro
                  </small>
                </div>
              </div>

              <div>
                <span>⚽</span>

                <div>
                  <strong>Presença</strong>
                  <small>
                    Controle dos treinos
                  </small>
                </div>
              </div>

              <div>
                <span>📊</span>

                <div>
                  <strong>Relatórios</strong>
                  <small>
                    Estatísticas e frequência
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="config-versao">
            <span>🐊</span>

            <div>
              <strong>
                ADC Manager
              </strong>

              <small>
                Sistema de gestão
              </small>
            </div>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}