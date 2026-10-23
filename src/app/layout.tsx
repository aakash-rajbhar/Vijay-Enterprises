import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { CustomCursor } from "@/components/CustomCursor";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ImageReveal } from "@/components/ImageReveal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vijay Enterprises | Sheet Metal Fabrication in Delhi NCR",
  description:
    "Laser cutting, shearing, bending, welding and fabrication under one roof in Tughlakabad, New Delhi. Delhi NCR only. Email for quotes.",
  metadataBase: new URL("https://vijay-enterprises.in"),
  openGraph: {
    title: "Vijay Enterprises | Sheet Metal Fabrication in Delhi NCR",
    description:
      "One roof for precision sheet metal fabrication. Laser up to 25 mm, shear 12 mm × 3 m. Email your drawing for a quote.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScrollProvider>
          <Preloader />
          <ScrollProgress />
          <ImageReveal />
          <CustomCursor />
          <Nav />
          <PageTransition>
            <main id="main">{children}</main>
          </PageTransition>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
