import { ImageResponse } from "next/og";

export const alt = "CareerReady — Free Job Prep Tools for College Graduates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1e293b",
              borderRadius: 12,
              color: "white",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            CR
          </div>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: -1,
            }}
          >
            CareerReady
          </span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#64748b",
            fontWeight: 400,
          }}
        >
          Free Job Prep Tools for College Graduates
        </div>
      </div>
    ),
    { ...size },
  );
}
