import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WePlay - リアルタイム野球スコアボード共有アプリ",
  description: "草野球や青少年野球の試合をリアルタイムでスコアボード共有。写真や動画と一緒に、みんなで野球を楽しもう。",
  keywords: ["野球", "スコアボード", "リアルタイム", "共有", "草野球", "青少年野球"],
  authors: [{ name: "WePlay Team" }],
  creator: "WePlay Team",
  publisher: "WePlay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "WePlay - リアルタイム野球スコアボード共有アプリ",
    description: "草野球や青少年野球の試合をリアルタイムでスコアボード共有。写真や動画と一緒に、みんなで野球を楽しもう。",
    url: "/",
    siteName: "WePlay",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WePlay - リアルタイム野球スコアボード共有アプリ",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WePlay - リアルタイム野球スコアボード共有アプリ",
    description: "草野球や青少年野球の試合をリアルタイムでスコアボード共有。写真や動画と一緒に、みんなで野球を楽しもう。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
