import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  listarAtletas,
  editarAtleta,
} from "../services/atletasService";

export default function Mensalidades() {
  const [atletas, setAtletas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarAtletas();
        setAtletas(dados);
      } catch (erro) {
        console.error("Erro ao carregar atletas:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  async function alterarMensalidade(atleta) {
    const novaSituacao =
      atleta.mensalidade === "atrasada"
        ? "em-dia"
        : "atrasada";

    try {
      setSalvando(atleta.id);

      await editarAtleta(atleta.id, {
        mensalidade: novaSituacao,
      });

      setAtletas((listaAtual) =>
        listaAtual.map((item) =>
          item.id === atleta.id
            ? {
                ...item,
                mensalidade: novaSituacao,
              }
            : item
        )
      );
    } catch (erro) {
      console.error(
        "Erro ao atualizar mensalidade:",
        erro
      );

      alert(
        "Não foi possível atualizar a mensalidade."
      );
    } finally {
      setSalvando(null);
    }
  }

  const atletasFiltrados = atletas.filter((atleta) =>
    atleta.nome
      ?.toLowerCase()
      .includes(busca.toLowerCase())
  );

  const totalAtletas = atletas.length;

  const emDia = atletas.filter(
    (atleta) =>
      atleta.mensalidade !== "atrasada"
  ).length;

  const atrasadas = atletas.filter(
    (atleta) =>
      atleta.mensalidade === "atrasada"
  ).length;

  return (
    <MainLayout>
      <div className="atletas-header">
        <div>
          <h1>Mensalidades</h1>

          <p>
            Controle financeiro dos atletas da ADC.
          </p>
        </div>
      </div>

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
            <small>Em dia</small>
            <strong>{emDia}</strong>
          </div>
        </div>

        <div className="card-mensalidade card-vermelho">
          <span>⚠️</span>

          <div>
            <small>Atrasadas</small>
            <strong>{atrasadas}</strong>
          </div>
        </div>

        <div className="card-mensalidade card-amarelo">
          <span>💰</span>

          <div>
            <small>Valor mensal</small>
            <strong>R$ 20,00</strong>
          </div>
        </div>
      </div>

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

      {carregando ? (
        <div className="dashboard-carregando">
          Carregando mensalidades...
        </div>
      ) : atletasFiltrados.length === 0 ? (
        <div className="atletas-vazio">
          <div className="vazio-icone">💰</div>

          <h2>Nenhum atleta encontrado</h2>

          <p>
            Cadastre um atleta primeiro ou altere
            a pesquisa.
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
                <th>Mensalidade</th>
                <th>Ação</th>
              </tr>
            </thead>

            <tbody>
              {atletasFiltrados.map(
                (atleta, index) => {
                  const atrasada =
                    atleta.mensalidade ===
                    "atrasada";

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
                        {atrasada ? (
                          <span className="status-mensalidade atrasada">
                            ● Atrasada
                          </span>
                        ) : (
                          <span className="status-mensalidade em-dia">
                            ● Em dia
                          </span>
                        )}
                      </td>

                      <td>
                        <button
                          className={
                            atrasada
                              ? "botao-pagar"
                              : "botao-pendente"
                          }
                          onClick={() =>
                            alterarMensalidade(
                              atleta
                            )
                          }
                          disabled={estaSalvando}
                        >
                          {estaSalvando
                            ? "Salvando..."
                            : atrasada
                            ? "💰 Marcar paga"
                            : "↩️ Tornar pendente"}
                        </button>
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