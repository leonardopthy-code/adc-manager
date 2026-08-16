import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

const presencasRef = collection(
  db,
  "presencas"
);

// Buscar presenças
export async function buscarPresencas(
  data,
  treino
) {
  const consulta = query(
    presencasRef,
    where("data", "==", data),
    where("treino", "==", treino)
  );

  const snapshot = await getDocs(
    consulta
  );

  return snapshot.docs.map(
    (documento) => ({
      id: documento.id,
      ...documento.data(),
    })
  );
}

// Salvar ou atualizar presença
export async function salvarPresenca({
  atletaId,
  atletaNome,
  data,
  treino,
  presente,
}) {
  const consulta = query(
    presencasRef,
    where("atletaId", "==", atletaId),
    where("data", "==", data),
    where("treino", "==", treino)
  );

  const snapshot = await getDocs(
    consulta
  );

  // Se já existe, atualiza
  if (!snapshot.empty) {
    const documentoExistente =
      snapshot.docs[0];

    await updateDoc(
      doc(
        db,
        "presencas",
        documentoExistente.id
      ),
      {
        presente,
        atualizadoEm:
          serverTimestamp(),
      }
    );

    return {
      id: documentoExistente.id,
      atletaId,
      atletaNome,
      data,
      treino,
      presente,
    };
  }

  // Se não existe, cria
  const documento = await addDoc(
    presencasRef,
    {
      atletaId,
      atletaNome,
      data,
      treino,
      presente,
      criadoEm:
        serverTimestamp(),
    }
  );

  return {
    id: documento.id,
    atletaId,
    atletaNome,
    data,
    treino,
    presente,
  };
}