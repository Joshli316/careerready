import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CareerReady — Free Job Prep Tools for College Graduates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#FAFAFA",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              backgroundColor: "#7AB648",
              color: "white",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            CR
          </div>
          <span style={{ fontSize: "48px", fontWeight: 700, color: "#303030" }}>
            CareerReady
          </span>
        </div>
        <p
          style={{
            fontSize: "28px",
            color: "#757575",
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          8 free tools to help you go from graduation to your first job offer.
        </p>
      </div>
    ),
    { ...size }
  );
}
