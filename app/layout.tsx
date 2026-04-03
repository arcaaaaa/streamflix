import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreamFlix - Watch Movies Online",
  description: "Premium streaming platform with Netflix UI and Spotify vibes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary">{children}</body>
    </html>
  );
}
