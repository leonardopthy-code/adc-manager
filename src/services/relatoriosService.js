import {
  collection,
  getDocs,
} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

export async function listarTodasPresencas() {
  const presencasRef = collection(
    db,
    "presencas"
  );

  const snapshot = await getDocs(
    presencasRef
  );

  return snapshot.docs.map(
    (documento) => ({
      id: documento.id,
      ...documento.data(),
    })
  );
}