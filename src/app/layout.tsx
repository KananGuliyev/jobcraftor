import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobCraftor | Turn a job posting into a 7-day execution plan",
  description:
    "JobCraftor helps students compare a job or internship posting against their resume and turn the gap into a personalized action plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
