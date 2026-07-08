import { Button } from '@vector-platform/ui';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 py-16 text-center">
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-brand-300">
        VECTOR PLATFORM
      </p>

      <h1 className="mb-4 text-4xl font-semibold tracking-tight text-neutral-0 sm:text-5xl">
        Vector Peptides
      </h1>

      <p className="mb-10 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">
        Precision research. Premium packaging. Built on Vector One.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="md">
          Explore Products
        </Button>
        <Button
          variant="ghost"
          size="md"
          className="!text-neutral-200 hover:!bg-neutral-800 hover:!text-neutral-0"
        >
          Learn More
        </Button>
      </div>
    </main>
  );
}
