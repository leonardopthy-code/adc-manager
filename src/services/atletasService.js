import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

const atletasRef = collection(db, "atletas");

// Cadastrar atleta
export async function adicionarAtleta(atleta) {
  try {
    console.log("Tentando salvar:", atleta);

    const documento = await addDoc(atletasRef, {
      ...atleta,
      criadoEm: serverTimestamp(),
    });

    console.log("Salvou no Firebase!", documento.id);

    return {
      id: documento.id,
      ...atleta,
    };
  } catch (erro) {
    console.error("ERRO FIREBASE:", erro);
    throw erro;
  }
}

// Listar atletas
export async function listarAtletas() {
  try {
    const snapshot = await getDocs(atletasRef);

    return snapshot.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }));
  } catch (erro) {
    console.error("Erro ao listar atletas:", erro);
    return [];
  }
}

// Excluir atleta
export async function excluirAtleta(id) {
  try {
    await deleteDoc(doc(db, "atletas", id));
  } catch (erro) {
    console.error("Erro ao excluir atleta:", erro);
    throw erro;
  }
}

// Editar atleta
export async function editarAtleta(id, novosDados) {
  try {
    await updateDoc(doc(db, "atletas", id), novosDados);
  } catch (erro) {
    console.error("Erro ao editar atleta:", erro);
    throw erro;
  }
}