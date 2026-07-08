/**
 * Vector OS website app shell.
 * Public pages are not built yet — use Storybook for the UI Lab.
 */
export default function AppShell() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <p className="text-neutral-600 text-sm">
        Vector OS — UI Lab runs in Storybook. Run <code className="font-mono">pnpm dev:storybook</code>.
      </p>
    </main>
  );
}
