import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import FormAtleta from "../components/FormAtleta";

import {
  listarAtletas,
  adicionarAtleta,
  excluirAtleta,
} from "../services/atletasService";

export default function Atletas() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [atletas, setAtletas] = useState([]);
  const [carregando, setCarregando] = useState(true);

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

  async function salvarAtleta(novoAtleta) {
    try {
      const atleta = await adicionarAtleta(novoAtleta);

      setAtletas((listaAtual) => [
        ...listaAtual,
        atleta,
      ]);

      setMostrarFormulario(false);
    } catch (erro) {
      console.error("Erro ao salvar atleta:", erro);
      alert("Não foi possível salvar o atleta.");
    }
  }

  async function removerAtleta(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este atleta?"
    );

    if (!confirmar) return;

    try {
      await excluirAtleta(id);

      setAtletas((listaAtual) =>
        listaAtual.filter((atleta) => atleta.id !== id)
      );
    } catch (erro) {
      console.error("Erro ao excluir atleta:", erro);
      alert("Não foi possível excluir o atleta.");
    }
  }

  return (
    <MainLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ color: "#0B2D6B", marginBottom: "5px" }}>
            Atletas
          </h1>

          <p style={{ color: "#777" }}>
            Total de atletas: {atletas.length}
          </p>
        </div>

        <button
          className="novo-atleta"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Fechar" : "+ Novo Atleta"}
        </button>
      </div>

      {mostrarFormulario && (
        <FormAtleta onSalvar={salvarAtleta} />
      )}

      {carregando ? (
        <p>Carregando atletas...</p>
      ) : atletas.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,.08)",
          }}
        >
          <h2>Nenhum atleta cadastrado</h2>

          <p style={{ color: "#777", marginTop: "10px" }}>
            Clique em "+ Novo Atleta" para cadastrar o primeiro.
          </p>
        </div>
      ) : (
        <table className="tabela-atletas">
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Responsável</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {atletas.map((atleta, index) => (
              <tr key={atleta.id}>
                <td>
                  ADC{String(index + 1).padStart(4, "0")}
                </td>

                <td>{atleta.nome}</td>

                <td>{atleta.categoria}</td>

                <td>{atleta.responsavel}</td>

                <td>{atleta.telefone}</td>

                <td>
                  <button
                    onClick={() => removerAtleta(atleta.id)}
                    style={{
                      width: "auto",
                      padding: "8px 12px",
                      background: "#dc3545",
                      color: "#fff",
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </MainLayout>
  );
}