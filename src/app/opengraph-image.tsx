import { ImageResponse } from "next/og";

export const alt = "CareerReady — 8 Free Job Prep Tools for College Graduates (EN/ZH)";
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
          background: "linear-gradient(135deg, #0B1120 0%, #1e293b 50%, #1a1a3e 100%)",
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
              backgroundColor: "#ffffff",
              borderRadius: 12,
              color: "#0B1120",
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
              color: "#ffffff",
              letterSpacing: -1,
            }}
          >
            CareerReady
          </span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
            fontWeight: 400,
          }}
        >
          Free Job Prep Tools for College Graduates
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#64748b",
            fontWeight: 400,
            marginTop: 12,
          }}
        >
          8 tools &middot; Bilingual EN/ZH &middot; No sign-up needed
        </div>
      </div>
    ),
    { ...size },
  );
}
