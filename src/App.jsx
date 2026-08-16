import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Atletas from "./pages/Atletas";
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

      {/* ÁREA PROTEGIDA */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/atletas"
        element={
          <ProtectedRoute>
            <Atletas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mensalidades"
        element={
          <ProtectedRoute>
            <Mensalidades />
          </ProtectedRoute>
        }
      />

      <Route
        path="/presenca"
        element={
          <ProtectedRoute>
            <Presenca />
          </ProtectedRoute>
        }
      />

      <Route
        path="/relatorios"
        element={
          <ProtectedRoute>
            <Relatorios />
          </ProtectedRoute>
        }
      />

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