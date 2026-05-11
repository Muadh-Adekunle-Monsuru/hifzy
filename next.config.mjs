/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@nozbe/watermelondb"],
  allowedDevOrigins: ["192.168.0.198"],
};

export default nextConfig;
