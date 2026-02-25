import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "@/contexts/NotificationContext";

export const metadata: Metadata = {
  title: "MR Tecnología - Backoffice",
  description: "Panel de administración para MR Tecnología",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
