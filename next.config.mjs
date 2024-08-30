/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "helpful-kiwi-407.convex.cloud",
                pathname: "/api/storage/**",
            },
        ],
    },
};

export default nextConfig;
