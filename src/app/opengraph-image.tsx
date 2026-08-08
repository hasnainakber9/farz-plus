import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const stages = [
  ["09:18", "Family message", "Received"],
  ["09:19", "Risk detected", "High risk"],
  ["09:21", "Corti context", "Grounded"],
  ["09:22", "Human review", "In progress"],
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F8FBF9",
          color: "#143A35",
          fontFamily: "Arial, sans-serif",
          padding: 54,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #DCE9E5",
            paddingBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 46, fontWeight: 800 }}>
            <span>Farz</span>
            <span style={{ color: "#08A98A" }}>+</span>
          </div>
          <div style={{ display: "flex", color: "#087B69", fontSize: 18, fontWeight: 700 }}>
            Human-led care operations
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 560 }}>
            <div style={{ color: "#087B69", fontSize: 18, fontWeight: 800, marginBottom: 18 }}>
              LAHORE TO DUBAI
            </div>
            <div style={{ fontSize: 64, lineHeight: 1.02, fontWeight: 700 }}>
              Care that stays present, even when you can&apos;t.
            </div>
            <div style={{ marginTop: 22, color: "#536B66", fontSize: 23, lineHeight: 1.4 }}>
              Families, care managers, and source-grounded Corti context in one accountable handoff.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 465,
              border: "1px solid #CFE0DB",
              background: "#FFFFFF",
              borderRadius: 8,
              boxShadow: "0 18px 46px rgba(20,58,53,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #DCE9E5",
                padding: "18px 20px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 14, color: "#70847E", fontWeight: 700 }}>MEDICATION SAFETY</span>
                <span style={{ marginTop: 5, fontSize: 20, fontWeight: 800 }}>Live handoff</span>
              </div>
              <span style={{ color: "#8B6718", background: "#FFF8E7", padding: "7px 10px", fontSize: 13 }}>
                Human review
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {stages.map(([time, label, status], index) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: index === stages.length - 1 ? "none" : "1px solid #E0ECE8",
                    padding: "14px 20px",
                  }}
                >
                  <span style={{ width: 58, color: "#70847E", fontSize: 14 }}>{time}</span>
                  <span
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: 99,
                      background: index === stages.length - 1 ? "#FFF4D7" : "#E8F6F2",
                      border: index === stages.length - 1 ? "1px solid #E2C675" : "1px solid #9FD8CC",
                      marginRight: 13,
                    }}
                  />
                  <span style={{ display: "flex", flex: 1, fontSize: 16, fontWeight: 700 }}>{label}</span>
                  <span style={{ color: "#60756F", fontSize: 13 }}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
