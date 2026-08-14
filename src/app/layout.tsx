import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// §26.5 — Plus Jakarta Sans pour l'ensemble de l'interface.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Savethem — Tout savoir sur le don de sang",
    template: "%s | Savethem",
  },
  description:
    "Vérifiez votre éligibilité, trouvez un centre de don près de chez vous et découvrez le déroulement d'un don de sang, étape par étape.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${jakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
