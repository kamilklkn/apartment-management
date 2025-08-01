// pages/_app.js
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Apartman Aidat Sistemi</title>
        <meta name="description" content="Apartman aidat takip ve yönetim sistemi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', system-ui, sans-serif;
            background-color: #f9fafb;
          }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </>
  )
}