import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

const configuracoesRef = doc(
  db,
  "configuracoes",
  "geral"
);

// ========================================
// BUSCAR CONFIGURAÇÕES
// ========================================

export async function buscarConfiguracoes() {
  try {
    const snapshot =
      await getDoc(configuracoesRef);

    if (!snapshot.exists()) {
      return {
        nomeProjeto:
          "Associação Desportiva Cicynho",

        mensalidade:
          "20",

        telefone:
          "",

        localTreino:
          "Campo Alternativo",
      };
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (erro) {
    console.error(
      "Erro ao buscar configurações:",
      erro
    );

    throw erro;
  }
}

// ========================================
// SALVAR CONFIGURAÇÕES
// ========================================

export async function salvarConfiguracoes(
  dados
) {
  try {
    await setDoc(
      configuracoesRef,
      {
        ...dados,

        atualizadoEm:
          serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    return true;
  } catch (erro) {
    console.error(
      "Erro ao salvar configurações:",
      erro
    );

    throw erro;
  }
}