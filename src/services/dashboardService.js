import { collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

export async function buscarEstatisticas() {
  const atletasRef = collection(db, "atletas");

  const snapshot = await getDocs(atletasRef);

  const atletas = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  const totalAtletas = atletas.length;

  const emDia = atletas.filter(
    atleta => atleta.mensalidade === "Em dia"
  ).length;

  const atrasados = atletas.filter(
    atleta => atleta.mensalidade === "Atrasado"
  ).length;

  const categorias = {};

  atletas.forEach(atleta => {
    if (!categorias[atleta.categoria]) {
      categorias[atleta.categoria] = 0;
    }

    categorias[atleta.categoria]++;
  });

  return {
    totalAtletas,
    emDia,
    atrasados,
    categorias,
    atletas,
  };
}