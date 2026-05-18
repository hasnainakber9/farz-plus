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
          background:
            "radial-gradient(circle at 18% 14%, rgba(56,214,176,0.25), transparent 30%), radial-gradient(circle at 86% 20%, rgba(230,250,243,0.12), transparent 24%), linear-gradient(135deg, #07111F 0%, #07111F 62%, #0A1C2E 100%)",
          color: "white",
          fontFamily: "Gilroy",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 28,
                border: "1px solid rgba(230,250,243,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(145deg, rgba(56,214,176,0.22), rgba(255,255,255,0.04))",
                boxShadow: "0 24px 80px rgba(56,214,176,0.28)",
                color: "#38D6B0",
                fontSize: 56,
                fontWeight: 800,
              }}
            >
              G
            </div>
            <div style={{ display: "flex", alignItems: "baseline", fontSize: 58, fontWeight: 800 }}>
              <span>Farz</span>
              <span style={{ color: "#38D6B0" }}>+</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", flex: "1.05 1 0" }}>
              <div style={{ color: "#E6FAF3", fontSize: 26, fontWeight: 800, marginBottom: 22 }}>
                Pakistan&apos;s parent-care operating system
              </div>
              <div style={{ fontSize: 70, lineHeight: 0.98, fontWeight: 800 }}>
                Care for your parents, even when you&apos;re away.
              </div>
              <div style={{ marginTop: 28, color: "#D7DEE6", fontSize: 27, lineHeight: 1.35, maxWidth: 690 }}>
                Care managers, emergency plans, companionship, verified partners, and family dashboards.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "0.95 1 0",
                border: "1px solid rgba(230,250,243,0.16)",
                background: "rgba(255,255,255,0.07)",
                borderRadius: 34,
                padding: 30,
                boxShadow: "0 30px 100px rgba(56,214,176,0.2)",
              }}
            >
              <div style={{ color: "#E6FAF3", fontSize: 24, fontWeight: 800 }}>Ammi - Lahore</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28 }}>
                <div style={{ display: "flex", fontSize: 86, fontWeight: 800 }}>88</div>
                <div style={{ color: "#38D6B0", fontSize: 28, fontWeight: 800 }}>Stable</div>
              </div>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14, color: "#E6FAF3", fontSize: 23 }}>
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
