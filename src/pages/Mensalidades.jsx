import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

import {
  listarAtletas,
  listarPagamentos,
  registrarPagamento,
  tornarPagamentoPendente,
} from "../services/atletasService";

import {
  buscarConfiguracoes,
} from "../services/configuracoesService";

import {
  INICIO_MENSALIDADES,
  MESES,
  mesEhCobravel,
} from "../services/mensalidades";

export default function Mensalidades() {
  const hoje = new Date();

  // ==========================================
  // PERÍODO INICIAL
  // ==========================================

  const mesInicial =
    hoje.getFullYear() <
      INICIO_MENSALIDADES.ano ||
    (hoje.getFullYear() ===
      INICIO_MENSALIDADES.ano &&
      hoje.getMonth() + 1 <
        INICIO_MENSALIDADES.mes)
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

  const [pagamentos, setPagamentos] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [busca, setBusca] =
    useState("");

  const [salvando, setSalvando] =
    useState(null);

  const [
    valorMensalidade,
    setValorMensalidade,
  ] = useState(20);

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
        (mes) => mes.numero > 0
      )
      .filter((mes) =>
        mesEhCobravel(
          mes.numero,
          anoSelecionado
        )
      );

  // ==========================================
  // AJUSTAR MÊS AO TROCAR O ANO
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
    async function carregarDados() {
      setCarregando(true);

      try {
        const [
          dadosAtletas,
          dadosPagamentos,
          configuracoes,
        ] = await Promise.all([
          listarAtletas(),

          listarPagamentos(
            mesSelecionado,
            anoSelecionado
          ),

          buscarConfiguracoes(),
        ]);

        setAtletas(
          dadosAtletas
        );

        setPagamentos(
          dadosPagamentos
        );

        setValorMensalidade(
          Number(
            configuracoes.mensalidade ||
              20
          )
        );
      } catch (erro) {
        console.error(
          "Erro ao carregar mensalidades:",
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
      carregarDados();
    }
  }, [
    mesSelecionado,
    anoSelecionado,
  ]);

  // ==========================================
  // VERIFICAR PAGAMENTO
  // ==========================================

  function verificarPagamento(
    atletaId
  ) {
    return pagamentos.find(
      (pagamento) =>
        pagamento.atletaId ===
          atletaId &&
        pagamento.status === "pago"
    );
  }

  // ==========================================
  // ALTERAR PAGAMENTO
  // ==========================================

  async function alterarPagamento(
    atleta
  ) {
    const pagamento =
      verificarPagamento(
        atleta.id
      );

    try {
      setSalvando(atleta.id);

      if (pagamento) {
        await tornarPagamentoPendente(
          atleta.id,
          mesSelecionado,
          anoSelecionado
        );
      } else {
        await registrarPagamento(
          atleta.id,
          atleta.nome,
          mesSelecionado,
          anoSelecionado,
          valorMensalidade
        );
      }

      const pagamentosAtualizados =
        await listarPagamentos(
          mesSelecionado,
          anoSelecionado
        );

      setPagamentos(
        pagamentosAtualizados
      );
    } catch (erro) {
      console.error(
        "Erro ao alterar pagamento:",
        erro
      );

      alert(
        "Não foi possível atualizar o pagamento."
      );
    } finally {
      setSalvando(null);
    }
  }

  // ==========================================
  // BUSCA
  // ==========================================

  const atletasFiltrados =
    atletas.filter((atleta) =>
      atleta.nome
        ?.toLowerCase()
        .includes(
          busca.toLowerCase()
        )
    );

  // ==========================================
  // ESTATÍSTICAS
  // ==========================================

  const totalAtletas =
    atletas.length;

  const totalPagos =
    atletas.filter((atleta) =>
      verificarPagamento(
        atleta.id
      )
    ).length;

  const totalPendentes =
    totalAtletas - totalPagos;

  const valorRecebido =
    pagamentos
      .filter(
        (pagamento) =>
          pagamento.status ===
          "pago"
      )
      .reduce(
        (total, pagamento) =>
          total +
          Number(
            pagamento.valor || 0
          ),
        0
      );

  const mesNome =
    MESES[mesSelecionado] || "";

  // ==========================================
  // TELA
  // ==========================================

  return (
    <MainLayout>

      {/* CABEÇALHO */}

      <div className="atletas-header">

        <div>

          <span className="dashboard-badge">
            FINANCEIRO
          </span>

          <h1>
            Mensalidades
          </h1>

          <p>
            Controle financeiro dos
            atletas da ADC.
          </p>

        </div>

      </div>

      {/* AVISO */}

      <div className="mensalidade-inicio-aviso">

        <span>
          📅
        </span>

        <div>

          <strong>
            Controle oficial iniciado em{" "}
            {
              MESES[
                INICIO_MENSALIDADES.mes
              ]
            }{" "}
            de{" "}
            {
              INICIO_MENSALIDADES.ano
            }
          </strong>

          <p>
            Meses anteriores não geram
            pendência para os atletas.
          </p>

        </div>

      </div>

      {/* PERÍODO */}

      <div className="mensalidades-periodo">

        <div className="periodo-campo">

          <label>
            Mês de referência
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
            PERÍODO SELECIONADO
          </span>

          <strong>
            📅 {mesNome}/
            {anoSelecionado}
          </strong>

          <small>
            Mensalidade: R${" "}
            {valorMensalidade
              .toFixed(2)
              .replace(".", ",")}
          </small>

        </div>

      </div>

      {/* CARDS */}

      <div className="cards-mensalidades">

        <div className="card-mensalidade">

          <span>
            👥
          </span>

          <div>

            <small>
              Total de atletas
            </small>

            <strong>
              {totalAtletas}
            </strong>

          </div>

        </div>

        <div className="card-mensalidade card-verde">

          <span>
            ✅
          </span>

          <div>

            <small>
              Pagas
            </small>

            <strong>
              {totalPagos}
            </strong>

          </div>

        </div>

        <div className="card-mensalidade card-vermelho">

          <span>
            ⚠️
          </span>

          <div>

            <small>
              Pendentes
            </small>

            <strong>
              {totalPendentes}
            </strong>

          </div>

        </div>

        <div className="card-mensalidade card-amarelo">

          <span>
            💰
          </span>

          <div>

            <small>
              Recebido
            </small>

            <strong>
              R${" "}
              {valorRecebido
                .toFixed(2)
                .replace(".", ",")}
            </strong>

          </div>

        </div>

      </div>

      {/* BUSCA */}

      <div className="filtros-atletas">

        <div className="campo-filtro busca-atleta">

          <label>
            Buscar atleta
          </label>

          <input
            type="text"
            placeholder="Digite o nome do atleta..."
            value={busca}
            onChange={(e) =>
              setBusca(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* CONTEÚDO */}

      {carregando ? (

        <div className="dashboard-carregando">
          Carregando mensalidades...
        </div>

      ) : atletasFiltrados.length ===
        0 ? (

        <div className="atletas-vazio">

          <div className="vazio-icone">
            💰
          </div>

          <h2>
            Nenhum atleta encontrado
          </h2>

          <p>
            Cadastre um atleta primeiro
            ou altere a pesquisa.
          </p>

        </div>

      ) : (

        <div className="tabela-container">

          <table className="tabela-atletas">

            <thead>

              <tr>

                <th>
                  Matrícula
                </th>

                <th>
                  Atleta
                </th>

                <th>
                  Categoria
                </th>

                <th>
                  Responsável
                </th>

                <th>
                  {mesNome}/
                  {anoSelecionado}
                </th>

                <th>
                  Ação
                </th>

              </tr>

            </thead>

            <tbody>

              {atletasFiltrados.map(
                (
                  atleta,
                  index
                ) => {

                  const pagamento =
                    verificarPagamento(
                      atleta.id
                    );

                  const estaSalvando =
                    salvando ===
                    atleta.id;

                  return (
                    <tr
                      key={
                        atleta.id
                      }
                    >

                      <td>

                        <strong className="matricula">

                          ADC
                          {String(
                            index + 1
                          ).padStart(
                            4,
                            "0"
                          )}

                        </strong>

                      </td>

                      <td>

                        <strong>
                          {atleta.nome}
                        </strong>

                      </td>

                      <td>

                        <span className="badge-categoria">

                          {atleta.categoria ||
                            "Não informada"}

                        </span>

                      </td>

                      <td>

                        {atleta.responsavel ||
                          "Não informado"}

                      </td>

                      <td>

                        {pagamento ? (

                          <span className="status-mensalidade em-dia">
                            ● Pago
                          </span>

                        ) : (

                          <span className="status-mensalidade atrasada">
                            ● Pendente
                          </span>

                        )}

                      </td>

                      <td>

                        {pagamento ? (

                          <button
                            className="botao-pendente"
                            onClick={() =>
                              alterarPagamento(
                                atleta
                              )
                            }
                            disabled={
                              estaSalvando
                            }
                          >

                            {estaSalvando
                              ? "Salvando..."
                              : "↩️ Tornar pendente"}

                          </button>

                        ) : (

                          <button
                            className="botao-pagar"
                            onClick={() =>
                              alterarPagamento(
                                atleta
                              )
                            }
                            disabled={
                              estaSalvando
                            }
                          >

                            {estaSalvando
                              ? "Salvando..."
                              : `💰 Marcar paga - R$ ${valorMensalidade
                                  .toFixed(2)
                                  .replace(
                                    ".",
                                    ","
                                  )}`}

                          </button>

                        )}

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      )}

    </MainLayout>
  );
}