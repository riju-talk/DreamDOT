import type { NextConfig } from "next";
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const nextConfig: NextConfig = {
  // output: "standalone", // Disable standalone output to avoid static export issues
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'canbind.ca',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mcentre.lk',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.done.tap('CopyPrismaGenerated', () => {
            const generatedDirs = [
              'src/lib/generated/user',
              'src/lib/generated/social',
              'src/lib/generated/items',
              'src/lib/generated/community',
            ];

            const distDir = join(process.cwd(), '.next/standalone/src/lib/generated');
            
            const copyDirRecursive = (src, dest) => {
              mkdirSync(dest, { recursive: true });
              const entries = readdirSync(src);
              
              entries.forEach((entry) => {
                const srcPath = join(src, entry);
                const destPath = join(dest, entry);
                const stat = statSync(srcPath);
                
                if (stat.isFile()) {
                  try {
                    copyFileSync(srcPath, destPath);
                  } catch (err) {
                    // Skip files that can't be copied
                  }
                } else if (stat.isDirectory() && entry !== 'runtime') {
                  copyDirRecursive(srcPath, destPath);
                }
              });
            };

            generatedDirs.forEach((dir) => {
              const src = join(process.cwd(), dir);
              const dest = join(distDir, dir.split('/').pop() || '');

              if (existsSync(src)) {
                try {
                  copyDirRecursive(src, dest);
                } catch (err) {
                  console.warn(`Failed to copy ${dir}:`, err);
                }
              }
            });
          });
        },
      });
    }
    return config;
  },
};

export default nextConfig;
