import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  getFirestore,
} from "firebase/firestore";

import app from "./firebase";

const db = getFirestore(app);

// ==========================================
// LISTAR TODAS AS PRESENÇAS
// ==========================================

export async function listarTodasPresencas() {
  try {
    const presencasRef =
      collection(
        db,
        "presencas"
      );

    const snapshot =
      await getDocs(
        presencasRef
      );

    return snapshot.docs.map(
      (documento) => ({
        id: documento.id,
        ...documento.data(),
      })
    );
  } catch (erro) {
    console.error(
      "Erro ao listar presenças:",
      erro
    );

    throw erro;
  }
}

// ==========================================
// LISTAR TODOS OS PAGAMENTOS
// ==========================================

export async function listarTodosPagamentos() {
  try {
    const pagamentosRef =
      collection(
        db,
        "pagamentos"
      );

    const snapshot =
      await getDocs(
        pagamentosRef
      );

    return snapshot.docs.map(
      (documento) => ({
        id: documento.id,
        ...documento.data(),
      })
    );
  } catch (erro) {
    console.error(
      "Erro ao listar pagamentos:",
      erro
    );

    throw erro;
  }
}

// ==========================================
// PAGAMENTOS POR PERÍODO
// ==========================================

export async function listarPagamentosPorPeriodo(
  mes,
  ano
) {
  try {
    const pagamentosRef =
      collection(
        db,
        "pagamentos"
      );

    const consulta =
      query(
        pagamentosRef,
        where(
          "mes",
          "==",
          Number(mes)
        ),
        where(
          "ano",
          "==",
          Number(ano)
        )
      );

    const snapshot =
      await getDocs(
        consulta
      );

    return snapshot.docs.map(
      (documento) => ({
        id: documento.id,
        ...documento.data(),
      })
    );
  } catch (erro) {
    console.error(
      "Erro ao listar pagamentos do período:",
      erro
    );

    throw erro;
  }
}

// ==========================================
// RESUMO FINANCEIRO DO PERÍODO
// ==========================================

export async function buscarResumoFinanceiro(
  mes,
  ano
) {
  try {
    const pagamentos =
      await listarPagamentosPorPeriodo(
        mes,
        ano
      );

    const pagos =
      pagamentos.filter(
        (pagamento) =>
          pagamento.status ===
          "pago"
      );

    const pendentesRegistrados =
      pagamentos.filter(
        (pagamento) =>
          pagamento.status ===
          "pendente"
      );

    const valorRecebido =
      pagos.reduce(
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

    return {
      pagamentos,
      pagos,
      pendentesRegistrados,
      quantidadePagas:
        pagos.length,
      valorRecebido,
    };
  } catch (erro) {
    console.error(
      "Erro ao gerar resumo financeiro:",
      erro
    );

    throw erro;
  }
}