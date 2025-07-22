import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Providers } from '@/components/providers';
import { I18nProviderClient } from '@/internationalization/client';
import { getCurrentLocale } from '@/internationalization/server';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Monad Farcaster MiniApp Template',
  description: 'A template for building mini-apps on Farcaster and Monad',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProviderClient locale={await getCurrentLocale()}>
          <LocaleSwitcher />
          <Providers>{children}</Providers>
        </I18nProviderClient>
      </body>
    </html>
  )
}
