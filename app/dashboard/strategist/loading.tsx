import { Skeleton } from "@/components/ui/skeleton"

export default function StrategistLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex w-80 border-r border-border flex-col p-4 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="flex-1 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="flex-1 flex flex-col">
        <header className="border-b border-border p-4">
          <Skeleton className="h-10 w-64" />
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="space-y-4 text-center">
            <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>
        <div className="border-t border-border p-4">
          <Skeleton className="h-16 w-full max-w-3xl mx-auto rounded-xl" />
        </div>
      </main>
    </div>
  )
}
