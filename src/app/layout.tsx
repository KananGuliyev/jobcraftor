import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteTitle = "JobCraftor";
const siteDescription =
  "Compare a job posting against a resume and turn the gap into a clear, personalized application plan.";
const socialImagePath = "/og-image.png";

function resolveMetadataBase() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();

  if (configuredSiteUrl) {
    return new URL(
      configuredSiteUrl.startsWith("http")
        ? configuredSiteUrl
        : `https://${configuredSiteUrl}`,
    );
  }

  if (vercelUrl) {
    return new URL(`https://${vercelUrl}`);
  }

  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "JobCraftor",
    type: "website",
    images: [
      {
        url: socialImagePath,
        width: 1200,
        height: 630,
        alt: "JobCraftor preview showing a polished dashboard and job application action plan.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [socialImagePath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
