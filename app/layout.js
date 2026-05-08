import "@css/plugins/bootstrap-grid.css";
import { Atkinson_Hyperlegible, Space_Grotesk } from "next/font/google";
import Script from "next/script";

import "@css/plugins/magnific-popup.css";
import "@css/plugins/swiper.min.css";
import "@fonts/font-awesome/css/all.min.css";

import "@scss/style.css";

const atkinson = Atkinson_Hyperlegible({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-atkinson',
  display: 'swap',
})

const space_grotest = Space_Grotesk({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  userScalable: 0
}

export const metadata = {
  title: "Cyril Florita - Designer and Developer",
  description: "Cyril Florita's professional website showcasing his background, skills, experience, and projects as a designer and developer.",
  icons: {
    icon: './favicon.ico',
    shortcut: './favicon.ico',
    apple: './apple-touch-icon.png',
  }
};

import { ClientThemeProvider } from '../components/ClientThemeProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${space_grotest.variable} ${atkinson.variable}`} suppressHydrationWarning={true}>
      <body className="cyril-custom-scroll" suppressHydrationWarning={true}>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-QQM967TF9Z"
        />
        <Script
          id="google-analytics-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QQM967TF9Z');
            `,
          }}
        />
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>
  );
}