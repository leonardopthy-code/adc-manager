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

  function verificarPagamento(atletaId) {
    return pagamentos.find(
      (pagamento) =>
        pagamento.atletaId === atletaId &&
        pagamento.status === "pago"
    );
  }

  async function alterarPagamento(atleta) {
    const pagamento = verificarPagamento(
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
          20
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

  const atletasFiltrados = atletas.filter(
    (atleta) =>
      atleta.nome
        ?.toLowerCase()
        .includes(busca.toLowerCase())
  );

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

  return (
    <MainLayout>
      {/* CABEÇALHO */}

      <div className="atletas-header">
        <div>
          <span className="dashboard-badge">
            FINANCEIRO
          </span>

          <h1>Mensalidades</h1>

          <p>
            Controle financeiro dos atletas da ADC.
          </p>
        </div>
      </div>

      {/* PERÍODO */}

      <div className="mensalidades-periodo">
        <div className="periodo-campo">
          <label>Mês de referência</label>

          <select
            value={mesSelecionado}
            onChange={(e) =>
              setMesSelecionado(
                Number(e.target.value)
              )
            }
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

        <div className="periodo-campo">
          <label>Ano</label>

          <select
            value={anoSelecionado}
            onChange={(e) =>
              setAnoSelecionado(
                Number(e.target.value)
              )
            }
          >
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
            <option value={2028}>2028</option>
          </select>
        </div>

        <div className="periodo-atual">
          <span>PERÍODO SELECIONADO</span>

          <strong>
            📅 {mesNome}/{anoSelecionado}
          </strong>
        </div>
      </div>

      {/* CARDS */}

      <div className="cards-mensalidades">
        <div className="card-mensalidade">
          <span>👥</span>

          <div>
            <small>Total de atletas</small>
            <strong>{totalAtletas}</strong>
          </div>
        </div>

        <div className="card-mensalidade card-verde">
          <span>✅</span>

          <div>
            <small>Pagas</small>
            <strong>{totalPagos}</strong>
          </div>
        </div>

        <div className="card-mensalidade card-vermelho">
          <span>⚠️</span>

          <div>
            <small>Pendentes</small>
            <strong>{totalPendentes}</strong>
          </div>
        </div>

        <div className="card-mensalidade card-amarelo">
          <span>💰</span>

          <div>
            <small>Recebido</small>

            <strong>
              R$ {valorRecebido
                .toFixed(2)
                .replace(".", ",")}
            </strong>
          </div>
        </div>
      </div>

      {/* BUSCA */}

      <div className="filtros-atletas">
        <div className="campo-filtro busca-atleta">
          <label>Buscar atleta</label>

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

      {/* CONTEÚDO */}

      {carregando ? (
        <div className="dashboard-carregando">
          Carregando mensalidades...
        </div>
      ) : atletasFiltrados.length === 0 ? (
        <div className="atletas-vazio">
          <div className="vazio-icone">
            💰
          </div>

          <h2>Nenhum atleta encontrado</h2>

          <p>
            Cadastre um atleta primeiro ou altere a pesquisa.
          </p>
        </div>
      ) : (
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
                      <td>
                        <strong className="matricula">
                          ADC
                          {String(
                            index + 1
                          ).padStart(4, "0")}
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