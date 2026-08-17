import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import {
  buscarEstatisticas,
} from "../services/dashboardService";

import {
  buscarConfiguracoes,
} from "../services/configuracoesService";

import {
  FaUsers,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaWallet,
  FaFutbol,
  FaArrowRight,
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    totalAtletas: 0,
    totalCobraveis: 0,
    emDia: 0,
    atrasados: 0,
    valorRecebido: 0,
    mesAtual: 0,
    mesNome: "",
    anoAtual: 0,
    categorias: {},
    atletas: [],
    atletasPendentes: [],
  });

  const [
    valorMensalidade,
    setValorMensalidade,
  ] = useState(20);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState("");

  // ==========================================
  // CARREGAR DASHBOARD
  // ==========================================

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setCarregando(true);

        const [
          estatisticas,
          configuracoes,
        ] = await Promise.all([
          buscarEstatisticas(),
          buscarConfiguracoes(),
        ]);

        setDados(
          estatisticas
        );

        setValorMensalidade(
          Number(
            configuracoes.mensalidade ||
              20
          )
        );
      } catch (error) {
        console.error(
          "Erro ao carregar Dashboard:",
          error
        );

        setErro(
          "Não foi possível carregar os dados."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []);

  // ==========================================
  // FORMATAR DINHEIRO
  // ==========================================

  function formatarDinheiro(
    valor
  ) {
    return Number(
      valor || 0
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  // ==========================================
  // CARDS
  // ==========================================

  const cards = [
    {
      titulo:
        "Total de Atletas",

      valor:
        dados.totalAtletas,

      icone:
        <FaUsers />,

      cor:
        "#0B2D6B",

      classe:
        "azul",

      detalhe:
        "Cadastrados no sistema",
    },

    {
      titulo:
        "Pagaram no mês",

      valor:
        dados.emDia,

      icone:
        <FaMoneyBillWave />,

      cor:
        "#28a745",

      classe:
        "verde",

      detalhe:
        dados.mesNome
          ? `${dados.mesNome}/${dados.anoAtual}`
          : "Período atual",
    },

    {
      titulo:
        "Pendentes no mês",

      valor:
        dados.atrasados,

      icone:
        <FaExclamationTriangle />,

      cor:
        "#dc3545",

      classe:
        "vermelho",

      detalhe:
        dados.mesNome
          ? `${dados.mesNome}/${dados.anoAtual}`
          : "Período atual",
    },

    {
      titulo:
        "Recebido no mês",

      valor:
        formatarDinheiro(
          dados.valorRecebido
        ),

      icone:
        <FaWallet />,

      cor:
        "#F5C400",

      classe:
        "amarelo",

      detalhe:
        dados.mesNome
          ? `${dados.mesNome}/${dados.anoAtual}`
          : "Período atual",
    },
  ];

  // ==========================================
  // TELA
  // ==========================================

  return (
    <MainLayout>

      <div className="dashboard-page">

        {/* ESCUDO DE FUNDO */}

        <img
          src="/escudo-adc.png"
          alt=""
          className="dashboard-escudo-fundo"
        />

        <div className="dashboard-conteudo">

          {/* =================================
              CABEÇALHO
          ================================= */}

          <div className="dashboard-header">

            <div>

              <span className="dashboard-badge">
                PAINEL ADMINISTRATIVO
              </span>

              <h1>
                Dashboard
              </h1>

              <p>
                Bem-vindo ao{" "}
                <strong>
                  ADC Manager
                </strong>{" "}
                👋
              </p>

            </div>

            <div className="dashboard-data">

              <span>
                Visão geral
              </span>

              <strong>
                {new Date().toLocaleDateString(
                  "pt-BR"
                )}
              </strong>

            </div>

          </div>

          {/* =================================
              PERÍODO FINANCEIRO
          ================================= */}

          {!carregando &&
            dados.mesNome && (

              <div className="dashboard-periodo-financeiro">

                <div>

                  <span>
                    💰
                  </span>

                  <div>

                    <strong>
                      Financeiro de{" "}
                      {dados.mesNome}/
                      {dados.anoAtual}
                    </strong>

                    <p>
                      {dados.emDia} pago(s) e{" "}
                      {dados.atrasados} pendente(s)
                      entre{" "}
                      {dados.totalCobraveis} atleta(s)
                      cobrados neste período.
                      {" "}
                      Mensalidade atual:{" "}

                      <strong>
                        {formatarDinheiro(
                          valorMensalidade
                        )}
                      </strong>
                    </p>

                  </div>

                </div>

              </div>

            )}

          {/* ERRO */}

          {erro && (

            <div className="dashboard-erro">
              {erro}
            </div>

          )}

          {/* =================================
              CARREGANDO
          ================================= */}

          {carregando ? (

            <div className="dashboard-carregando">

              <FaFutbol
                className="loading-icon"
              />

              <span>
                Carregando informações...
              </span>

            </div>

          ) : (

            <>

              {/* =================================
                  CARDS
              ================================= */}

              <div className="dashboard-cards">

                {cards.map(
                  (card) => (

                    <div
                      key={
                        card.titulo
                      }
                      className={`stat-card stat-card-${card.classe}`}
                    >

                      <div
                        className="stat-icon"
                        style={{
                          color:
                            card.cor,
                        }}
                      >
                        {card.icone}
                      </div>

                      <div className="stat-info">

                        <span>
                          {card.titulo}
                        </span>

                        <h2>
                          {card.valor}
                        </h2>

                        <small className="stat-detalhe">
                          {card.detalhe}
                        </small>

                      </div>

                    </div>

                  )
                )}

              </div>

              {/* =================================
                  GRID PRINCIPAL
              ================================= */}

              <div className="dashboard-grid">

                {/* =================================
                    CATEGORIAS
                ================================= */}

                <div className="dashboard-box">

                  <div className="dashboard-box-header">

                    <div>

                      <span className="box-mini-title">
                        ELENCO
                      </span>

                      <h2>
                        Atletas por categoria
                      </h2>

                      <p>
                        Distribuição dos atletas cadastrados
                      </p>

                    </div>

                    <div className="box-icon">
                      <FaUsers />
                    </div>

                  </div>

                  {Object.keys(
                    dados.categorias
                  ).length === 0 ? (

                    <div className="dashboard-vazio">

                      <FaUsers />

                      <span>
                        Nenhum atleta cadastrado ainda.
                      </span>

                    </div>

                  ) : (

                    <div className="categorias-lista">

                      {Object.entries(
                        dados.categorias
                      ).map(
                        ([
                          categoria,
                          quantidade,
                        ]) => {

                          const porcentagem =
                            dados.totalAtletas >
                            0
                              ? (
                                  quantidade /
                                  dados.totalAtletas
                                ) *
                                100
                              : 0;

                          return (

                            <div
                              className="categoria-item"
                              key={
                                categoria
                              }
                            >

                              <div className="categoria-topo">

                                <span>
                                  {categoria ||
                                    "Sem categoria"}
                                </span>

                                <strong>
                                  {quantidade}
                                </strong>

                              </div>

                              <div className="barra-fundo">

                                <div
                                  className="barra-progresso"
                                  style={{
                                    width:
                                      `${porcentagem}%`,
                                  }}
                                />

                              </div>

                              <small>
                                {Math.round(
                                  porcentagem
                                )}
                                % do elenco
                              </small>

                            </div>

                          );
                        }
                      )}

                    </div>

                  )}

                </div>

                {/* =================================
                    PENDÊNCIAS
                ================================= */}

                <div className="dashboard-box">

                  <div className="dashboard-box-header">

                    <div>

                      <span className="box-mini-title">
                        FINANCEIRO
                      </span>

                      <h2>
                        Pendências do mês
                      </h2>

                      <p>
                        {dados.mesNome}/
                        {dados.anoAtual}
                      </p>

                    </div>

                    <div className="box-icon dashboard-box-icon-alerta">
                      <FaExclamationTriangle />
                    </div>

                  </div>

                  {dados.atletasPendentes
                    .length === 0 ? (

                    <div className="dashboard-pagamentos-ok">

                      <div>
                        ✅
                      </div>

                      <strong>
                        Tudo em dia!
                      </strong>

                      <span>
                        Nenhuma mensalidade pendente neste mês.
                      </span>

                    </div>

                  ) : (

                    <div className="dashboard-pendentes-lista">

                      {dados.atletasPendentes
                        .slice(0, 6)
                        .map(
                          (atleta) => (

                            <button
                              type="button"
                              className="dashboard-pendente-item"
                              key={
                                atleta.id
                              }
                              onClick={() =>
                                navigate(
                                  `/atletas/${atleta.id}`
                                )
                              }
                            >

                              <div className="pendente-avatar">

                                {atleta.nome
                                  ?.charAt(
                                    0
                                  )
                                  .toUpperCase() ||
                                  "A"}

                              </div>

                              <div className="pendente-info">

                                <strong>
                                  {
                                    atleta.nome
                                  }
                                </strong>

                                <span>
                                  {atleta.categoria ||
                                    "Sem categoria"}
                                </span>

                              </div>

                              <span className="pendente-status">
                                Pendente
                              </span>

                              <FaArrowRight
                                className="atleta-seta"
                              />

                            </button>

                          )
                        )}

                      {dados.atletasPendentes
                        .length > 6 && (

                        <div className="dashboard-pendentes-restante">

                          +
                          {dados.atletasPendentes
                            .length -
                            6}{" "}
                          atleta(s) pendente(s)

                        </div>

                      )}

                    </div>

                  )}

                </div>

              </div>

              {/* =================================
                  ÚLTIMOS ATLETAS
              ================================= */}

              <div className="dashboard-box dashboard-ultimos-box">

                <div className="dashboard-box-header">

                  <div>

                    <span className="box-mini-title">
                      CADASTROS
                    </span>

                    <h2>
                      Últimos atletas
                    </h2>

                    <p>
                      Atletas cadastrados recentemente
                    </p>

                  </div>

                  <div className="box-icon">
                    <FaUsers />
                  </div>

                </div>

                {dados.atletas.length ===
                0 ? (

                  <div className="dashboard-vazio">

                    <FaUsers />

                    <span>
                      Nenhum atleta cadastrado ainda.
                    </span>

                  </div>

                ) : (

                  <div className="dashboard-ultimos-grid">

                    {dados.atletas
                      .slice(-6)
                      .reverse()
                      .map(
                        (atleta) => (

                          <button
                            type="button"
                            className="dashboard-ultimo-card"
                            key={
                              atleta.id
                            }
                            onClick={() =>
                              navigate(
                                `/atletas/${atleta.id}`
                              )
                            }
                          >

                            <div className="atleta-avatar">

                              {atleta.nome
                                ? atleta.nome
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()
                                : "A"}

                            </div>

                            <div className="atleta-info">

                              <strong>
                                {
                                  atleta.nome
                                }
                              </strong>

                              <span>
                                {atleta.categoria ||
                                  "Sem categoria"}
                              </span>

                            </div>

                            <FaArrowRight
                              className="atleta-seta"
                            />

                          </button>

                        )
                      )}

                  </div>

                )}

              </div>

            </>

          )}

        </div>

      </div>

    </MainLayout>
  );
}