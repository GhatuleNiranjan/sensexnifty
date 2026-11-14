export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12" role="status" aria-label="Loading news">
      <p className="mb-6 text-sm text-gray-600">Loading news…</p>
      <div aria-hidden="true" className="animate-pulse motion-reduce:animate-none space-y-6">
        <div className="h-10 w-2/3 bg-gray-100" />
        <div className="h-64 bg-gray-100" />
        <div className="h-4 w-full bg-gray-100" />
        <div className="h-4 w-4/5 bg-gray-100" />
      </div>
    </main>
  );
}
