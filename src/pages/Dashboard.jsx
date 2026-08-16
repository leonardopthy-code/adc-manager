import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { buscarEstatisticas } from "../services/dashboardService";
<img
  src="/escudo-adc.png"
  alt=""
  className="dashboard-escudo-fundo"
/>

import {
  FaUsers,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaFutbol,
  FaArrowRight,
} from "react-icons/fa";

export default function Dashboard() {
  const [dados, setDados] = useState({
    totalAtletas: 0,
    emDia: 0,
    atrasados: 0,
    categorias: {},
    atletas: [],
  });

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const estatisticas = await buscarEstatisticas();
        setDados(estatisticas);
      } catch (error) {
        console.error("Erro ao carregar Dashboard:", error);
        setErro("Não foi possível carregar os dados.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []);

  const cards = [
    {
      titulo: "Total de Atletas",
      valor: dados.totalAtletas,
      icone: <FaUsers />,
      cor: "#0B2D6B",
      classe: "azul",
    },
    {
      titulo: "Mensalidades em Dia",
      valor: dados.emDia,
      icone: <FaMoneyBillWave />,
      cor: "#28a745",
      classe: "verde",
    },
    {
      titulo: "Mensalidades Atrasadas",
      valor: dados.atrasados,
      icone: <FaExclamationTriangle />,
      cor: "#dc3545",
      classe: "vermelho",
    },
    {
      titulo: "Treinos Hoje",
      valor: 1,
      icone: <FaFutbol />,
      cor: "#F5C400",
      classe: "amarelo",
    },
  ];

  return (
    <MainLayout>
      <div className="dashboard-page">

        {/* ESCUDO GIGANTE DE FUNDO */}

        <img
          src="/escudo-adc.png"
          alt=""
          className="dashboard-escudo-fundo"
        />

        {/* CONTEÚDO */}

        <div className="dashboard-conteudo">

          {/* CABEÇALHO */}

          <div className="dashboard-header">
            <div>
              <span className="dashboard-badge">
                PAINEL ADMINISTRATIVO
              </span>

              <h1>Dashboard</h1>

              <p>
                Bem-vindo ao <strong>ADC Manager</strong> 👋
              </p>
            </div>

            <div className="dashboard-data">
              <span>Visão geral</span>

              <strong>
                {new Date().toLocaleDateString("pt-BR")}
              </strong>
            </div>
          </div>

          {/* ERRO */}

          {erro && (
            <div className="dashboard-erro">
              {erro}
            </div>
          )}

          {/* CARREGANDO */}

          {carregando ? (
            <div className="dashboard-carregando">
              <FaFutbol className="loading-icon" />
              <span>Carregando informações...</span>
            </div>
          ) : (
            <>

              {/* CARDS */}

              <div className="dashboard-cards">

                {cards.map((card) => (
                  <div
                    key={card.titulo}
                    className={`stat-card stat-card-${card.classe}`}
                  >

                    <div
                      className="stat-icon"
                      style={{
                        color: card.cor,
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

                    </div>

                  </div>
                ))}

              </div>

              {/* GRID PRINCIPAL */}

              <div className="dashboard-grid">

                {/* CATEGORIAS */}

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

                  {Object.keys(dados.categorias).length === 0 ? (

                    <div className="dashboard-vazio">
                      <FaUsers />

                      <span>
                        Nenhum atleta cadastrado ainda.
                      </span>
                    </div>

                  ) : (

                    <div className="categorias-lista">

                      {Object.entries(dados.categorias).map(
                        ([categoria, quantidade]) => {

                          const porcentagem =
                            dados.totalAtletas > 0
                              ? (quantidade / dados.totalAtletas) * 100
                              : 0;

                          return (
                            <div
                              className="categoria-item"
                              key={categoria}
                            >

                              <div className="categoria-topo">

                                <span>
                                  {categoria || "Sem categoria"}
                                </span>

                                <strong>
                                  {quantidade}
                                </strong>

                              </div>

                              <div className="barra-fundo">

                                <div
                                  className="barra-progresso"
                                  style={{
                                    width: `${porcentagem}%`,
                                  }}
                                />

                              </div>

                              <small>
                                {Math.round(porcentagem)}% do elenco
                              </small>

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                </div>

                {/* ÚLTIMOS ATLETAS */}

                <div className="dashboard-box">

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

                  {dados.atletas.length === 0 ? (

                    <div className="dashboard-vazio">

                      <FaUsers />

                      <span>
                        Nenhum atleta cadastrado ainda.
                      </span>

                    </div>

                  ) : (

                    <div className="ultimos-atletas">

                      {dados.atletas
                        .slice(-5)
                        .reverse()
                        .map((atleta) => (

                          <div
                            className="ultimo-atleta"
                            key={atleta.id}
                          >

                            <div className="atleta-avatar">

                              {atleta.nome
                                ? atleta.nome
                                    .charAt(0)
                                    .toUpperCase()
                                : "A"}

                            </div>

                            <div className="atleta-info">

                              <strong>
                                {atleta.nome}
                              </strong>

                              <span>
                                {atleta.categoria ||
                                  "Sem categoria"}
                              </span>

                            </div>

                            <FaArrowRight className="atleta-seta" />

                          </div>

                        ))}

                    </div>

                  )}

                </div>

              </div>

            </>
          )}

        </div>

      </div>
    </MainLayout>
  );
}