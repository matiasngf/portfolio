import type { AppProps } from 'next/app'

import '../styles/styles.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}