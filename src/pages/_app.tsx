import Navbar from '@/components/navbar';
import { ApiProvider } from '@/contexts/ApiContext';
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@/styles/fonts.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'sonner'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FirebaseProvider>
        <ApiProvider>
          <div className="flex flex-col">
            <Navbar />
            <div className="page-width py-6">
              <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
              </Head>
              <Component {...pageProps} />
            </div>
          </div>
          <Toaster />
        </ApiProvider>
      </FirebaseProvider>
    </ThemeProvider>
  );
}
