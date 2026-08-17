import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  listarAtletas,
} from "../services/atletasService";

import {
  listarTodasPresencas,
  buscarResumoFinanceiro,
} from "../services/relatoriosService";

import {
  buscarConfiguracoes,
} from "../services/configuracoesService";

import {
  INICIO_MENSALIDADES,
  MESES,
  mesEhCobravel,
} from "../services/mensalidades.js";

export default function Relatorios() {
  const hoje = new Date();

  // ==========================================
  // PERÍODO INICIAL
  // ==========================================

  const mesInicial =
    hoje.getFullYear() <
      INICIO_MENSALIDADES.ano ||
    (
      hoje.getFullYear() ===
        INICIO_MENSALIDADES.ano &&
      hoje.getMonth() + 1 <
        INICIO_MENSALIDADES.mes
    )
      ? INICIO_MENSALIDADES.mes
      : hoje.getMonth() + 1;

  const anoInicial =
    hoje.getFullYear() <
    INICIO_MENSALIDADES.ano
      ? INICIO_MENSALIDADES.ano
      : hoje.getFullYear();

  // ==========================================
  // ESTADOS
  // ==========================================

  const [atletas, setAtletas] =
    useState([]);

  const [presencas, setPresencas] =
    useState([]);

  const [pagamentos, setPagamentos] =
    useState([]);

  const [valorRecebido, setValorRecebido] =
    useState(0);

  const [
    valorMensalidade,
    setValorMensalidade,
  ] = useState(20);

  const [carregando, setCarregando] =
    useState(true);

  const [
    mesSelecionado,
    setMesSelecionado,
  ] = useState(mesInicial);

  const [
    anoSelecionado,
    setAnoSelecionado,
  ] = useState(anoInicial);

  // ==========================================
  // MESES DISPONÍVEIS
  // ==========================================

  const mesesDisponiveis =
    MESES.map((nome, numero) => ({
      numero,
      nome,
    }))
      .filter(
        (mes) =>
          mes.numero > 0
      )
      .filter((mes) =>
        mesEhCobravel(
          mes.numero,
          anoSelecionado
        )
      );

  // ==========================================
  // AJUSTAR MÊS AO TROCAR ANO
  // ==========================================

  useEffect(() => {
    if (
      !mesEhCobravel(
        mesSelecionado,
        anoSelecionado
      )
    ) {
      setMesSelecionado(
        INICIO_MENSALIDADES.mes
      );
    }
  }, [
    anoSelecionado,
    mesSelecionado,
  ]);

  // ==========================================
  // CARREGAR DADOS
  // ==========================================

  useEffect(() => {
    async function carregarRelatorios() {
      try {
        setCarregando(true);

        const [
          dadosAtletas,
          dadosPresencas,
          resumoFinanceiro,
          configuracoes,
        ] = await Promise.all([
          listarAtletas(),

          listarTodasPresencas(),

          buscarResumoFinanceiro(
            mesSelecionado,
            anoSelecionado
          ),

          buscarConfiguracoes(),
        ]);

        setAtletas(
          dadosAtletas
        );

        setPresencas(
          dadosPresencas
        );

        setPagamentos(
          resumoFinanceiro.pagamentos
        );

        setValorRecebido(
          resumoFinanceiro.valorRecebido
        );

        setValorMensalidade(
          Number(
            configuracoes.mensalidade ||
              20
          )
        );
      } catch (erro) {
        console.error(
          "Erro ao carregar relatórios:",
          erro
        );
      } finally {
        setCarregando(false);
      }
    }

    if (
      mesEhCobravel(
        mesSelecionado,
        anoSelecionado
      )
    ) {
      carregarRelatorios();
    }
  }, [
    mesSelecionado,
    anoSelecionado,
  ]);

  // ==========================================
  // FUNÇÕES
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

  function gerarRelatorioPDF() {
    window.print();
  }

  function atletaEraCobravelNoPeriodo(
    atleta
  ) {
    if (!atleta.criadoEm) {
      return true;
    }

    try {
      let dataCadastro;

      if (
        typeof atleta.criadoEm
          ?.toDate === "function"
      ) {
        dataCadastro =
          atleta.criadoEm.toDate();
      } else {
        dataCadastro =
          new Date(
            atleta.criadoEm
          );
      }

      if (
        !dataCadastro ||
        Number.isNaN(
          dataCadastro.getTime()
        )
      ) {
        return true;
      }

      const mesCadastro =
        dataCadastro.getMonth() +
        1;

      const anoCadastro =
        dataCadastro.getFullYear();

      if (
        anoCadastro <
        anoSelecionado
      ) {
        return true;
      }

      if (
        anoCadastro >
        anoSelecionado
      ) {
        return false;
      }

      return (
        mesCadastro <=
        mesSelecionado
      );
    } catch (erro) {
      console.error(
        "Erro ao interpretar data de cadastro:",
        erro
      );

      return true;
    }
  }

  // ==========================================
  // FREQUÊNCIA
  // ==========================================

  const totalAtletas =
    atletas.length;

  const totalPresencas =
    presencas.filter(
      (presenca) =>
        presenca.presente === true
    ).length;

  const totalFaltas =
    presencas.filter(
      (presenca) =>
        presenca.presente === false
    ).length;

  const totalRegistros =
    presencas.length;

  const percentual =
    totalRegistros > 0
      ? Math.round(
          (
            totalPresencas /
            totalRegistros
          ) * 100
        )
      : 0;

  // ==========================================
  // CATEGORIAS
  // ==========================================

  const categorias = {};

  atletas.forEach(
    (atleta) => {
      const categoria =
        atleta.categoria ||
        "Sem categoria";

      if (
        !categorias[categoria]
      ) {
        categorias[categoria] = 0;
      }

      categorias[categoria]++;
    }
  );

  // ==========================================
  // FREQUÊNCIA POR ATLETA
  // ==========================================

  const frequenciaAtletas =
    atletas
      .map((atleta) => {
        const registros =
          presencas.filter(
            (presenca) =>
              presenca.atletaId ===
              atleta.id
          );

        const presentes =
          registros.filter(
            (presenca) =>
              presenca.presente ===
              true
          ).length;

        const faltas =
          registros.filter(
            (presenca) =>
              presenca.presente ===
              false
          ).length;

        const total =
          registros.length;

        const frequencia =
          total > 0
            ? Math.round(
                (
                  presentes /
                  total
                ) * 100
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
          b.frequencia -
          a.frequencia
      );

  const atletasComRegistros =
    frequenciaAtletas.filter(
      (atleta) =>
        atleta.total > 0
    );

  const melhorAtleta =
    atletasComRegistros.length >
    0
      ? atletasComRegistros[0]
      : null;

  // ==========================================
  // FINANCEIRO
  // ==========================================

  const atletasCobraveis =
    atletas.filter(
      atletaEraCobravelNoPeriodo
    );

  const pagamentosPagos =
    pagamentos.filter(
      (pagamento) =>
        pagamento.status ===
        "pago"
    );

  const atletasPagosIds =
    new Set(
      pagamentosPagos.map(
        (pagamento) =>
          pagamento.atletaId
      )
    );

  const totalPagos =
    atletasCobraveis.filter(
      (atleta) =>
        atletasPagosIds.has(
          atleta.id
        )
    ).length;

  const atletasPendentes =
    atletasCobraveis.filter(
      (atleta) =>
        !atletasPagosIds.has(
          atleta.id
        )
    );

  const totalPendentes =
    atletasPendentes.length;

  const mesNome =
    MESES[
      mesSelecionado
    ];

  // ==========================================
  // CARREGANDO
  // ==========================================

  if (carregando) {
    return (
      <MainLayout>

        <div className="dashboard-carregando">
          Carregando relatórios...
        </div>

      </MainLayout>
    );
  }

  // ==========================================
  // TELA
  // ==========================================

  return (
    <MainLayout>

      {/* ======================================
          CABEÇALHO EXCLUSIVO DO PDF
      ====================================== */}

      <div className="cabecalho-relatorio-pdf">

        <img
          src="/escudo-adc.png"
          alt="Escudo ADC"
          className="pdf-escudo"
        />

        <div className="pdf-instituicao">

          <span>
            ASSOCIAÇÃO DESPORTIVA CICYNHO
          </span>

          <h1>
            RELATÓRIO GERENCIAL
          </h1>

          <p>
            Controle financeiro e frequência
            de atletas
          </p>

        </div>

        <div className="pdf-periodo">

          <small>
            PERÍODO
          </small>

          <strong>
            {mesNome}/
            {anoSelecionado}
          </strong>

          <span>
            Mensalidade:{" "}
            {formatarDinheiro(
              valorMensalidade
            )}
          </span>

          <span>
            Emitido em{" "}
            {new Date().toLocaleDateString(
              "pt-BR"
            )}
          </span>

        </div>

      </div>

      {/* ======================================
          CABEÇALHO NORMAL
      ====================================== */}

      <div className="atletas-header relatorios-header">

        <div>

          <span className="dashboard-badge">
            ESTATÍSTICAS
          </span>

          <h1>
            Relatórios
          </h1>

          <p>
            Acompanhe desempenho,
            frequência e financeiro
            dos atletas da ADC.
          </p>

        </div>

        <button
          type="button"
          className="botao-gerar-relatorio"
          onClick={gerarRelatorioPDF}
        >
          📄 Gerar Relatório PDF
        </button>

      </div>

      {/* ======================================
          FILTRO FINANCEIRO
      ====================================== */}

      <div className="mensalidades-periodo">

        <div className="periodo-campo">

          <label>
            Mês
          </label>

          <select
            value={
              mesSelecionado
            }
            onChange={(e) =>
              setMesSelecionado(
                Number(
                  e.target.value
                )
              )
            }
          >

            {mesesDisponiveis.map(
              (mes) => (

                <option
                  key={
                    mes.numero
                  }
                  value={
                    mes.numero
                  }
                >
                  {mes.nome}
                </option>

              )
            )}

          </select>

        </div>

        <div className="periodo-campo">

          <label>
            Ano
          </label>

          <select
            value={
              anoSelecionado
            }
            onChange={(e) =>
              setAnoSelecionado(
                Number(
                  e.target.value
                )
              )
            }
          >

            <option value={2026}>
              2026
            </option>

            <option value={2027}>
              2027
            </option>

            <option value={2028}>
              2028
            </option>

          </select>

        </div>

        <div className="periodo-atual">

          <span>
            PERÍODO FINANCEIRO
          </span>

          <strong>
            💰 {mesNome}/
            {anoSelecionado}
          </strong>

          <small>
            Mensalidade atual:{" "}
            {formatarDinheiro(
              valorMensalidade
            )}
          </small>

        </div>

      </div>

      {/* ======================================
          CARDS FINANCEIROS
      ====================================== */}

      <div className="relatorios-cards">

        <div className="relatorio-card relatorio-azul">

          <div className="relatorio-icone">
            👥
          </div>

          <div>

            <span>
              Atletas cobrados
            </span>

            <strong>
              {
                atletasCobraveis.length
              }
            </strong>

          </div>

        </div>

        <div className="relatorio-card relatorio-verde">

          <div className="relatorio-icone">
            ✅
          </div>

          <div>

            <span>
              Mensalidades pagas
            </span>

            <strong>
              {totalPagos}
            </strong>

          </div>

        </div>

        <div className="relatorio-card relatorio-vermelho">

          <div className="relatorio-icone">
            ⚠️
          </div>

          <div>

            <span>
              Pendentes
            </span>

            <strong>
              {totalPendentes}
            </strong>

          </div>

        </div>

        <div className="relatorio-card relatorio-amarelo">

          <div className="relatorio-icone">
            💰
          </div>

          <div>

            <span>
              Recebido no mês
            </span>

            <strong>
              {formatarDinheiro(
                valorRecebido
              )}
            </strong>

          </div>

        </div>

      </div>

      {/* ======================================
          INADIMPLENTES
      ====================================== */}

      <div className="relatorio-ranking">

        <div className="relatorio-ranking-header">

          <div>

            <span className="box-mini-title">
              FINANCEIRO
            </span>

            <h2>
              Pendências de{" "}
              {mesNome}/
              {anoSelecionado}
            </h2>

            <p>
              Atletas sem pagamento
              registrado neste período.
            </p>

          </div>

        </div>

        {atletasPendentes.length ===
        0 ? (

          <div className="relatorio-vazio">
            ✅ Nenhuma pendência
            neste período.
          </div>

        ) : (

          <div className="tabela-container">

            <table className="tabela-atletas">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Atleta</th>
                  <th>Categoria</th>
                  <th>Responsável</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {atletasPendentes.map(
                  (
                    atleta,
                    index
                  ) => (

                    <tr
                      key={
                        atleta.id
                      }
                    >

                      <td>

                        <span className="ranking-posicao">
                          {index + 1}
                        </span>

                      </td>

                      <td>

                        <div className="ranking-atleta">

                          <div className="ranking-avatar">

                            {atleta.nome
                              ?.charAt(
                                0
                              )
                              .toUpperCase() ||
                              "A"}

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
                        {atleta.responsavel ||
                          "Não informado"}
                      </td>

                      <td>

                        <span className="status-mensalidade atrasada">
                          ● Pendente
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

      {/* ======================================
          CARDS DE PRESENÇA
      ====================================== */}

      <div className="relatorios-cards relatorios-presenca-bloco">

        <div className="relatorio-card relatorio-azul">

          <div className="relatorio-icone">
            👥
          </div>

          <div>

            <span>
              Total de atletas
            </span>

            <strong>
              {totalAtletas}
            </strong>

          </div>

        </div>

        <div className="relatorio-card relatorio-verde">

          <div className="relatorio-icone">
            ✅
          </div>

          <div>

            <span>
              Presenças
            </span>

            <strong>
              {totalPresencas}
            </strong>

          </div>

        </div>

        <div className="relatorio-card relatorio-vermelho">

          <div className="relatorio-icone">
            ❌
          </div>

          <div>

            <span>
              Faltas
            </span>

            <strong>
              {totalFaltas}
            </strong>

          </div>

        </div>

        <div className="relatorio-card relatorio-amarelo">

          <div className="relatorio-icone">
            📈
          </div>

          <div>

            <span>
              Frequência geral
            </span>

            <strong>
              {percentual}%
            </strong>

          </div>

        </div>

      </div>

      {/* ======================================
          GRID
      ====================================== */}

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
                Distribuição atual
                dos atletas
              </p>

            </div>

            <div className="relatorio-box-icone">
              👥
            </div>

          </div>

          {Object.keys(
            categorias
          ).length === 0 ? (

            <div className="relatorio-vazio">
              Nenhum atleta cadastrado.
            </div>

          ) : (

            <div className="relatorio-categorias">

              {Object.entries(
                categorias
              ).map(
                ([
                  categoria,
                  quantidade,
                ]) => {

                  const porcentagem =
                    totalAtletas > 0
                      ? Math.round(
                          (
                            quantidade /
                            totalAtletas
                          ) * 100
                        )
                      : 0;

                  return (

                    <div
                      className="relatorio-categoria-item"
                      key={
                        categoria
                      }
                    >

                      <div className="relatorio-categoria-topo">

                        <span>
                          {categoria}
                        </span>

                        <strong>
                          {quantidade}
                        </strong>

                      </div>

                      <div className="relatorio-barra">

                        <div
                          className="relatorio-barra-preenchida"
                          style={{
                            width:
                              `${porcentagem}%`,
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
                  ?.charAt(
                    0
                  )
                  .toUpperCase() ||
                  "A"}

              </div>

              <h2>
                {melhorAtleta.nome}
              </h2>

              <span className="destaque-categoria">

                {melhorAtleta.categoria ||
                  "Sem categoria"}

              </span>

              <strong className="destaque-percentual">
                {
                  melhorAtleta.frequencia
                }
                %
              </strong>

              <span className="destaque-legenda">
                de frequência
              </span>

              <div className="destaque-dados">

                <span>
                  ✅{" "}
                  {
                    melhorAtleta.presentes
                  }{" "}
                  presenças
                </span>

                <span>
                  ❌{" "}
                  {
                    melhorAtleta.faltas
                  }{" "}
                  faltas
                </span>

              </div>

            </div>

          ) : (

            <div className="relatorio-vazio">
              Ainda não existem
              registros de presença.
            </div>

          )}

        </div>

      </div>

      {/* ======================================
          RANKING DE FREQUÊNCIA
      ====================================== */}

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
              Ranking baseado nos
              registros de presença.
            </p>

          </div>

        </div>

        {frequenciaAtletas.length ===
        0 ? (

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
                  (
                    atleta,
                    index
                  ) => (

                    <tr
                      key={
                        atleta.id
                      }
                    >

                      <td>

                        <span className="ranking-posicao">
                          {index + 1}
                        </span>

                      </td>

                      <td>

                        <div className="ranking-atleta">

                          <div className="ranking-avatar">

                            {atleta.nome
                              ?.charAt(
                                0
                              )
                              .toUpperCase() ||
                              "A"}

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
                          {
                            atleta.presentes
                          }
                        </span>

                      </td>

                      <td>

                        <span className="ranking-falta">
                          {
                            atleta.faltas
                          }
                        </span>

                      </td>

                      <td>

                        <span
                          className={`ranking-frequencia ${
                            atleta.frequencia >=
                            75
                              ? "boa"
                              : atleta.frequencia >=
                                50
                              ? "media"
                              : "baixa"
                          }`}
                        >
                          {
                            atleta.frequencia
                          }
                          %
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