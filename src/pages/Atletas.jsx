import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import FormAtleta from "../components/FormAtleta";

import {
  listarAtletas,
  adicionarAtleta,
  excluirAtleta,
  editarAtleta,
} from "../services/atletasService";

export default function Atletas() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [atletas, setAtletas] = useState([]);
  const [atletaEditando, setAtletaEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroMensalidade, setFiltroMensalidade] = useState("");

  async function carregarAtletas() {
    try {
      const dados = await listarAtletas();
      setAtletas(dados);
    } catch (erro) {
      console.error("Erro ao carregar atletas:", erro);
      alert("Não foi possível carregar os atletas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarAtletas();
  }, []);

  async function salvarAtleta(dadosAtleta) {
    try {
      if (atletaEditando) {
        await editarAtleta(
          atletaEditando.id,
          dadosAtleta
        );

        setAtletas((listaAtual) =>
          listaAtual.map((atleta) =>
            atleta.id === atletaEditando.id
              ? {
                  ...atleta,
                  ...dadosAtleta,
                }
              : atleta
          )
        );

        alert("Atleta atualizado com sucesso!");
      } else {
        const atleta = await adicionarAtleta(
          dadosAtleta
        );

        setAtletas((listaAtual) => [
          ...listaAtual,
          atleta,
        ]);

        alert("Atleta cadastrado com sucesso!");
      }

      setAtletaEditando(null);
      setMostrarFormulario(false);
    } catch (erro) {
      console.error(
        "Erro ao salvar atleta:",
        erro
      );

      alert(
        atletaEditando
          ? "Não foi possível atualizar o atleta."
          : "Não foi possível cadastrar o atleta."
      );
    }
  }

  function iniciarEdicao(atleta) {
    setAtletaEditando(atleta);
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelarEdicao() {
    setAtletaEditando(null);
    setMostrarFormulario(false);
  }

  async function removerAtleta(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este atleta?"
    );

    if (!confirmar) return;

    try {
      await excluirAtleta(id);

      setAtletas((listaAtual) =>
        listaAtual.filter(
          (atleta) => atleta.id !== id
        )
      );
    } catch (erro) {
      console.error(
        "Erro ao excluir atleta:",
        erro
      );

      alert(
        "Não foi possível excluir o atleta."
      );
    }
  }

  const categorias = [
    ...new Set(
      atletas
        .map((atleta) => atleta.categoria)
        .filter(Boolean)
    ),
  ].sort();

  const atletasFiltrados = atletas.filter(
    (atleta) => {
      const nome =
        atleta.nome?.toLowerCase() || "";

      const termoBusca =
        busca.toLowerCase();

      const correspondeBusca =
        nome.includes(termoBusca);

      const correspondeCategoria =
        !filtroCategoria ||
        atleta.categoria === filtroCategoria;

      const correspondeMensalidade =
        !filtroMensalidade ||
        atleta.mensalidade ===
          filtroMensalidade;

      return (
        correspondeBusca &&
        correspondeCategoria &&
        correspondeMensalidade
      );
    }
  );

  return (
    <MainLayout>
      <div className="atletas-header">
        <div>
          <h1>Atletas</h1>

          <p>
            Gerencie os atletas cadastrados na ADC.
          </p>
        </div>

        <button
          className="novo-atleta"
          onClick={() => {
            if (atletaEditando) {
              cancelarEdicao();
            } else {
              setMostrarFormulario(
                !mostrarFormulario
              );
            }
          }}
        >
          {mostrarFormulario
            ? "Fechar"
            : "+ Novo Atleta"}
        </button>
      </div>

      {mostrarFormulario && (
        <FormAtleta
          onSalvar={salvarAtleta}
          atletaEditando={atletaEditando}
        />
      )}

      {carregando ? (
        <div className="dashboard-carregando">
          Carregando atletas...
        </div>
      ) : (
        <>
          <div className="filtros-atletas">
            <div className="campo-filtro busca-atleta">
              <label>Buscar atleta</label>

              <input
                type="text"
                placeholder="Digite o nome..."
                value={busca}
                onChange={(e) =>
                  setBusca(e.target.value)
                }
              />
            </div>

            <div className="campo-filtro">
              <label>Categoria</label>

              <select
                value={filtroCategoria}
                onChange={(e) =>
                  setFiltroCategoria(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Todas as categorias
                </option>

                {categorias.map(
                  (categoria) => (
                    <option
                      key={categoria}
                      value={categoria}
                    >
                      {categoria}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="campo-filtro">
              <label>Mensalidade</label>

              <select
                value={filtroMensalidade}
                onChange={(e) =>
                  setFiltroMensalidade(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Todas
                </option>

                <option value="em-dia">
                  Em dia
                </option>

                <option value="atrasada">
                  Atrasada
                </option>
              </select>
            </div>
          </div>

          <div className="resumo-atletas">
            <div>
              <strong>
                {atletasFiltrados.length}
              </strong>

              <span>
                {atletasFiltrados.length === 1
                  ? " atleta encontrado"
                  : " atletas encontrados"}
              </span>
            </div>

            {(busca ||
              filtroCategoria ||
              filtroMensalidade) && (
              <button
                className="limpar-filtros"
                onClick={() => {
                  setBusca("");
                  setFiltroCategoria("");
                  setFiltroMensalidade("");
                }}
              >
                Limpar filtros
              </button>
            )}
          </div>

          {atletas.length === 0 ? (
            <div className="atletas-vazio">
              <div className="vazio-icone">
                👥
              </div>

              <h2>
                Nenhum atleta cadastrado
              </h2>

              <p>
                Clique em "+ Novo Atleta" para
                cadastrar o primeiro atleta.
              </p>

              <button
                className="novo-atleta"
                onClick={() =>
                  setMostrarFormulario(true)
                }
              >
                + Cadastrar atleta
              </button>
            </div>
          ) : atletasFiltrados.length === 0 ? (
            <div className="atletas-vazio">
              <div className="vazio-icone">
                🔎
              </div>

              <h2>
                Nenhum atleta encontrado
              </h2>

              <p>
                Tente alterar os filtros ou o nome
                pesquisado.
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
                    <th>Posição</th>
                    <th>Responsável</th>
                    <th>Telefone</th>
                    <th>Mensalidade</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {atletasFiltrados.map(
                    (atleta) => {
                      const indice =
                        atletas.findIndex(
                          (item) =>
                            item.id ===
                            atleta.id
                        );

                      const mensalidade =
                        atleta.mensalidade ||
                        "em-dia";

                      return (
                        <tr key={atleta.id}>
                          <td>
                            <strong className="matricula">
                              ADC
                              {String(
                                indice + 1
                              ).padStart(4, "0")}
                            </strong>
                          </td>

                          <td>
                            <div className="atleta-tabela">
                              <div className="avatar-atleta">
                                {atleta.nome
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {atleta.nome}
                                </strong>

                                {atleta.nascimento && (
                                  <small>
                                    Nasc.:{" "}
                                    {
                                      atleta.nascimento
                                    }
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="badge-categoria">
                              {atleta.categoria ||
                                "Não informada"}
                            </span>
                          </td>

                          <td>
                            {atleta.posicao ||
                              "Não informada"}
                          </td>

                          <td>
                            {atleta.responsavel ||
                              "Não informado"}
                          </td>

                          <td>
                            {atleta.telefone ||
                              "Não informado"}
                          </td>

                          <td>
                            {mensalidade ===
                            "atrasada" ? (
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
                            <div className="acoes-atleta">
                              <button
                                className="botao-editar"
                                onClick={() =>
                                  iniciarEdicao(
                                    atleta
                                  )
                                }
                              >
                                ✏️ Editar
                              </button>

                              <button
                                className="botao-excluir"
                                onClick={() =>
                                  removerAtleta(
                                    atleta.id
                                  )
                                }
                              >
                                🗑️ Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}