import { Html, Head, Main, NextScript } from 'next/document'
import React from 'react';
import { useScroll } from 'react-use';

const MyDocument = () => {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://use.typekit.net/wdp8lui.css" />
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Coda:wght@400;800&display=swap" rel="stylesheet"/>
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
      </Html>
    )
}

export default MyDocument