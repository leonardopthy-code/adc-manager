import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaMoneyBill,
  FaClipboardCheck,
  FaChartBar,
  FaCog,
  FaInstagram,
} from "react-icons/fa";

export default function Sidebar() {
  const links = [
    {
      to: "/dashboard",
      icon: <FaHome />,
      label: "Dashboard",
    },
    {
      to: "/atletas",
      icon: <FaUsers />,
      label: "Atletas",
    },
    {
      to: "/mensalidades",
      icon: <FaMoneyBill />,
      label: "Mensalidades",
    },
    {
      to: "/presenca",
      icon: <FaClipboardCheck />,
      label: "Presença",
    },
    {
      to: "/relatorios",
      icon: <FaChartBar />,
      label: "Relatórios",
    },
    {
      to: "/configuracoes",
      icon: <FaCog />,
      label: "Configurações",
    },
  ];

  return (
    <aside className="sidebar">

      {/* LOGO */}

      <div className="sidebar-logo">
        <img
          src="/escudo-adc.png"
          alt="Escudo da Associação Desportiva Cicynho"
        />

        <div>
          <h2>ADC Manager</h2>
          <span>
            Associação Desportiva Cicynho
          </span>
        </div>
      </div>

      {/* MENU */}

      <nav className="sidebar-menu">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            <span className="sidebar-icon">
              {link.icon}
            </span>

            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* RODAPÉ */}

      <div className="sidebar-footer">

        <img
          src="/escudo-adc.png"
          alt="ADC"
        />

        <div className="sidebar-footer-conteudo">

          <strong>ADC Manager</strong>

          <span>Sistema de gestão</span>

          <div className="sidebar-desenvolvedor">

            <small>
              Desenvolvido por Leonardo Rafael
            </small>

            <a
              href="https://www.instagram.com/leonardorafael.07/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />

              @leonardorafael.07
            </a>

          </div>

        </div>

      </div>

    </aside>
  );
}