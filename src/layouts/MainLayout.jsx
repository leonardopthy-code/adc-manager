import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f6fb",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Header />

        <main
          style={{
            padding: "30px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}