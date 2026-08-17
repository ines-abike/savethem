import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { RevealGate } from "@/components/motion/reveal-gate";
import { RevealController } from "@/components/motion/reveal-controller";
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
    /*
     * `suppressHydrationWarning` : le script d'armement pose `data-motion`
     * sur cette balise avant que React n'hydrate, ce que React signale
     * comme une divergence serveur/client. La divergence est ici voulue —
     * c'est tout l'intérêt d'agir avant la première peinture.
     *
     * La suppression ne porte que sur cet élément, pas sur ses descendants :
     * une vraie divergence ailleurs dans l'arbre resterait signalée.
     */
    <html
      lang="fr"
      className={`${jakarta.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/* En tête de `<body>` : l'attribut doit être posé avant la première
            peinture, sinon le contenu s'affiche puis se masque. */}
        <RevealGate />
        {children}
        <RevealController />
      </body>
    </html>
  );
}
