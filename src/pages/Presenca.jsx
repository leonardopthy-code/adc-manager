import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { listarAtletas } from "../services/atletasService";
import {
  buscarPresencas,
  salvarPresenca,
} from "../services/presencaService";

export default function Presenca() {
  const hoje = new Date()
    .toISOString()
    .split("T")[0];

  const [atletas, setAtletas] = useState([]);
  const [data, setData] = useState(hoje);
  const [tipoTreino, setTipoTreino] =
    useState("Matutino");

  const [presencas, setPresencas] = useState({});
  const [carregando, setCarregando] =
    useState(true);
  const [salvando, setSalvando] =
    useState(null);

  useEffect(() => {
    async function carregarAtletas() {
      try {
        const dados = await listarAtletas();
        setAtletas(dados);
      } catch (erro) {
        console.error(
          "Erro ao carregar atletas:",
          erro
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarAtletas();
  }, []);

  useEffect(() => {
    async function carregarPresencas() {
      try {
        const dados =
          await buscarPresencas(
            data,
            tipoTreino
          );

        const presencasCarregadas = {};

        dados.forEach((presenca) => {
          presencasCarregadas[
            presenca.atletaId
          ] = presenca.presente;
        });

        setPresencas(
          presencasCarregadas
        );
      } catch (erro) {
        console.error(
          "Erro ao carregar presenças:",
          erro
        );
      }
    }

    carregarPresencas();
  }, [data, tipoTreino]);

  async function alterarPresenca(atleta) {
    const novoStatus =
      !presencas[atleta.id];

    try {
      setSalvando(atleta.id);

      await salvarPresenca({
        atletaId: atleta.id,
        atletaNome: atleta.nome,
        data,
        treino: tipoTreino,
        presente: novoStatus,
      });

      setPresencas((atual) => ({
        ...atual,
        [atleta.id]: novoStatus,
      }));
    } catch (erro) {
      console.error(
        "Erro ao salvar presença:",
        erro
      );

      alert(
        "Não foi possível salvar a presença."
      );
    } finally {
      setSalvando(null);
    }
  }

  const presentes = Object.values(
    presencas
  ).filter(Boolean).length;

  const faltas =
    atletas.length - presentes;

  const percentual =
    atletas.length > 0
      ? Math.round(
          (presentes /
            atletas.length) *
            100
        )
      : 0;

  return (
    <MainLayout>
      {/* CABEÇALHO */}

      <div className="atletas-header">
        <div>
          <span className="dashboard-badge">
            CONTROLE DE TREINO
          </span>

          <h1>Presença</h1>

          <p>
            Controle de presença dos atletas da ADC.
          </p>
        </div>
      </div>

      {/* FILTROS */}

      <div className="presenca-filtros">

        <div className="presenca-campo">
          <label>Data do treino</label>

          <input
            type="date"
            value={data}
            onChange={(e) =>
              setData(e.target.value)
            }
          />
        </div>

        <div className="presenca-campo">
          <label>Turno do treino</label>

          <select
            value={tipoTreino}
            onChange={(e) =>
              setTipoTreino(e.target.value)
            }
          >
            <option>Matutino</option>
            <option>Vespertino</option>
            <option>Noturno</option>
          </select>
        </div>

        <div className="presenca-referencia">
          <span>TREINO SELECIONADO</span>

          <strong>
            ⚽ {tipoTreino}
          </strong>

          <small>
            {data}
          </small>
        </div>

      </div>

      {/* CARDS */}

      <div className="presenca-cards">

        <div className="presenca-card presenca-total">
          <div className="presenca-card-icone">
            👥
          </div>

          <div>
            <span>Total de atletas</span>
            <strong>{atletas.length}</strong>
          </div>
        </div>

        <div className="presenca-card presenca-presentes">
          <div className="presenca-card-icone">
            ✅
          </div>

          <div>
            <span>Presentes</span>
            <strong>{presentes}</strong>
          </div>
        </div>

        <div className="presenca-card presenca-faltas">
          <div className="presenca-card-icone">
            ❌
          </div>

          <div>
            <span>Faltas</span>
            <strong>{faltas}</strong>
          </div>
        </div>

        <div className="presenca-card presenca-frequencia">
          <div className="presenca-card-icone">
            📊
          </div>

          <div>
            <span>Frequência</span>
            <strong>
              {percentual}%
            </strong>
          </div>
        </div>

      </div>

      {/* LISTA */}

      <div className="presenca-lista">

        <div className="presenca-lista-header">
          <div>
            <span className="box-mini-title">
              CHAMADA
            </span>

            <h2>Lista de atletas</h2>

            <p>
              {tipoTreino} — {data}
            </p>
          </div>

          <div className="presenca-resumo-mini">
            <span>
              {presentes} presentes
            </span>

            <span>
              {faltas} faltas
            </span>
          </div>
        </div>

        {carregando ? (
          <div className="presenca-carregando">
            Carregando atletas...
          </div>
        ) : atletas.length === 0 ? (
          <div className="presenca-vazio">
            <div>⚽</div>

            <h2>
              Nenhum atleta cadastrado
            </h2>

            <p>
              Cadastre atletas para registrar presença.
            </p>
          </div>
        ) : (
          <div className="presenca-atletas">

            {atletas.map((atleta) => {
              const presente =
                presencas[atleta.id];

              const estaSalvando =
                salvando === atleta.id;

              const inicial =
                atleta.nome
                  ?.charAt(0)
                  .toUpperCase() || "A";

              return (
                <div
                  key={atleta.id}
                  className="presenca-atleta"
                >

                  <div className="presenca-atleta-info">

                    <div className="presenca-avatar">
                      {inicial}
                    </div>

                    <div>
                      <strong>
                        {atleta.nome}
                      </strong>

                      <span>
                        {atleta.categoria ||
                          "Sem categoria"}
                      </span>
                    </div>

                  </div>

                  <button
                    className={
                      presente
                        ? "presenca-botao presente"
                        : "presenca-botao falta"
                    }
                    onClick={() =>
                      alterarPresenca(
                        atleta
                      )
                    }
                    disabled={estaSalvando}
                  >
                    {estaSalvando
                      ? "Salvando..."
                      : presente
                      ? "✓ Presente"
                      : "✕ Falta"}
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </MainLayout>
  );
}