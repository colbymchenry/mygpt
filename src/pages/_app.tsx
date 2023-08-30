import Navbar from '@/components/navbar';
import { ApiProvider } from '@/contexts/ApiContext';
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@/styles/fonts.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FirebaseProvider>
        <ApiProvider>
          <div className="flex flex-col">
            <Navbar />
            <div className="page-width py-6">
              <Component {...pageProps} />
            </div>
          </div>
        </ApiProvider>
      </FirebaseProvider>
    </ThemeProvider>
  );
}
