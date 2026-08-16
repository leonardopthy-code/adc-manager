import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../services/firebase";

export default function ProtectedRoute({
  children,
}) {
  const [usuario, setUsuario] =
    useState(null);

  const [carregando, setCarregando] =
    useState(true);

  useEffect(() => {
    const cancelarObservador =
      onAuthStateChanged(
        auth,
        (usuarioFirebase) => {
          setUsuario(usuarioFirebase);
          setCarregando(false);
        }
      );

    return () =>
      cancelarObservador();
  }, []);

  if (carregando) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0B2D6B",
          fontWeight: "600",
        }}
      >
        Carregando ADC Manager...
      </div>
    );
  }

  if (!usuario) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}