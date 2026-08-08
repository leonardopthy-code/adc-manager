import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

import {
  listarAtletas,
  listarPagamentos,
  registrarPagamento,
  tornarPagamentoPendente,
} from "../services/atletasService";

const meses = [
  { numero: 1, nome: "Janeiro" },
  { numero: 2, nome: "Fevereiro" },
  { numero: 3, nome: "Março" },
  { numero: 4, nome: "Abril" },
  { numero: 5, nome: "Maio" },
  { numero: 6, nome: "Junho" },
  { numero: 7, nome: "Julho" },
  { numero: 8, nome: "Agosto" },
  { numero: 9, nome: "Setembro" },
  { numero: 10, nome: "Outubro" },
  { numero: 11, nome: "Novembro" },
  { numero: 12, nome: "Dezembro" },
];

export default function Mensalidades() {
  const hoje = new Date();

  const [atletas, setAtletas] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(null);

  const [mesSelecionado, setMesSelecionado] = useState(
    hoje.getMonth() + 1
  );

  const [anoSelecionado, setAnoSelecionado] = useState(
    hoje.getFullYear()
  );

  // ==========================================
  // CARREGAR ATLETAS E PAGAMENTOS
  // ==========================================

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);

      try {
        const [dadosAtletas, dadosPagamentos] =
          await Promise.all([
            listarAtletas(),
            listarPagamentos(
              mesSelecionado,
              anoSelecionado
            ),
          ]);

        setAtletas(dadosAtletas);
        setPagamentos(dadosPagamentos);
      } catch (erro) {
        console.error(
          "Erro ao carregar mensalidades:",
          erro
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [mesSelecionado, anoSelecionado]);

  // ==========================================
  // VERIFICAR SE O ATLETA PAGOU
  // ==========================================

  function verificarPagamento(atletaId) {
    return pagamentos.find(
      (pagamento) =>
        pagamento.atletaId === atletaId &&
        pagamento.status === "pago"
    );
  }

  // ==========================================
  // PAGAR / TORNAR PENDENTE
  // ==========================================

  async function alterarPagamento(atleta) {
    const pagamento = verificarPagamento(
      atleta.id
    );

    try {
      setSalvando(atleta.id);

      // Se já está pago, torna pendente
      if (pagamento) {
        await tornarPagamentoPendente(
          atleta.id,
          mesSelecionado,
          anoSelecionado
        );
      }

      // Se está pendente, registra pagamento
      else {
        await registrarPagamento(
          atleta.id,
          atleta.nome,
          mesSelecionado,
          anoSelecionado,
          20
        );
      }

      // Recarrega os pagamentos do mês
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
  // FILTRO
  // ==========================================

  const atletasFiltrados = atletas.filter(
    (atleta) =>
      atleta.nome
        ?.toLowerCase()
        .includes(busca.toLowerCase())
  );

  // ==========================================
  // ESTATÍSTICAS
  // ==========================================

  const totalAtletas = atletas.length;

  const totalPagos = atletas.filter((atleta) =>
    verificarPagamento(atleta.id)
  ).length;

  const totalPendentes =
    totalAtletas - totalPagos;

  const valorRecebido = pagamentos
    .filter(
      (pagamento) =>
        pagamento.status === "pago"
    )
    .reduce(
      (total, pagamento) =>
        total + Number(pagamento.valor || 0),
      0
    );

  const mesNome =
    meses.find(
      (mes) =>
        mes.numero === mesSelecionado
    )?.nome || "";

  // ==========================================
  // TELA
  // ==========================================

  return (
    <MainLayout>
      {/* CABEÇALHO */}

      <div className="atletas-header">
        <div>
          <h1>Mensalidades</h1>

          <p>
            Controle financeiro dos atletas da ADC.
          </p>
        </div>
      </div>

      {/* ======================================
          SELEÇÃO DO MÊS
      ====================================== */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "25px",
          boxShadow:
            "0 5px 15px rgba(0,0,0,.08)",
          display: "flex",
          gap: "15px",
          alignItems: "end",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "600",
            }}
          >
            Mês de referência
          </label>

          <select
            value={mesSelecionado}
            onChange={(e) =>
              setMesSelecionado(
                Number(e.target.value)
              )
            }
            style={{
              padding: "11px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "15px",
            }}
          >
            {meses.map((mes) => (
              <option
                key={mes.numero}
                value={mes.numero}
              >
                {mes.nome}
              </option>
            ))}
          </select>
        </div>

        {/* ANO */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "600",
            }}
          >
            Ano
          </label>

          <select
            value={anoSelecionado}
            onChange={(e) =>
              setAnoSelecionado(
                Number(e.target.value)
              )
            }
            style={{
              padding: "11px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "15px",
            }}
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

        {/* REFERÊNCIA */}

        <div
          style={{
            fontWeight: "700",
            color: "#0B2D6B",
            paddingBottom: "10px",
          }}
        >
          📅 {mesNome}/{anoSelecionado}
        </div>
      </div>

      {/* ======================================
          CARDS
      ====================================== */}

      <div className="cards-mensalidades">
        {/* TOTAL */}

        <div className="card-mensalidade">
          <span>👥</span>

          <div>
            <small>Total de atletas</small>

            <strong>
              {totalAtletas}
            </strong>
          </div>
        </div>

        {/* PAGOS */}

        <div className="card-mensalidade card-verde">
          <span>✅</span>

          <div>
            <small>Pagas</small>

            <strong>
              {totalPagos}
            </strong>
          </div>
        </div>

        {/* PENDENTES */}

        <div className="card-mensalidade card-vermelho">
          <span>⚠️</span>

          <div>
            <small>Pendentes</small>

            <strong>
              {totalPendentes}
            </strong>
          </div>
        </div>

        {/* RECEBIDO */}

        <div className="card-mensalidade card-amarelo">
          <span>💰</span>

          <div>
            <small>Recebido</small>

            <strong>
              R${" "}
              {valorRecebido
                .toFixed(2)
                .replace(".", ",")}
            </strong>
          </div>
        </div>
      </div>

      {/* ======================================
          BUSCA
      ====================================== */}

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
              setBusca(e.target.value)
            }
          />
        </div>
      </div>

      {/* ======================================
          CARREGANDO
      ====================================== */}

      {carregando ? (
        <div className="dashboard-carregando">
          Carregando mensalidades...
        </div>
      ) : atletasFiltrados.length === 0 ? (
        /* ====================================
           NENHUM ATLETA
        ==================================== */

        <div className="atletas-vazio">
          <div className="vazio-icone">
            💰
          </div>

          <h2>
            Nenhum atleta encontrado
          </h2>

          <p>
            Cadastre um atleta primeiro ou
            altere a pesquisa.
          </p>
        </div>
      ) : (
        /* ====================================
           TABELA
        ==================================== */

        <div className="tabela-container">
          <table className="tabela-atletas">
            <thead>
              <tr>
                <th>Matrícula</th>

                <th>Atleta</th>

                <th>Categoria</th>

                <th>Responsável</th>

                <th>
                  {mesNome}/{anoSelecionado}
                </th>

                <th>Ação</th>
              </tr>
            </thead>

            <tbody>
              {atletasFiltrados.map(
                (atleta, index) => {
                  const pagamento =
                    verificarPagamento(
                      atleta.id
                    );

                  const estaSalvando =
                    salvando === atleta.id;

                  return (
                    <tr key={atleta.id}>
                      {/* MATRÍCULA */}

                      <td>
                        <strong className="matricula">
                          ADC
                          {String(
                            index + 1
                          ).padStart(4, "0")}
                        </strong>
                      </td>

                      {/* NOME */}

                      <td>
                        <strong>
                          {atleta.nome}
                        </strong>
                      </td>

                      {/* CATEGORIA */}

                      <td>
                        <span className="badge-categoria">
                          {atleta.categoria ||
                            "Não informada"}
                        </span>
                      </td>

                      {/* RESPONSÁVEL */}

                      <td>
                        {atleta.responsavel ||
                          "Não informado"}
                      </td>

                      {/* STATUS */}

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

                      {/* AÇÃO */}

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
                              : "💰 Marcar paga"}
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