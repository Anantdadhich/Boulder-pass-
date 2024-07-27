import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const robomoni=Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "rock the pass",
  description: "play with hand gestures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={robomoni.className}>{children}</body>
    </html>
  );
}
