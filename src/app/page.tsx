export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      <p className="text-sm font-semibold tracking-widest text-primary uppercase">
        Savethem
      </p>
      <h1 className="text-4xl font-bold text-balance text-ink sm:text-5xl">
        Le don de sang, sans zone d&apos;ombre.
      </h1>
      <p className="max-w-prose text-lg text-pretty text-ink-secondary">
        Design system en place. Les sections de la landing page arrivent
        ensuite.
      </p>
      <p className="text-sm text-muted">
        18–65 ans · 50 kg minimum · délai depuis le dernier don
      </p>
    </main>
  );
}
