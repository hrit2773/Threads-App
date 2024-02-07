/** @type {import('next').NextConfig} */
const nextConfig = {
    
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "img.clerk.com",
          },
          {
            protocol: "https",
            hostname: "images.clerk.dev",
          },
          {
            protocol: "https",
            hostname: "uploadthing.com",
          },
          {
            protocol: "https",
            hostname: "utfs.io",
          },
          {
            protocol: "https",
            hostname: "giphy.com",
          },
          {
            protocol: "https",
            hostname: "placehold.co",
          },
        ],
    },
    experimental:{
      serverActions: {
        bodySizeLimit: '50mb' 
      }
    }
    
};


export default nextConfig;
