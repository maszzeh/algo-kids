import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Petualangan Kiki si Robot Kelinci | Game Algoritma Anak Usia 4-6 Tahun",
  description:
    "Game edukasi interaktif ceria untuk mengenalkan konsep dasar algoritma, urutan langkah (sequencing), orientasi arah, dan debugging kepada anak usia dini (4-6 tahun)!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 antialiased overflow-x-hidden selection:bg-pink-300">
        {children}
      </body>
    </html>
  );
}
