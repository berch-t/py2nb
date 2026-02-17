import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Py2Nb — Python to Jupyter Notebook converter with AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const descriptions: Record<string, string> = {
  fr: "Transformez vos scripts Python en notebooks Jupyter professionnels avec l\u2019IA",
  en: "Transform your Python scripts into professional Jupyter notebooks with AI",
};

const bottomLabels: Record<string, string> = {
  fr: "Gratuit",
  en: "Free",
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "fr";

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
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative gradient blobs */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#fafafa",
              letterSpacing: -2,
            }}
          >
            Py2Nb
          </div>
        </div>

        {/* Arrow transformation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              padding: "12px 28px",
              borderRadius: 12,
              background: "rgba(63,63,70,0.5)",
              border: "1px solid rgba(113,113,122,0.3)",
              fontSize: 28,
              color: "#a1a1aa",
              fontWeight: 600,
            }}
          >
            .py
          </div>
          <div style={{ fontSize: 36, color: "#6366f1" }}>{"\u2192"}</div>
          <div
            style={{
              padding: "12px 28px",
              borderRadius: 12,
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
              fontSize: 28,
              color: "#818cf8",
              fontWeight: 600,
            }}
          >
            .ipynb
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 26,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          {descriptions[lang]}
        </div>

        {/* Bottom tag */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            gap: 32,
            fontSize: 18,
            color: "#71717a",
          }}
        >
          <span>Claude AI</span>
          <span>{"\u2022"}</span>
          <span>Jupytext</span>
          <span>{"\u2022"}</span>
          <span>{bottomLabels[lang]}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
