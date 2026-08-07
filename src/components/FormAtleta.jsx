import { useEffect, useState } from "react";

const dadosIniciais = {
  nome: "",
  categoria: "",
  nascimento: "",
  posicao: "",
  responsavel: "",
  telefone: "",
  mensalidade: "em-dia",
};

export default function FormAtleta({ onSalvar, atletaEditando }) {
  const [dados, setDados] = useState(dadosIniciais);

  useEffect(() => {
    if (atletaEditando) {
      setDados({
        nome: atletaEditando.nome || "",
        categoria: atletaEditando.categoria || "",
        nascimento: atletaEditando.nascimento || "",
        posicao: atletaEditando.posicao || "",
        responsavel: atletaEditando.responsavel || "",
        telefone: atletaEditando.telefone || "",
        mensalidade: atletaEditando.mensalidade || "em-dia",
      });
    } else {
      setDados(dadosIniciais);
    }
  }, [atletaEditando]);

  function alterarCampo(e) {
    setDados({
      ...dados,
      [e.target.name]: e.target.value,
    });
  }

  function salvar(e) {
    e.preventDefault();

    if (!dados.nome.trim()) {
      alert("Digite o nome do atleta.");
      return;
    }

    if (!dados.categoria) {
      alert("Selecione a categoria do atleta.");
      return;
    }

    onSalvar(dados);

    if (!atletaEditando) {
      setDados(dadosIniciais);
    }
  }

  return (
    <form className="form-atleta" onSubmit={salvar}>
      <div className="form-titulo">
        <h2>
          {atletaEditando
            ? "Editar Atleta"
            : "Novo Atleta"}
        </h2>

        {atletaEditando && (
          <span className="modo-edicao">
            ✏️ Editando cadastro
          </span>
        )}
      </div>

      <div className="form-grid">
        <div className="campo-form">
          <label>Nome completo</label>

          <input
            name="nome"
            placeholder="Digite o nome completo"
            value={dados.nome}
            onChange={alterarCampo}
          />
        </div>

        <div className="campo-form">
          <label>Categoria</label>

          <select
            name="categoria"
            value={dados.categoria}
            onChange={alterarCampo}
          >
            <option value="">
              Selecione a categoria
            </option>

            <option value="Sub-06">Sub-06</option>
            <option value="Sub-07">Sub-07</option>
            <option value="Sub-08">Sub-08</option>
            <option value="Sub-09">Sub-09</option>
            <option value="Sub-10">Sub-10</option>
            <option value="Sub-11">Sub-11</option>
            <option value="Sub-12">Sub-12</option>
            <option value="Sub-13">Sub-13</option>
            <option value="Sub-14">Sub-14</option>
            <option value="Sub-15">Sub-15</option>
            <option value="Sub-16">Sub-16</option>
          </select>
        </div>

        <div className="campo-form">
          <label>Data de nascimento</label>

          <input
            type="date"
            name="nascimento"
            value={dados.nascimento}
            onChange={alterarCampo}
          />
        </div>

        <div className="campo-form">
          <label>Posição</label>

          <select
            name="posicao"
            value={dados.posicao}
            onChange={alterarCampo}
          >
            <option value="">
              Selecione a posição
            </option>

            <option value="Goleiro">Goleiro</option>
            <option value="Lateral Direito">
              Lateral Direito
            </option>
            <option value="Lateral Esquerdo">
              Lateral Esquerdo
            </option>
            <option value="Zagueiro">Zagueiro</option>
            <option value="Volante">Volante</option>
            <option value="Meia">Meia</option>
            <option value="Ponta Direita">
              Ponta Direita
            </option>
            <option value="Ponta Esquerda">
              Ponta Esquerda
            </option>
            <option value="Atacante">Atacante</option>
          </select>
        </div>

        <div className="campo-form">
          <label>Responsável</label>

          <input
            name="responsavel"
            placeholder="Nome do responsável"
            value={dados.responsavel}
            onChange={alterarCampo}
          />
        </div>

        <div className="campo-form">
          <label>Telefone</label>

          <input
            name="telefone"
            placeholder="(00) 00000-0000"
            value={dados.telefone}
            onChange={alterarCampo}
          />
        </div>

        <div className="campo-form">
          <label>Mensalidade</label>

          <select
            name="mensalidade"
            value={dados.mensalidade}
            onChange={alterarCampo}
          >
            <option value="em-dia">
              Em dia
            </option>

            <option value="atrasada">
              Atrasada
            </option>
          </select>
        </div>
      </div>

      <div className="form-acoes">
        <button type="submit">
          {atletaEditando
            ? "Salvar Alterações"
            : "Salvar Atleta"}
        </button>
      </div>
    </form>
  );
}