import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "radial-gradient(circle at 20% 10%, rgba(76,211,100,0.22), transparent 32%), linear-gradient(135deg, #050410 0%, #0B1B6A 48%, #050410 100%)",
          color: "white",
          fontFamily: "Arial",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 700 }}>
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.08)",
                color: "#4CD364",
              }}
            >
              +
            </div>
            Farz+
          </div>
          <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", flex: "1.1 1 0" }}>
              <div style={{ color: "#A0E7B4", fontSize: 28, fontWeight: 700, marginBottom: 22 }}>
                Pakistan-first parent-care OS
              </div>
              <div style={{ fontSize: 74, lineHeight: 0.95, fontWeight: 800, letterSpacing: -2 }}>
                Care for your parents, even when you&apos;re away.
              </div>
              <div style={{ marginTop: 28, color: "#B8C0C8", fontSize: 28, lineHeight: 1.35, maxWidth: 680 }}>
                Human care managers, emergency plans, companionship, verified partners, and transparent family dashboards.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "0.9 1 0",
                border: "1px solid rgba(255,255,255,0.13)",
                background: "rgba(255,255,255,0.07)",
                borderRadius: 34,
                padding: 28,
                boxShadow: "0 30px 100px rgba(76,211,100,0.18)",
              }}
            >
              <div style={{ color: "#A0E7B4", fontSize: 22, fontWeight: 700 }}>Ammi - Lahore</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 26 }}>
                <div style={{ fontSize: 84, fontWeight: 800, fontFamily: "monospace" }}>88</div>
                <div style={{ color: "#4CD364", fontSize: 26, fontWeight: 700 }}>Stable</div>
              </div>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14, color: "#D7DEE6", fontSize: 24 }}>
                <div style={{ display: "flex" }}>Medicine completed</div>
                <div style={{ display: "flex" }}>Emergency plan active</div>
                <div style={{ display: "flex" }}>Care manager: Ayesha</div>
                <div style={{ display: "flex" }}>Update sent to Dubai + Karachi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
