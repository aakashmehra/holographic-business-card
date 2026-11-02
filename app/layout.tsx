import type { Metadata } from "next";
import { Inter, Geist_Mono, Caveat, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The real card's handwritten line and Japanese text.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: "700",
});

const notoJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  weight: "500",
  preload: false,
});

export const metadata: Metadata = {
  title: "Business Card",
  description: "Holographic business card that tilts and flips",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${caveat.variable} ${notoJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#DCE9F8]">{children}</body>
    </html>
  );
}
