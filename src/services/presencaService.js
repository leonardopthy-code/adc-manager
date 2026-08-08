import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

const presencasRef = collection(db, "presencas");

export async function buscarPresencas(data, treino) {
  const consulta = query(
    presencasRef,
    where("data", "==", data),
    where("treino", "==", treino)
  );

  const snapshot = await getDocs(consulta);

  return snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }));
}

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

  const snapshot = await getDocs(consulta);

  if (!snapshot.empty) {
    throw new Error(
      "Esta presença já está registrada."
    );
  }

  const documento = await addDoc(
    presencasRef,
    {
      atletaId,
      atletaNome,
      data,
      treino,
      presente,
      criadoEm: serverTimestamp(),
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