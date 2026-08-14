import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
