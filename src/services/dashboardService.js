import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import app from "./firebase";

import {
  INICIO_MENSALIDADES,
  MESES,
} from "../services/mensalidades.js";

const db = getFirestore(app);

export async function buscarEstatisticas() {
  try {
    // ==========================================
    // ATLETAS
    // ==========================================

    const atletasRef = collection(
      db,
      "atletas"
    );

    const snapshotAtletas =
      await getDocs(atletasRef);

    const atletas =
      snapshotAtletas.docs.map(
        (documento) => ({
          id: documento.id,
          ...documento.data(),
        })
      );

    const totalAtletas =
      atletas.length;

    // ==========================================
    // CATEGORIAS
    // ==========================================

    const categorias = {};

    atletas.forEach((atleta) => {
      const categoria =
        atleta.categoria ||
        "Sem categoria";

      if (!categorias[categoria]) {
        categorias[categoria] = 0;
      }

      categorias[categoria]++;
    });

    // ==========================================
    // PERÍODO FINANCEIRO
    // ==========================================

    const hoje =
      new Date();

    let mesAtual =
      hoje.getMonth() + 1;

    let anoAtual =
      hoje.getFullYear();

    // Se por algum motivo a data estiver
    // antes do início oficial,
    // usa Agosto/2026 como referência.
    const antesDoInicio =
      anoAtual <
        INICIO_MENSALIDADES.ano ||
      (
        anoAtual ===
          INICIO_MENSALIDADES.ano &&
        mesAtual <
          INICIO_MENSALIDADES.mes
      );

    if (antesDoInicio) {
      mesAtual =
        INICIO_MENSALIDADES.mes;

      anoAtual =
        INICIO_MENSALIDADES.ano;
    }

    const mesNome =
      MESES[mesAtual];

    // ==========================================
    // ATLETAS COBRÁVEIS NO MÊS
    // ==========================================

    const atletasCobraveis =
      atletas.filter((atleta) => {
        if (!atleta.criadoEm) {
          // Atletas antigos sem data confiável
          // entram normalmente no controle.
          return true;
        }

        try {
          let dataCadastro;

          if (
            typeof atleta.criadoEm
              ?.toDate === "function"
          ) {
            dataCadastro =
              atleta.criadoEm.toDate();
          } else {
            dataCadastro =
              new Date(
                atleta.criadoEm
              );
          }

          if (
            Number.isNaN(
              dataCadastro.getTime()
            )
          ) {
            return true;
          }

          const mesCadastro =
            dataCadastro.getMonth() + 1;

          const anoCadastro =
            dataCadastro.getFullYear();

          // Cadastro em ano anterior
          if (
            anoCadastro <
            anoAtual
          ) {
            return true;
          }

          // Cadastro em ano posterior
          if (
            anoCadastro >
            anoAtual
          ) {
            return false;
          }

          // Mesmo ano:
          // só cobra se já estava cadastrado
          // até o mês de referência
          return (
            mesCadastro <=
            mesAtual
          );
        } catch (erro) {
          console.error(
            "Erro ao interpretar cadastro do atleta:",
            erro
          );

          return true;
        }
      });

    const totalCobraveis =
      atletasCobraveis.length;

    // ==========================================
    // PAGAMENTOS DO PERÍODO
    // ==========================================

    const pagamentosRef =
      collection(
        db,
        "pagamentos"
      );

    const consultaPagamentos =
      query(
        pagamentosRef,
        where(
          "mes",
          "==",
          mesAtual
        ),
        where(
          "ano",
          "==",
          anoAtual
        )
      );

    const snapshotPagamentos =
      await getDocs(
        consultaPagamentos
      );

    const pagamentos =
      snapshotPagamentos.docs.map(
        (documento) => ({
          id: documento.id,
          ...documento.data(),
        })
      );

    // ==========================================
    // PAGAMENTOS PAGOS
    // ==========================================

    const pagamentosPagos =
      pagamentos.filter(
        (pagamento) =>
          pagamento.status ===
          "pago"
      );

    // IDs únicos, para evitar contar
    // o mesmo atleta duas vezes
    const atletasPagosIds =
      new Set(
        pagamentosPagos.map(
          (pagamento) =>
            pagamento.atletaId
        )
      );

    const emDia =
      atletasCobraveis.filter(
        (atleta) =>
          atletasPagosIds.has(
            atleta.id
          )
      ).length;

    // ==========================================
    // PENDENTES
    // ==========================================

    const atrasados =
      Math.max(
        totalCobraveis -
          emDia,
        0
      );

    // ==========================================
    // VALOR RECEBIDO
    // ==========================================

    const valorRecebido =
      pagamentosPagos.reduce(
        (
          total,
          pagamento
        ) =>
          total +
          Number(
            pagamento.valor ||
              0
          ),
        0
      );

    // ==========================================
    // ATLETAS PENDENTES
    // ==========================================

    const atletasPendentes =
      atletasCobraveis.filter(
        (atleta) =>
          !atletasPagosIds.has(
            atleta.id
          )
      );

    // ==========================================
    // RETORNO
    // ==========================================

    return {
      totalAtletas,

      totalCobraveis,

      emDia,

      atrasados,

      valorRecebido,

      mesAtual,

      mesNome,

      anoAtual,

      categorias,

      atletas,

      atletasPendentes,
    };
  } catch (erro) {
    console.error(
      "Erro ao buscar estatísticas:",
      erro
    );

    throw erro;
  }
}