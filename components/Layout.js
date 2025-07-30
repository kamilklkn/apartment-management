// components/Layout.js
import Head from 'next/head'

export default function Layout({ children, title = 'Apartman Aidat Sistemi' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Apartman aidat takip ve yönetim sistemi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  )
}