import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Atletas from "./pages/Atletas";
import DetalhesAtleta from "./pages/DetalhesAtleta";
import Mensalidades from "./pages/Mensalidades";
import Presenca from "./pages/Presenca";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ATLETAS */}
      <Route
        path="/atletas"
        element={
          <ProtectedRoute>
            <Atletas />
          </ProtectedRoute>
        }
      />

      {/* FICHA INDIVIDUAL DO ATLETA */}
      <Route
        path="/atletas/:id"
        element={
          <ProtectedRoute>
            <DetalhesAtleta />
          </ProtectedRoute>
        }
      />

      {/* MENSALIDADES */}
      <Route
        path="/mensalidades"
        element={
          <ProtectedRoute>
            <Mensalidades />
          </ProtectedRoute>
        }
      />

      {/* PRESENÇA */}
      <Route
        path="/presenca"
        element={
          <ProtectedRoute>
            <Presenca />
          </ProtectedRoute>
        }
      />

      {/* RELATÓRIOS */}
      <Route
        path="/relatorios"
        element={
          <ProtectedRoute>
            <Relatorios />
          </ProtectedRoute>
        }
      />

      {/* CONFIGURAÇÕES */}
      <Route
        path="/configuracoes"
        element={
          <ProtectedRoute>
            <Configuracoes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}