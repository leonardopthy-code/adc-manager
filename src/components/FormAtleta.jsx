import { useState } from "react";

export default function FormAtleta({ onSalvar }) {
  const [dados, setDados] = useState({
    nome: "",
    categoria: "",
    responsavel: "",
    telefone: "",
  });

  function alterarCampo(e) {
    setDados({
      ...dados,
      [e.target.name]: e.target.value,
    });
  }

  function salvar(e) {
    e.preventDefault();

    if (!dados.nome) {
      alert("Digite o nome do atleta.");
      return;
    }

    onSalvar(dados);

    setDados({
      nome: "",
      categoria: "",
      responsavel: "",
      telefone: "",
    });
  }

  return (
    <form className="form-atleta" onSubmit={salvar}>
      <h2>Novo Atleta</h2>

      <input
        name="nome"
        placeholder="Nome completo"
        value={dados.nome}
        onChange={alterarCampo}
      />

      <input
        name="categoria"
        placeholder="Categoria"
        value={dados.categoria}
        onChange={alterarCampo}
      />

      <input
        name="responsavel"
        placeholder="Responsável"
        value={dados.responsavel}
        onChange={alterarCampo}
      />

      <input
        name="telefone"
        placeholder="Telefone"
        value={dados.telefone}
        onChange={alterarCampo}
      />

      <button type="submit">
        Salvar Atleta
      </button>
    </form>
  );
}