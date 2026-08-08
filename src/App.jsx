import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Atletas from "./pages/Atletas";
import Mensalidades from "./pages/Mensalidades";
import Presenca from "./pages/Presenca";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/atletas"
        element={<Atletas />}
      />

      <Route
        path="/mensalidades"
        element={<Mensalidades />}
      />

      <Route
        path="/presenca"
        element={<Presenca />}
      />
    </Routes>
  );
}