import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "YieldCast — sponsor matching for independent shows";

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
          background: "#10241b",
          color: "#f4f1ea",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 2 }}>YIELDCAST</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 68, lineHeight: 1.05, maxWidth: 860 }}>
          Match sponsors to the show you already make.
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#b7cfc2" }}>Audience profile · brand fit · pitch tracker</div>
      </div>
    ),
    size,
  );
}
