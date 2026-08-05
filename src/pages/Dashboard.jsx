import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
  const cards = [
    {
      titulo: "Atletas",
      valor: 0,
      cor: "#0B2D6B",
      icone: "👥",
    },
    {
      titulo: "Mensalidades Pagas",
      valor: "R$ 0,00",
      cor: "#28a745",
      icone: "💰",
    },
    {
      titulo: "Pendentes",
      valor: 0,
      cor: "#dc3545",
      icone: "⚠️",
    },
    {
      titulo: "Treinos Hoje",
      valor: 1,
      cor: "#F5C400",
      icone: "⚽",
    },
  ];

  return (
    <MainLayout>
      <h1 style={{ marginBottom: "25px", color: "#0B2D6B" }}>
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.titulo}
            style={{
              background: "#fff",
              borderRadius: "15px",
              padding: "25px",
              boxShadow: "0 5px 15px rgba(0,0,0,.08)",
              borderLeft: `8px solid ${card.cor}`,
            }}
          >
            <h3>{card.icone} {card.titulo}</h3>

            <h1
              style={{
                marginTop: "15px",
                color: card.cor,
                fontSize: "34px",
              }}
            >
              {card.valor}
            </h1>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#fff",
          marginTop: "35px",
          borderRadius: "15px",
          padding: "25px",
          boxShadow: "0 5px 15px rgba(0,0,0,.08)",
        }}
      >
        <h2>Últimos atletas cadastrados</h2>

        <p
          style={{
            marginTop: "20px",
            color: "#777",
          }}
        >
          Nenhum atleta cadastrado.
        </p>
      </div>
    </MainLayout>
  );
}