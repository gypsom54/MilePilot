import { Card } from "@/components/ui/Card";

function SkeletonLine({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[var(--color-border-subtle)] ${className ?? ""}`} />;
}

export function MissionWorkspaceSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <SkeletonLine className="h-4 w-32" />
        <SkeletonLine className="mt-6 h-10 w-2/3" />
        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLine key={i} className="h-16 w-full" />
          ))}
        </div>
        <SkeletonLine className="mt-8 h-12 w-48" />
      </Card>
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <SkeletonLine className="h-6 w-40" />
          <SkeletonLine className="mt-4 h-4 w-full" />
          <SkeletonLine className="mt-2 h-32 w-full" />
        </Card>
      ))}
    </div>
  );
}
