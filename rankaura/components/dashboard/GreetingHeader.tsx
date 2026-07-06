interface GreetingHeaderProps {
  greeting: string;
  subheading: string;
}

export function GreetingHeader({ greeting, subheading }: GreetingHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
        {greeting}
      </h1>
      <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
        {subheading}
      </p>
    </header>
  );
}
