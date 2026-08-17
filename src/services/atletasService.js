import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

const atletasRef = collection(db, "atletas");
const pagamentosRef = collection(db, "pagamentos");

// ========================================
// ATLETAS
// ========================================

// Cadastrar atleta
export async function adicionarAtleta(atleta) {
  try {
    console.log("Tentando salvar:", atleta);

    const documento = await addDoc(atletasRef, {
      ...atleta,
      criadoEm: serverTimestamp(),
    });

    console.log(
      "Salvou no Firebase!",
      documento.id
    );

    return {
      id: documento.id,
      ...atleta,
    };
  } catch (erro) {
    console.error(
      "ERRO FIREBASE:",
      erro
    );

    throw erro;
  }
}

// Listar atletas
export async function listarAtletas() {
  try {
    const snapshot =
      await getDocs(atletasRef);

    return snapshot.docs.map(
      (documento) => ({
        id: documento.id,
        ...documento.data(),
      })
    );
  } catch (erro) {
    console.error(
      "Erro ao listar atletas:",
      erro
    );

    return [];
  }
}

// ========================================
// BUSCAR ATLETA POR ID
// ========================================

export async function buscarAtletaPorId(id) {
  try {
    const referencia = doc(
      db,
      "atletas",
      id
    );

    const snapshot =
      await getDoc(referencia);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (erro) {
    console.error(
      "Erro ao buscar atleta:",
      erro
    );

    throw erro;
  }
}

// Excluir atleta
export async function excluirAtleta(id) {
  try {
    await deleteDoc(
      doc(db, "atletas", id)
    );
  } catch (erro) {
    console.error(
      "Erro ao excluir atleta:",
      erro
    );

    throw erro;
  }
}

// Editar atleta
export async function editarAtleta(
  id,
  novosDados
) {
  try {
    await updateDoc(
      doc(db, "atletas", id),
      novosDados
    );
  } catch (erro) {
    console.error(
      "Erro ao editar atleta:",
      erro
    );

    throw erro;
  }
}

// ========================================
// MENSALIDADES
// ========================================

// Listar pagamentos de um mês
export async function listarPagamentos(
  mes,
  ano
) {
  try {
    const consulta = query(
      pagamentosRef,
      where("mes", "==", mes),
      where("ano", "==", ano)
    );

    const snapshot =
      await getDocs(consulta);

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

// ========================================
// BUSCAR PAGAMENTOS DE UM ATLETA
// ========================================

export async function buscarPagamentosDoAtleta(
  atletaId
) {
  try {
    const consulta = query(
      pagamentosRef,
      where(
        "atletaId",
        "==",
        atletaId
      )
    );

    const snapshot =
      await getDocs(consulta);

    const pagamentos =
      snapshot.docs.map(
        (documento) => ({
          id: documento.id,
          ...documento.data(),
        })
      );

    // Organiza do mais recente para o mais antigo
    return pagamentos.sort(
      (a, b) => {
        const anoA =
          Number(a.ano || 0);

        const anoB =
          Number(b.ano || 0);

        const mesA =
          Number(a.mes || 0);

        const mesB =
          Number(b.mes || 0);

        if (anoA !== anoB) {
          return anoB - anoA;
        }

        return mesB - mesA;
      }
    );
  } catch (erro) {
    console.error(
      "Erro ao buscar pagamentos do atleta:",
      erro
    );

    throw erro;
  }
}

// Registrar pagamento
export async function registrarPagamento(
  atletaId,
  atletaNome,
  mes,
  ano,
  valor
) {
  try {
    const pagamentoExistente =
      query(
        pagamentosRef,
        where(
          "atletaId",
          "==",
          atletaId
        ),
        where("mes", "==", mes),
        where("ano", "==", ano)
      );

    const snapshot =
      await getDocs(
        pagamentoExistente
      );

    // Se já existe pagamento para aquele mês,
    // atualiza o documento existente
    if (!snapshot.empty) {
      const documento =
        snapshot.docs[0];

      await updateDoc(
        doc(
          db,
          "pagamentos",
          documento.id
        ),
        {
          status: "pago",
          valor,
          atualizadoEm:
            serverTimestamp(),
        }
      );

      return {
        id: documento.id,
        atletaId,
        atletaNome,
        mes,
        ano,
        valor,
        status: "pago",
      };
    }

    // Se não existe, cria novo pagamento
    const documento =
      await addDoc(
        pagamentosRef,
        {
          atletaId,
          atletaNome,
          mes,
          ano,
          valor,
          status: "pago",
          criadoEm:
            serverTimestamp(),
        }
      );

    return {
      id: documento.id,
      atletaId,
      atletaNome,
      mes,
      ano,
      valor,
      status: "pago",
    };
  } catch (erro) {
    console.error(
      "Erro ao registrar pagamento:",
      erro
    );

    throw erro;
  }
}

// Tornar pagamento pendente
export async function tornarPagamentoPendente(
  atletaId,
  mes,
  ano
) {
  try {
    const consulta = query(
      pagamentosRef,
      where(
        "atletaId",
        "==",
        atletaId
      ),
      where("mes", "==", mes),
      where("ano", "==", ano)
    );

    const snapshot =
      await getDocs(consulta);

    if (snapshot.empty) {
      return;
    }

    const documento =
      snapshot.docs[0];

    await updateDoc(
      doc(
        db,
        "pagamentos",
        documento.id
      ),
      {
        status: "pendente",
        atualizadoEm:
          serverTimestamp(),
      }
    );
  } catch (erro) {
    console.error(
      "Erro ao tornar pagamento pendente:",
      erro
    );

    throw erro;
  }
}