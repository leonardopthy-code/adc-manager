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

  // ==========================================
  // CARREGAR ATLETAS
  // ==========================================

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

  // ==========================================
  // CARREGAR PRESENÇAS DA DATA/TREINO
  // ==========================================

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

  // ==========================================
  // ALTERAR PRESENÇA
  // ==========================================

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

  return (
    <MainLayout>
      {/* CABEÇALHO */}

      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            color: "#0B2D6B",
            marginBottom: "5px",
          }}
        >
          Presença
        </h1>

        <p style={{ color: "#777" }}>
          Controle de presença dos atletas da ADC.
        </p>
      </div>

      {/* FILTROS */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "25px",
          boxShadow:
            "0 5px 15px rgba(0,0,0,.08)",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "7px",
            }}
          >
            Data
          </label>

          <input
            type="date"
            value={data}
            onChange={(e) =>
              setData(e.target.value)
            }
            style={{
              padding: "11px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "7px",
            }}
          >
            Treino
          </label>

          <select
            value={tipoTreino}
            onChange={(e) =>
              setTipoTreino(e.target.value)
            }
            style={{
              padding: "11px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <option>Matutino</option>
            <option>Vespertino</option>
            <option>Noturno</option>
          </select>
        </div>
      </div>

      {/* RESUMO */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "15px",
            borderLeft:
              "6px solid #0B2D6B",
          }}
        >
          <small>Total</small>

          <h2
            style={{
              color: "#0B2D6B",
              marginTop: "8px",
            }}
          >
            {atletas.length}
          </h2>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "15px",
            borderLeft:
              "6px solid #28a745",
          }}
        >
          <small>Presentes</small>

          <h2
            style={{
              color: "#28a745",
              marginTop: "8px",
            }}
          >
            {presentes}
          </h2>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "15px",
            borderLeft:
              "6px solid #dc3545",
          }}
        >
          <small>Faltas</small>

          <h2
            style={{
              color: "#dc3545",
              marginTop: "8px",
            }}
          >
            {faltas}
          </h2>
        </div>
      </div>

      {/* LISTA */}

      <div
        style={{
          background: "#fff",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow:
            "0 5px 15px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom:
              "1px solid #eee",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#0B2D6B",
            }}
          >
            Lista de atletas
          </h2>

          <p
            style={{
              color: "#777",
              marginTop: "5px",
            }}
          >
            {tipoTreino} — {data}
          </p>
        </div>

        {carregando ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            Carregando atletas...
          </div>
        ) : atletas.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h2>
              Nenhum atleta cadastrado
            </h2>

            <p
              style={{
                color: "#777",
                marginTop: "10px",
              }}
            >
              Cadastre atletas para registrar
              presença.
            </p>
          </div>
        ) : (
          <div
            style={{
              padding: "10px 20px 20px",
            }}
          >
            {atletas.map((atleta) => {
              const presente =
                presencas[atleta.id];

              const estaSalvando =
                salvando === atleta.id;

              return (
                <div
                  key={atleta.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    padding: "15px",
                    borderBottom:
                      "1px solid #eee",
                  }}
                >
                  <div>
                    <strong>
                      {atleta.nome}
                    </strong>

                    <div
                      style={{
                        color: "#777",
                        fontSize: "14px",
                        marginTop: "3px",
                      }}
                    >
                      {atleta.categoria ||
                        "Sem categoria"}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      alterarPresenca(
                        atleta
                      )
                    }
                    disabled={estaSalvando}
                    style={{
                      width: "auto",
                      minWidth: "125px",
                      padding:
                        "10px 18px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: estaSalvando
                        ? "wait"
                        : "pointer",
                      background: presente
                        ? "#28a745"
                        : "#dc3545",
                      color: "#fff",
                      fontWeight: "600",
                      opacity: estaSalvando
                        ? 0.7
                        : 1,
                    }}
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