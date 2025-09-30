import type { NextConfig } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';

const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    PACKAGE_NAME: packageJson.name,
    APP_NAME: packageJson.simpleName,
    APP_VERSION: packageJson.version,
    APP_VERSION_NAME: packageJson.versionName,
  },
  output: 'export',
  basePath: packageJson.basePath,
};

export default nextConfig;
