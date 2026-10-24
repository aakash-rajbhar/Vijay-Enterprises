import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ImageReveal } from "@/components/ImageReveal";
import { JsonLd } from "@/components/JsonLd";
import { MobileQuoteFab } from "@/components/MobileQuoteFab";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vijay Enterprises | Sheet Metal Fabrication in Delhi NCR",
  description:
    "Laser cutting, shearing, bending, welding and fabrication under one roof in Tughlakabad, New Delhi. Delhi NCR only. Email for quotes.",
  metadataBase: new URL(site.url),
  applicationName: site.name,
  category: "Manufacturing",
  keywords: [
    "sheet metal fabrication Delhi",
    "laser cutting Delhi NCR",
    "CNC bending New Delhi",
    "metal fabrication Tughlakabad",
    "custom machine parts Delhi",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  robots: { index: true, follow: true },
  openGraph: {
    title: "Vijay Enterprises | Sheet Metal Fabrication in Delhi NCR",
    description:
      "Precision sheet metal fabrication in Delhi NCR. Laser cutting, shearing, bending, welding and fabrication.",
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    url: site.url,
        images: [
          {
            url: "/og.svg",
            width: 1200,
            height: 630,
            alt: "Vijay Enterprises - Sheet Metal Fabrication",
          },
        ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vijay Enterprises | Sheet Metal Fabrication in Delhi NCR",
    description:
      "Precision sheet metal fabrication in Delhi NCR. Laser cutting, shearing, bending, welding and fabrication.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <JsonLd />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScrollProvider>
          <ScrollProgress />
          <ImageReveal />
          <CustomCursor />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <MobileQuoteFab />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
