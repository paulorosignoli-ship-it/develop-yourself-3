import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RH na Mesa do CEO | DevelopYourself",
  description: "Diagnóstico gratuito de maturidade estratégica do RH.",
  openGraph: {
    title: "RH na Mesa do CEO",
    description: "Descubra como o RH da sua organização está conectado ao negócio.",
    images: ["/images/hero/hero-bg.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
