import type { NextConfig } from "next";
import PWA from "next-pwa";

const withPWA = PWA({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  devIndicators: false,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default withPWA({ ...nextConfig });
