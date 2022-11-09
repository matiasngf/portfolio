import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'

import '../styles/globals.css'


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
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
      <Component {...pageProps} />
    </>
  )
}