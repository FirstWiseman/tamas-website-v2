function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-black/8 dark:bg-white/8 ${className}`} />;
}

export default function FurnitureCatalogSkeleton() {
  return (
    <div className="min-h-screen w-full px-5 pb-16 pt-28 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="grid gap-8 overflow-hidden rounded-[2.25rem] border border-black/8 bg-white/58 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.055] lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <SkeletonBlock className="mb-4 h-3 w-36 rounded-full" />
              <SkeletonBlock className="h-16 w-64 md:h-20 md:w-80" />
              <SkeletonBlock className="mt-5 h-4 w-full max-w-xl" />
              <SkeletonBlock className="mt-3 h-4 w-[88%] max-w-xl" />
              <SkeletonBlock className="mt-3 h-4 w-[70%] max-w-xl" />
            </div>

            <div className="flex flex-wrap gap-3">
              <SkeletonBlock className="h-10 w-28 rounded-full" />
              <SkeletonBlock className="h-10 w-28 rounded-full" />
              <SkeletonBlock className="h-10 w-28 rounded-full" />
            </div>
          </div>

          <SkeletonBlock className="min-h-[20rem] w-full rounded-[1.8rem]" />
        </section>

        <section className="rounded-[2rem] border border-black/8 bg-white/52 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.045]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <SkeletonBlock className="h-3 w-20 rounded-full" />
              <SkeletonBlock className="h-9 w-32 rounded-full" />
              <SkeletonBlock className="ml-auto h-4 w-24 rounded-full" />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex flex-wrap gap-2">
                <SkeletonBlock className="h-9 w-20 rounded-full" />
                <SkeletonBlock className="h-9 w-28 rounded-full" />
                <SkeletonBlock className="h-9 w-24 rounded-full" />
              </div>
              <div className="flex flex-wrap gap-2">
                <SkeletonBlock className="h-9 w-24 rounded-full" />
                <SkeletonBlock className="h-9 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="relative h-[300px] overflow-hidden rounded-[1.25rem] bg-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.09)]"
            >
              <SkeletonBlock className="absolute inset-0 rounded-none" />
              <div className="absolute right-3 top-3 z-10">
                <SkeletonBlock className="h-7 w-28 rounded-full bg-white/20" />
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 border-t border-white/10 bg-[rgba(18,12,8,0.36)] px-4 py-4 backdrop-blur-[20px]">
                <div className="w-full">
                  <SkeletonBlock className="h-4 w-24 bg-white/16" />
                  <SkeletonBlock className="mt-2 h-3 w-44 bg-white/14" />
                </div>
                <div className="w-20 shrink-0">
                  <SkeletonBlock className="ml-auto h-4 w-16 bg-white/16" />
                  <SkeletonBlock className="mt-2 ml-auto h-3 w-14 bg-white/14" />
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
