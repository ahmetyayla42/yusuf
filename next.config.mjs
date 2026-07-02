/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint hataları derlemeyi durdurmasın (tip kontrolü açık kalır).
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
