import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { listarAtletas } from "../services/atletasService";
import { listarTodasPresencas } from "../services/relatoriosService";

export default function Relatorios() {
  const [atletas, setAtletas] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarRelatorios() {
      try {
        const dadosAtletas = await listarAtletas();
        const dadosPresencas = await listarTodasPresencas();

        setAtletas(dadosAtletas);
        setPresencas(dadosPresencas);
      } catch (erro) {
        console.error(
          "Erro ao carregar relatórios:",
          erro
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarRelatorios();
  }, []);

  const totalAtletas = atletas.length;

  const totalPresencas = presencas.filter(
    (presenca) => presenca.presente === true
  ).length;

  const totalFaltas = presencas.filter(
    (presenca) => presenca.presente === false
  ).length;

  const totalRegistros = presencas.length;

  const percentual =
    totalRegistros > 0
      ? Math.round(
          (totalPresencas / totalRegistros) * 100
        )
      : 0;

  const categorias = {};

  atletas.forEach((atleta) => {
    const categoria =
      atleta.categoria || "Sem categoria";

    if (!categorias[categoria]) {
      categorias[categoria] = 0;
    }

    categorias[categoria]++;
  });

  const frequenciaAtletas = atletas
    .map((atleta) => {
      const registros = presencas.filter(
        (presenca) =>
          presenca.atletaId === atleta.id
      );

      const presentes = registros.filter(
        (presenca) =>
          presenca.presente === true
      ).length;

      const faltas = registros.filter(
        (presenca) =>
          presenca.presente === false
      ).length;

      const total = registros.length;

      const frequencia =
        total > 0
          ? Math.round(
              (presentes / total) * 100
            )
          : 0;

      return {
        ...atleta,
        presentes,
        faltas,
        total,
        frequencia,
      };
    })
    .sort(
      (a, b) =>
        b.frequencia - a.frequencia
    );

  const atletasComRegistros =
    frequenciaAtletas.filter(
      (atleta) => atleta.total > 0
    );

  const melhorAtleta =
    atletasComRegistros.length > 0
      ? atletasComRegistros[0]
      : null;

  if (carregando) {
    return (
      <MainLayout>
        <div className="dashboard-carregando">
          Carregando relatórios...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* CABEÇALHO */}

      <div className="atletas-header">
        <div>
          <span className="dashboard-badge">
            ESTATÍSTICAS
          </span>

          <h1>Relatórios</h1>

          <p>
            Acompanhe desempenho, frequência e
            distribuição dos atletas da ADC.
          </p>
        </div>
      </div>

      {/* CARDS */}

      <div className="relatorios-cards">

        <div className="relatorio-card relatorio-azul">
          <div className="relatorio-icone">
            👥
          </div>

          <div>
            <span>Total de atletas</span>
            <strong>{totalAtletas}</strong>
          </div>
        </div>

        <div className="relatorio-card relatorio-verde">
          <div className="relatorio-icone">
            ✅
          </div>

          <div>
            <span>Presenças</span>
            <strong>{totalPresencas}</strong>
          </div>
        </div>

        <div className="relatorio-card relatorio-vermelho">
          <div className="relatorio-icone">
            ❌
          </div>

          <div>
            <span>Faltas</span>
            <strong>{totalFaltas}</strong>
          </div>
        </div>

        <div className="relatorio-card relatorio-amarelo">
          <div className="relatorio-icone">
            📈
          </div>

          <div>
            <span>Frequência geral</span>
            <strong>{percentual}%</strong>
          </div>
        </div>

      </div>

      {/* GRID */}

      <div className="relatorios-grid">

        {/* CATEGORIAS */}

        <div className="relatorio-box">

          <div className="relatorio-box-header">
            <div>
              <span className="box-mini-title">
                ELENCO
              </span>

              <h2>
                Atletas por categoria
              </h2>

              <p>
                Distribuição atual dos atletas
              </p>
            </div>

            <div className="relatorio-box-icone">
              👥
            </div>
          </div>

          {Object.keys(categorias).length === 0 ? (
            <div className="relatorio-vazio">
              Nenhum atleta cadastrado.
            </div>
          ) : (
            <div className="relatorio-categorias">

              {Object.entries(categorias).map(
                ([categoria, quantidade]) => {
                  const porcentagem =
                    totalAtletas > 0
                      ? Math.round(
                          (quantidade /
                            totalAtletas) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      className="relatorio-categoria-item"
                      key={categoria}
                    >
                      <div className="relatorio-categoria-topo">
                        <span>{categoria}</span>

                        <strong>
                          {quantidade}
                        </strong>
                      </div>

                      <div className="relatorio-barra">
                        <div
                          className="relatorio-barra-preenchida"
                          style={{
                            width: `${porcentagem}%`,
                          }}
                        />
                      </div>

                      <small>
                        {porcentagem}% do elenco
                      </small>
                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

        {/* DESTAQUE */}

        <div className="relatorio-box">

          <div className="relatorio-box-header">
            <div>
              <span className="box-mini-title">
                DESTAQUE
              </span>

              <h2>
                Melhor frequência
              </h2>

              <p>
                Atleta com maior presença registrada
              </p>
            </div>

            <div className="relatorio-box-icone">
              🏆
            </div>
          </div>

          {melhorAtleta ? (
            <div className="relatorio-destaque">

              <div className="destaque-trofeu">
                🏆
              </div>

              <div className="destaque-avatar">
                {melhorAtleta.nome
                  ?.charAt(0)
                  .toUpperCase() || "A"}
              </div>

              <h2>
                {melhorAtleta.nome}
              </h2>

              <span className="destaque-categoria">
                {melhorAtleta.categoria ||
                  "Sem categoria"}
              </span>

              <strong className="destaque-percentual">
                {melhorAtleta.frequencia}%
              </strong>

              <span className="destaque-legenda">
                de frequência
              </span>

              <div className="destaque-dados">
                <span>
                  ✅ {melhorAtleta.presentes} presenças
                </span>

                <span>
                  ❌ {melhorAtleta.faltas} faltas
                </span>
              </div>

            </div>
          ) : (
            <div className="relatorio-vazio">
              Ainda não existem registros de
              presença.
            </div>
          )}

        </div>

      </div>

      {/* RANKING */}

      <div className="relatorio-ranking">

        <div className="relatorio-ranking-header">
          <div>
            <span className="box-mini-title">
              DESEMPENHO
            </span>

            <h2>
              Frequência dos atletas
            </h2>

            <p>
              Ranking baseado nos registros de
              presença.
            </p>
          </div>
        </div>

        {frequenciaAtletas.length === 0 ? (
          <div className="relatorio-vazio">
            Nenhum atleta cadastrado.
          </div>
        ) : (
          <div className="tabela-container">
            <table className="tabela-atletas">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Atleta</th>
                  <th>Categoria</th>
                  <th>Presenças</th>
                  <th>Faltas</th>
                  <th>Frequência</th>
                </tr>
              </thead>

              <tbody>
                {frequenciaAtletas.map(
                  (atleta, index) => (
                    <tr key={atleta.id}>

                      <td>
                        <span className="ranking-posicao">
                          {index + 1}
                        </span>
                      </td>

                      <td>
                        <div className="ranking-atleta">
                          <div className="ranking-avatar">
                            {atleta.nome
                              ?.charAt(0)
                              .toUpperCase() || "A"}
                          </div>

                          <strong>
                            {atleta.nome}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <span className="badge-categoria">
                          {atleta.categoria ||
                            "Sem categoria"}
                        </span>
                      </td>

                      <td>
                        <span className="ranking-presente">
                          {atleta.presentes}
                        </span>
                      </td>

                      <td>
                        <span className="ranking-falta">
                          {atleta.faltas}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`ranking-frequencia ${
                            atleta.frequencia >= 75
                              ? "boa"
                              : atleta.frequencia >= 50
                              ? "media"
                              : "baixa"
                          }`}
                        >
                          {atleta.frequencia}%
                        </span>
                      </td>

                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </MainLayout>
  );
}