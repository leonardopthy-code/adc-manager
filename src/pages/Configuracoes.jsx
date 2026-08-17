import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  buscarConfiguracoes,
  salvarConfiguracoes,
} from "../services/configuracoesService";

export default function Configuracoes() {
  const [nomeProjeto, setNomeProjeto] =
    useState(
      "Associação Desportiva Cicynho"
    );

  const [mensalidade, setMensalidade] =
    useState("20");

  const [telefone, setTelefone] =
    useState("");

  const [localTreino, setLocalTreino] =
    useState("Campo Alternativo");

  const [salvo, setSalvo] =
    useState(false);

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] =
    useState("");

  // ========================================
  // CARREGAR CONFIGURAÇÕES
  // ========================================

  useEffect(() => {
    async function carregarConfiguracoes() {
      try {
        setCarregando(true);

        const dados =
          await buscarConfiguracoes();

        setNomeProjeto(
          dados.nomeProjeto ||
            "Associação Desportiva Cicynho"
        );

        setMensalidade(
          String(
            dados.mensalidade ?? "20"
          )
        );

        setTelefone(
          dados.telefone || ""
        );

        setLocalTreino(
          dados.localTreino ||
            "Campo Alternativo"
        );
      } catch (erro) {
        console.error(
          "Erro ao carregar configurações:",
          erro
        );

        setErro(
          "Não foi possível carregar as configurações."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarConfiguracoes();
  }, []);

  // ========================================
  // SALVAR
  // ========================================

  async function salvarDados(e) {
    e.preventDefault();

    try {
      setErro("");
      setSalvo(false);
      setSalvando(true);

      await salvarConfiguracoes({
        nomeProjeto:
          nomeProjeto.trim(),

        mensalidade:
          Number(
            mensalidade || 0
          ),

        telefone:
          telefone.trim(),

        localTreino:
          localTreino.trim(),
      });

      setSalvo(true);

      setTimeout(() => {
        setSalvo(false);
      }, 3000);
    } catch (erro) {
      console.error(
        "Erro ao salvar configurações:",
        erro
      );

      setErro(
        "Não foi possível salvar as configurações."
      );
    } finally {
      setSalvando(false);
    }
  }

  // ========================================
  // CARREGANDO
  // ========================================

  if (carregando) {
    return (
      <MainLayout>
        <div className="dashboard-carregando">
          Carregando configurações...
        </div>
      </MainLayout>
    );
  }

  // ========================================
  // TELA
  // ========================================

  return (
    <MainLayout>

      {/* CABEÇALHO */}

      <div className="atletas-header">

        <div>

          <span className="dashboard-badge">
            ADMINISTRAÇÃO
          </span>

          <h1>
            Configurações
          </h1>

          <p>
            Gerencie as informações gerais
            do ADC Manager.
          </p>

        </div>

      </div>

      {/* ERRO */}

      {erro && (
        <div className="dashboard-erro">
          {erro}
        </div>
      )}

      {/* SUCESSO */}

      {salvo && (
        <div className="config-sucesso">

          <span>
            ✓
          </span>

          <div>

            <strong>
              Configurações salvas
            </strong>

            <p>
              As informações foram atualizadas
              com sucesso no Firebase.
            </p>

          </div>

        </div>
      )}

      {/* GRID PRINCIPAL */}

      <div className="config-grid">

        {/* FORMULÁRIO */}

        <form
          className="config-card"
          onSubmit={salvarDados}
        >

          <div className="config-card-header">

            <div>

              <span className="box-mini-title">
                DADOS DA ADC
              </span>

              <h2>
                Informações da associação
              </h2>

              <p>
                Configure os dados utilizados
                pelo sistema.
              </p>

            </div>

            <div className="config-header-icon">
              ⚙️
            </div>

          </div>

          <div className="config-form-grid">

            {/* NOME */}

            <div className="config-campo config-campo-grande">

              <label>
                Nome do projeto
              </label>

              <input
                type="text"
                value={nomeProjeto}
                onChange={(e) =>
                  setNomeProjeto(
                    e.target.value
                  )
                }
                placeholder="Nome da ADC"
              />

            </div>

            {/* MENSALIDADE */}

            <div className="config-campo">

              <label>
                Valor da mensalidade
              </label>

              <div className="config-dinheiro">

                <span>
                  R$
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={mensalidade}
                  onChange={(e) =>
                    setMensalidade(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* TELEFONE */}

            <div className="config-campo">

              <label>
                Telefone / WhatsApp
              </label>

              <input
                type="tel"
                value={telefone}
                onChange={(e) =>
                  setTelefone(
                    e.target.value
                  )
                }
                placeholder="(00) 00000-0000"
              />

            </div>

            {/* LOCAL */}

            <div className="config-campo config-campo-grande">

              <label>
                Local principal dos treinos
              </label>

              <input
                type="text"
                value={localTreino}
                onChange={(e) =>
                  setLocalTreino(
                    e.target.value
                  )
                }
                placeholder="Local dos treinos"
              />

            </div>

          </div>

          {/* BOTÃO */}

          <div className="config-acoes">

            <button
              type="submit"
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : "💾 Salvar configurações"}
            </button>

          </div>

        </form>

        {/* PAINEL LATERAL */}

        <div className="config-lateral">

          <div className="config-info-card">

            <span className="box-mini-title">
              SISTEMA
            </span>

            <h2>
              ADC Manager
            </h2>

            <p>
              Sistema de gerenciamento da
              Associação Desportiva Cicynho.
            </p>

            <div className="config-info-lista">

              <div>

                <span>
                  👥
                </span>

                <div>

                  <strong>
                    Atletas
                  </strong>

                  <small>
                    Cadastro e organização
                  </small>

                </div>

              </div>

              <div>

                <span>
                  💰
                </span>

                <div>

                  <strong>
                    Mensalidades
                  </strong>

                  <small>
                    Controle financeiro
                  </small>

                </div>

              </div>

              <div>

                <span>
                  ⚽
                </span>

                <div>

                  <strong>
                    Presença
                  </strong>

                  <small>
                    Controle dos treinos
                  </small>

                </div>

              </div>

              <div>

                <span>
                  📊
                </span>

                <div>

                  <strong>
                    Relatórios
                  </strong>

                  <small>
                    Estatísticas e frequência
                  </small>

                </div>

              </div>

            </div>

          </div>

          {/* VERSÃO */}

          <div className="config-versao">

            <span>
              🐊
            </span>

            <div>

              <strong>
                ADC Manager
              </strong>

              <small>
                Sistema de gestão
              </small>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}