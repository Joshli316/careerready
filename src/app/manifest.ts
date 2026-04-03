import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareerReady — Job Prep Toolkit",
    short_name: "CareerReady",
    description:
      "8 free tools that help recent graduates build resumes, practice interviews, and land their first job.",
    start_url: "/know-yourself",
    display: "standalone",
    background_color: "#FAFAFA",
    theme_color: "#0B1120",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon?size=192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
