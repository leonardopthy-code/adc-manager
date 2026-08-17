import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import {
  buscarAtletaPorId,
  buscarPagamentosDoAtleta,
} from "../services/atletasService";

import {
  buscarPresencasDoAtleta,
} from "../services/presencaService";

import {
  INICIO_MENSALIDADES,
  MESES,
  gerarMesesCobraveis,
} from "../services/mensalidades";

export default function DetalhesAtleta() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [atleta, setAtleta] =
    useState(null);

  const [presencas, setPresencas] =
    useState([]);

  const [pagamentos, setPagamentos] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState("");

  // ========================================
  // CARREGAR DADOS
  // ========================================

  useEffect(() => {
    async function carregarDados() {
      try {
        const [
          dadosAtleta,
          dadosPresencas,
          dadosPagamentos,
        ] = await Promise.all([
          buscarAtletaPorId(id),
          buscarPresencasDoAtleta(id),
          buscarPagamentosDoAtleta(id),
        ]);

        if (!dadosAtleta) {
          setErro(
            "Atleta não encontrado."
          );

          return;
        }

        setAtleta(dadosAtleta);

        setPresencas(
          dadosPresencas
        );

        setPagamentos(
          dadosPagamentos
        );
      } catch (erro) {
        console.error(
          "Erro ao carregar ficha do atleta:",
          erro
        );

        setErro(
          "Não foi possível carregar a ficha do atleta."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id]);

  // ========================================
  // FUNÇÕES AUXILIARES
  // ========================================

  function calcularIdade(
    nascimento
  ) {
    if (!nascimento) {
      return "Não informada";
    }

    const hoje = new Date();

    const dataNascimento =
      new Date(
        `${nascimento}T00:00:00`
      );

    let idade =
      hoje.getFullYear() -
      dataNascimento.getFullYear();

    const mes =
      hoje.getMonth() -
      dataNascimento.getMonth();

    if (
      mes < 0 ||
      (mes === 0 &&
        hoje.getDate() <
          dataNascimento.getDate())
    ) {
      idade--;
    }

    return `${idade} anos`;
  }

  function formatarData(data) {
    if (!data) {
      return "Data não informada";
    }

    const partes =
      data.split("-");

    if (
      partes.length !== 3
    ) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

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

  // ========================================
  // PRESENÇA
  // ========================================

  const totalRegistros =
    presencas.length;

  const totalPresentes =
    presencas.filter(
      (presenca) =>
        presenca.presente === true
    ).length;

  const totalFaltas =
    presencas.filter(
      (presenca) =>
        presenca.presente === false
    ).length;

  const frequencia =
    totalRegistros > 0
      ? Math.round(
          (
            totalPresentes /
            totalRegistros
          ) * 100
        )
      : 0;

  // ========================================
  // FINANCEIRO AUTOMÁTICO
  // ========================================

  const hoje =
    new Date();

  const mesAtual =
    hoje.getMonth() + 1;

  const anoAtual =
    hoje.getFullYear();

  // ----------------------------------------
  // Descobrir quando o atleta começou
  // ----------------------------------------

  let mesInicioAtleta =
    INICIO_MENSALIDADES.mes;

  let anoInicioAtleta =
    INICIO_MENSALIDADES.ano;

  if (
    atleta?.criadoEm
  ) {
    try {
      let dataCadastro;

      // Timestamp do Firebase
      if (
        typeof atleta.criadoEm
          ?.toDate === "function"
      ) {
        dataCadastro =
          atleta.criadoEm.toDate();
      }

      // Caso seja uma data normal
      else {
        dataCadastro =
          new Date(
            atleta.criadoEm
          );
      }

      if (
        dataCadastro &&
        !Number.isNaN(
          dataCadastro.getTime()
        )
      ) {
        const mesCadastro =
          dataCadastro.getMonth() +
          1;

        const anoCadastro =
          dataCadastro.getFullYear();

        const cadastroDepoisDoInicio =
          anoCadastro >
            INICIO_MENSALIDADES.ano ||
          (
            anoCadastro ===
              INICIO_MENSALIDADES.ano &&
            mesCadastro >
              INICIO_MENSALIDADES.mes
          );

        if (
          cadastroDepoisDoInicio
        ) {
          mesInicioAtleta =
            mesCadastro;

          anoInicioAtleta =
            anoCadastro;
        }
      }
    } catch (erro) {
      console.error(
        "Erro ao interpretar data de cadastro:",
        erro
      );
    }
  }

  // ----------------------------------------
  // Gerar todos os meses até hoje
  // ----------------------------------------

  const todosMesesCobraveis =
    gerarMesesCobraveis(
      mesAtual,
      anoAtual
    );

  // ----------------------------------------
  // Remover meses anteriores à entrada
  // ----------------------------------------

  const mesesDoAtleta =
    todosMesesCobraveis.filter(
      (periodo) => {
        if (
          periodo.ano >
          anoInicioAtleta
        ) {
          return true;
        }

        if (
          periodo.ano ===
          anoInicioAtleta &&
          periodo.mes >=
            mesInicioAtleta
        ) {
          return true;
        }

        return false;
      }
    );

  // ----------------------------------------
  // Montar histórico financeiro completo
  // ----------------------------------------

  const historicoFinanceiro =
    mesesDoAtleta
      .map((periodo) => {
        const pagamento =
          pagamentos.find(
            (item) =>
              Number(item.mes) ===
                Number(
                  periodo.mes
                ) &&
              Number(item.ano) ===
                Number(
                  periodo.ano
                ) &&
              item.status ===
                "pago"
          );

        if (pagamento) {
          return {
            ...periodo,

            status: "pago",

            valor:
              Number(
                pagamento.valor ||
                  0
              ),

            pagamentoId:
              pagamento.id,
          };
        }

        return {
          ...periodo,

          status:
            "pendente",

          valor: 0,

          pagamentoId: null,
        };
      })
      .sort(
        (a, b) => {
          if (
            a.ano !== b.ano
          ) {
            return (
              b.ano - a.ano
            );
          }

          return (
            b.mes - a.mes
          );
        }
      );

  // ----------------------------------------
  // Estatísticas financeiras
  // ----------------------------------------

  const mensalidadesPagas =
    historicoFinanceiro.filter(
      (item) =>
        item.status ===
        "pago"
    );

  const mensalidadesPendentes =
    historicoFinanceiro.filter(
      (item) =>
        item.status ===
        "pendente"
    );

  const totalPago =
    mensalidadesPagas.reduce(
      (total, pagamento) =>
        total +
        Number(
          pagamento.valor ||
            0
        ),
      0
    );

  // ========================================
  // CARREGANDO
  // ========================================

  if (carregando) {
    return (
      <MainLayout>

        <div className="dashboard-carregando">
          Carregando ficha do atleta...
        </div>

      </MainLayout>
    );
  }

  // ========================================
  // ERRO
  // ========================================

  if (
    erro ||
    !atleta
  ) {
    return (
      <MainLayout>

        <div className="atletas-vazio">

          <div className="vazio-icone">
            ⚠️
          </div>

          <h2>
            Atleta não encontrado
          </h2>

          <p>
            {erro}
          </p>

          <button
            className="novo-atleta"
            onClick={() =>
              navigate(
                "/atletas"
              )
            }
          >
            ← Voltar para atletas
          </button>

        </div>

      </MainLayout>
    );
  }

  const inicial =
    atleta.nome
      ?.charAt(0)
      .toUpperCase() ||
    "A";

  // ========================================
  // TELA
  // ========================================

  return (
    <MainLayout>

      <div className="detalhes-atleta-page">

        {/* VOLTAR */}

        <button
          className="detalhes-voltar"
          onClick={() =>
            navigate(
              "/atletas"
            )
          }
        >
          ← Voltar para atletas
        </button>

        {/* =================================
            CABEÇALHO
        ================================= */}

        <div className="detalhes-atleta-header">

          <div className="detalhes-avatar">
            {inicial}
          </div>

          <div className="detalhes-identidade">

            <span className="dashboard-badge">
              FICHA DO ATLETA
            </span>

            <h1>
              {atleta.nome}
            </h1>

            <div className="detalhes-tags">

              <span>
                {atleta.categoria ||
                  "Sem categoria"}
              </span>

              <span>
                {atleta.posicao ||
                  "Posição não informada"}
              </span>

              <span>
                Frequência:{" "}
                {frequencia}%
              </span>

            </div>

          </div>

        </div>

        {/* =================================
            RESUMO PRESENÇA
        ================================= */}

        <div className="detalhes-resumo">

          <div className="detalhes-resumo-card">

            <span>
              📋
            </span>

            <div>

              <small>
                Treinos registrados
              </small>

              <strong>
                {totalRegistros}
              </strong>

            </div>

          </div>

          <div className="detalhes-resumo-card resumo-verde">

            <span>
              ✅
            </span>

            <div>

              <small>
                Presenças
              </small>

              <strong>
                {totalPresentes}
              </strong>

            </div>

          </div>

          <div className="detalhes-resumo-card resumo-vermelho">

            <span>
              ❌
            </span>

            <div>

              <small>
                Faltas
              </small>

              <strong>
                {totalFaltas}
              </strong>

            </div>

          </div>

          <div className="detalhes-resumo-card resumo-amarelo">

            <span>
              📊
            </span>

            <div>

              <small>
                Frequência
              </small>

              <strong>
                {frequencia}%
              </strong>

            </div>

          </div>

        </div>

        {/* =================================
            RESUMO FINANCEIRO
        ================================= */}

        <div className="detalhes-financeiro-resumo">

          <div className="financeiro-resumo-card">

            <span>
              💰
            </span>

            <div>

              <small>
                Total pago
              </small>

              <strong>
                {formatarDinheiro(
                  totalPago
                )}
              </strong>

            </div>

          </div>

          <div className="financeiro-resumo-card financeiro-pago">

            <span>
              ✅
            </span>

            <div>

              <small>
                Mensalidades pagas
              </small>

              <strong>
                {
                  mensalidadesPagas.length
                }
              </strong>

            </div>

          </div>

          <div className="financeiro-resumo-card financeiro-pendente">

            <span>
              ⚠️
            </span>

            <div>

              <small>
                Mensalidades pendentes
              </small>

              <strong>
                {
                  mensalidadesPendentes.length
                }
              </strong>

            </div>

          </div>

        </div>

        {/* =================================
            GRID DE DADOS
        ================================= */}

        <div className="detalhes-grid">

          {/* DADOS PESSOAIS */}

          <div className="detalhes-card">

            <div className="detalhes-card-header">

              <div>

                <span className="box-mini-title">
                  CADASTRO
                </span>

                <h2>
                  Dados pessoais
                </h2>

              </div>

              <div className="detalhes-card-icon">
                👤
              </div>

            </div>

            <div className="detalhes-lista">

              <div>

                <span>
                  Nome completo
                </span>

                <strong>
                  {atleta.nome ||
                    "Não informado"}
                </strong>

              </div>

              <div>

                <span>
                  Data de nascimento
                </span>

                <strong>
                  {atleta.nascimento
                    ? formatarData(
                        atleta.nascimento
                      )
                    : "Não informada"}
                </strong>

              </div>

              <div>

                <span>
                  Idade
                </span>

                <strong>
                  {calcularIdade(
                    atleta.nascimento
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Escola
                </span>

                <strong>
                  {atleta.escola ||
                    "Não informada"}
                </strong>

              </div>

            </div>

          </div>

          {/* ESPORTIVO */}

          <div className="detalhes-card">

            <div className="detalhes-card-header">

              <div>

                <span className="box-mini-title">
                  FUTEBOL
                </span>

                <h2>
                  Dados esportivos
                </h2>

              </div>

              <div className="detalhes-card-icon">
                ⚽
              </div>

            </div>

            <div className="detalhes-lista">

              <div>

                <span>
                  Categoria
                </span>

                <strong>
                  {atleta.categoria ||
                    "Não informada"}
                </strong>

              </div>

              <div>

                <span>
                  Posição
                </span>

                <strong>
                  {atleta.posicao ||
                    "Não informada"}
                </strong>

              </div>

              <div>

                <span>
                  Situação financeira
                </span>

                <strong
                  className={
                    mensalidadesPendentes.length >
                    0
                      ? "detalhes-status atrasada"
                      : "detalhes-status em-dia"
                  }
                >

                  {mensalidadesPendentes.length >
                  0
                    ? `● ${mensalidadesPendentes.length} pendente(s)`
                    : "● Em dia"}

                </strong>

              </div>

            </div>

          </div>

          {/* RESPONSÁVEL */}

          <div className="detalhes-card">

            <div className="detalhes-card-header">

              <div>

                <span className="box-mini-title">
                  CONTATO
                </span>

                <h2>
                  Responsável
                </h2>

              </div>

              <div className="detalhes-card-icon">
                📞
              </div>

            </div>

            <div className="detalhes-lista">

              <div>

                <span>
                  Nome
                </span>

                <strong>
                  {atleta.responsavel ||
                    "Não informado"}
                </strong>

              </div>

              <div>

                <span>
                  Telefone
                </span>

                <strong>
                  {atleta.telefone ||
                    "Não informado"}
                </strong>

              </div>

            </div>

          </div>

          {/* CADASTRO ADC */}

          <div className="detalhes-card">

            <div className="detalhes-card-header">

              <div>

                <span className="box-mini-title">
                  SISTEMA
                </span>

                <h2>
                  Cadastro ADC
                </h2>

              </div>

              <div className="detalhes-card-icon">
                🐊
              </div>

            </div>

            <div className="detalhes-lista">

              <div>

                <span>
                  ID do cadastro
                </span>

                <strong className="detalhes-id">
                  {atleta.id}
                </strong>

              </div>

              <div>

                <span>
                  Início da cobrança
                </span>

                <strong>
                  {MESES[
                    mesInicioAtleta
                  ]}
                  /
                  {anoInicioAtleta}
                </strong>

              </div>

            </div>

          </div>

        </div>

        {/* =================================
            HISTÓRICO FINANCEIRO
        ================================= */}

        <div className="detalhes-historico">

          <div className="detalhes-card-header">

            <div>

              <span className="box-mini-title">
                FINANCEIRO
              </span>

              <h2>
                Histórico de mensalidades
              </h2>

              <p>
                Situação financeira mês a mês.
              </p>

            </div>

            <div className="detalhes-card-icon">
              💰
            </div>

          </div>

          {historicoFinanceiro.length ===
          0 ? (

            <div className="detalhes-historico-vazio">

              Nenhuma mensalidade
              disponível ainda.

            </div>

          ) : (

            <div className="detalhes-historico-lista">

              {historicoFinanceiro.map(
                (periodo) => (

                  <div
                    className="detalhes-historico-item"
                    key={`${periodo.ano}-${periodo.mes}`}
                  >

                    <div className="historico-data">

                      <strong>
                        {
                          MESES[
                            periodo.mes
                          ]
                        }
                        /
                        {periodo.ano}
                      </strong>

                      <span>

                        {periodo.status ===
                        "pago"
                          ? formatarDinheiro(
                              periodo.valor
                            )
                          : "Mensalidade em aberto"}

                      </span>

                    </div>

                    <span
                      className={
                        periodo.status ===
                        "pago"
                          ? "historico-status presente"
                          : "historico-status falta"
                      }
                    >

                      {periodo.status ===
                      "pago"
                        ? "✓ Pago"
                        : "⚠ Pendente"}

                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* =================================
            HISTÓRICO PRESENÇA
        ================================= */}

        <div className="detalhes-historico">

          <div className="detalhes-card-header">

            <div>

              <span className="box-mini-title">
                TREINOS
              </span>

              <h2>
                Histórico de presença
              </h2>

              <p>
                Últimos registros deste atleta.
              </p>

            </div>

            <div className="detalhes-card-icon">
              📅
            </div>

          </div>

          {presencas.length === 0 ? (

            <div className="detalhes-historico-vazio">

              Nenhum registro de
              presença ainda.

            </div>

          ) : (

            <div className="detalhes-historico-lista">

              {presencas
                .slice(0, 10)
                .map(
                  (presenca) => (

                    <div
                      className="detalhes-historico-item"
                      key={
                        presenca.id
                      }
                    >

                      <div className="historico-data">

                        <strong>
                          {formatarData(
                            presenca.data
                          )}
                        </strong>

                        <span>
                          {presenca.treino ||
                            "Treino"}
                        </span>

                      </div>

                      <span
                        className={
                          presenca.presente
                            ? "historico-status presente"
                            : "historico-status falta"
                        }
                      >

                        {presenca.presente
                          ? "✓ Presente"
                          : "✕ Falta"}

                      </span>

                    </div>

                  )
                )}

            </div>

          )}

        </div>

      </div>

    </MainLayout>
  );
}