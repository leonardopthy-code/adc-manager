import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import app from "./firebase";

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
      snapshotAtletas.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

    const totalAtletas = atletas.length;

    // ==========================================
    // CATEGORIAS
    // ==========================================

    const categorias = {};

    atletas.forEach((atleta) => {
      const categoria =
        atleta.categoria || "Sem categoria";

      if (!categorias[categoria]) {
        categorias[categoria] = 0;
      }

      categorias[categoria]++;
    });

    // ==========================================
    // MÊS ATUAL
    // ==========================================

    const hoje = new Date();

    const mesAtual =
      hoje.getMonth() + 1;

    const anoAtual =
      hoje.getFullYear();

    // ==========================================
    // PAGAMENTOS DO MÊS ATUAL
    // ==========================================

    const pagamentosRef = collection(
      db,
      "pagamentos"
    );

    const consultaPagamentos = query(
      pagamentosRef,
      where("mes", "==", mesAtual),
      where("ano", "==", anoAtual)
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
    // PAGAMENTOS EM DIA
    // ==========================================

    const pagamentosPagos =
      pagamentos.filter(
        (pagamento) =>
          pagamento.status === "pago"
      );

    const emDia =
      pagamentosPagos.length;

    // ==========================================
    // ATRASADOS / PENDENTES
    // ==========================================

    const atrasados =
      totalAtletas - emDia;

    // ==========================================
    // VALOR RECEBIDO
    // ==========================================

    const valorRecebido =
      pagamentosPagos.reduce(
        (total, pagamento) =>
          total +
          Number(pagamento.valor || 0),
        0
      );

    // ==========================================
    // RETORNO
    // ==========================================

    return {
      totalAtletas,
      emDia,
      atrasados,
      valorRecebido,
      mesAtual,
      anoAtual,
      categorias,
      atletas,
    };
  } catch (erro) {
    console.error(
      "Erro ao buscar estatísticas:",
      erro
    );

    throw erro;
  }
}