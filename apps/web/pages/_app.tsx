import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { MDXProvider } from '@mdx-js/react'
import '@/styles/globals.css'
import { mdxCustomComponents } from '@/components/mdx';
import { BaseLayout } from '@/layouts/base-layout';

import { Inter, Roboto_Mono } from 'next/font/google';
import { PageWithLayout } from '@/types';

const fontSans = Inter({
  weight: ["300", "400", "600"],
  variable: "--font-sans",
  subsets: ["latin-ext"],
});

const fontMono = Roboto_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin-ext"],
})

export default function MyApp({ Component, pageProps }: AppProps) {

  const ComponentWithLayout: PageWithLayout = Component as any;
  const Layout = ComponentWithLayout.Layout ||  BaseLayout;
  return (
    <div className='antialiased'>
      <DefaultSeo
        title='Experiments'
        titleTemplate="%s | MatiasGF.dev"
        description="Some experiments using Three.js"
        twitter={{
          cardType: 'summary_large_image',
          handle: '@matiNotFound',
        }}
        openGraph={{
          images: [
            {
              url: `https://matiasgf.dev/og-image-1500-1000.jpg`,
              width: 1500,
              height: 1000,
            }
          ]
        }}
      />
      <style jsx global>
      {`
        :root {
          --font-sans: ${fontSans.style.fontFamily};
          --font-mono: ${fontMono.style.fontFamily};
        }
      `}
      </style>
      <MDXProvider components={mdxCustomComponents}>
        <Layout className={fontSans.variable}>
          <Component {...pageProps} />
        </Layout>
      </MDXProvider>
      <Analytics />
    </div>
  )
}