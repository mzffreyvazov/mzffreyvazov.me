import withMDX from '@next/mdx'
import { NextConfig } from 'next'

export default withMDX()({
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  redirects: async () => [
    {
      source: '/posts/:slug',
      destination: '/thoughts/:slug',
      permanent: false,
    },
  ],
  experimental: {
    viewTransition: true,
    mdxRs: {
      mdxType: 'gfm',
    },
  },
  transpilePackages: ['shiki'],
  images: {
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack: (config: any) => {
    // Exclude .md files from being processed by webpack as modules
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source'
    })
    return config
  },
} satisfies NextConfig)
