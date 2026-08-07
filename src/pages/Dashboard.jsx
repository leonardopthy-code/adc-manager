import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { buscarEstatisticas } from "../services/dashboardService";

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
      icone: "👥",
      cor: "#0B2D6B",
    },
    {
      titulo: "Mensalidades em Dia",
      valor: dados.emDia,
      icone: "💰",
      cor: "#28a745",
    },
    {
      titulo: "Mensalidades Atrasadas",
      valor: dados.atrasados,
      icone: "⚠️",
      cor: "#dc3545",
    },
    {
      titulo: "Treinos Hoje",
      valor: 1,
      icone: "⚽",
      cor: "#F5C400",
    },
  ];

  return (
    <MainLayout>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Bem-vindo ao <strong>ADC Manager</strong> 👋
          </p>
        </div>
      </div>

      {erro && (
        <div className="dashboard-erro">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="dashboard-carregando">
          Carregando informações...
        </div>
      ) : (
        <>
          <div className="dashboard-cards">
            {cards.map((card) => (
              <div
                key={card.titulo}
                className="stat-card"
                style={{
                  borderLeft: `6px solid ${card.cor}`,
                }}
              >
                <div
                  className="stat-icon"
                  style={{
                    background: `${card.cor}15`,
                  }}
                >
                  {card.icone}
                </div>

                <div>
                  <p>{card.titulo}</p>

                  <h2
                    style={{
                      color: card.cor,
                    }}
                  >
                    {card.valor}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-box">
              <div className="dashboard-box-header">
                <div>
                  <h2>Atletas por categoria</h2>
                  <p>Distribuição dos atletas cadastrados</p>
                </div>
              </div>

              {Object.keys(dados.categorias).length === 0 ? (
                <div className="dashboard-vazio">
                  Nenhum atleta cadastrado ainda.
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
                            <span>{categoria || "Sem categoria"}</span>

                            <strong>{quantidade}</strong>
                          </div>

                          <div className="barra-fundo">
                            <div
                              className="barra-progresso"
                              style={{
                                width: `${porcentagem}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            <div className="dashboard-box">
              <div className="dashboard-box-header">
                <div>
                  <h2>Últimos atletas</h2>
                  <p>Atletas cadastrados recentemente</p>
                </div>
              </div>

              {dados.atletas.length === 0 ? (
                <div className="dashboard-vazio">
                  Nenhum atleta cadastrado ainda.
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
                          <strong>{atleta.nome}</strong>

                          <span>
                            {atleta.categoria ||
                              "Sem categoria"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}