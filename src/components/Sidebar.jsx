import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaMoneyBill,
  FaClipboardCheck,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "#0A2A66",
        color: "white",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#FFD700", marginBottom: "30px" }}>
        🐊 ADC Manager
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <Link to="/dashboard">
          <FaHome /> Dashboard
        </Link>

        <Link to="/atletas">
          <FaUsers /> Atletas
        </Link>

        <Link to="/financeiro">
          <FaMoneyBill /> Financeiro
        </Link>

        <Link to="/presenca">
          <FaClipboardCheck /> Presença
        </Link>

        <Link to="/relatorios">
          <FaChartBar /> Relatórios
        </Link>

        <Link to="/configuracoes">
          <FaCog /> Configurações
        </Link>
      </nav>
    </div>
  );
}