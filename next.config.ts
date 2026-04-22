import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// CSP hardening:
// - next/font/google self-hosts the fonts → rimosse le origini fonts.googleapis.com / fonts.gstatic.com
// - 'unsafe-eval' è necessario solo per il refresh di Next.js in sviluppo, quindi viene aggiunto solo in dev
// - 'unsafe-inline' su script-src resta perché Next.js inietta script inline di idratazione;
//   per rimuoverlo è necessaria una middleware con nonce dinamico (vedi docs Next.js)
// - aggiunti: frame-ancestors, upgrade-insecure-requests, manifest-src, worker-src
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
  img-src 'self' data: blob:;
  media-src 'self';
  connect-src 'self'${isDev ? " ws: wss:" : ""};
  worker-src 'self' blob:;
  manifest-src 'self';
  frame-src 'none';
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\n/g, " ").trim();

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  {
    key: "Origin-Agent-Cluster",
    value: "?1",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
