import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "@/contexts/NotificationContext";

export const metadata: Metadata = {
  title: "MR Tecnología - Backoffice",
  description: "Panel de administración para MR Tecnología",
  icons: {
    icon: "/logo-mr-tecnologia.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo-mr-tecnologia.jpg" type="image/jpeg" />
      </head>
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
