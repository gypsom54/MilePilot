import { Card } from "@/components/ui/Card";

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[var(--color-border-subtle)] ${className ?? ""}`}
    />
  );
}

export function MissionControlSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <SkeletonLine className="h-4 w-24" />
        <SkeletonLine className="mt-4 h-8 w-2/3" />
        <SkeletonLine className="mt-4 h-4 w-full" />
        <SkeletonLine className="mt-2 h-4 w-4/5" />
        <SkeletonLine className="mt-8 h-12 w-48" />
      </Card>
      <Card>
        <SkeletonLine className="h-6 w-40" />
        <SkeletonLine className="mt-4 h-4 w-full" />
        <SkeletonLine className="mt-6 h-10 w-44" />
      </Card>
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SkeletonLine className="h-6 w-48" />
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLine key={i} className="mt-5 h-12 w-full" />
          ))}
        </Card>
        <div className="space-y-8">
          <Card>
            <SkeletonLine className="h-6 w-36" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonLine key={i} className="h-16 w-full" />
              ))}
            </div>
          </Card>
          <Card>
            <SkeletonLine className="h-6 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonLine key={i} className="mt-4 h-10 w-full" />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
