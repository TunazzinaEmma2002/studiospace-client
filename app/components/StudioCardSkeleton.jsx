export default function StudioCardSkeleton() {
  return (
    <div className="glass h-[26rem] overflow-hidden">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton mt-6 h-10 w-full" />
      </div>
    </div>
  );
}