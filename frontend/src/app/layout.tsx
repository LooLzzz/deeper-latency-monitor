'use client'

import { AppShell } from '@/components'
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from 'react-query'

const inter = Inter({ subsets: ['latin'] })
const theme = createTheme({})
const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <ColorSchemeScript />
      </head>

      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider
            theme={theme}
            defaultColorScheme='dark'
          >
            <AppShell>
              {children}
            </AppShell>
          </MantineProvider>
        </QueryClientProvider>
      </body>

    </html>
  )
}
