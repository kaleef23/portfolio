import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  // put the domain where images will be hosted here
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ic.pics.livejournal.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
