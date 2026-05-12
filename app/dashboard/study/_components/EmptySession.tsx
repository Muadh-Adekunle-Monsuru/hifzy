import Link from "next/link";

export function EmptySession() {
  return (
    <div className="w-full max-w-3xl mb-xl text-center bento-cell p-xl bg-surface-container">
      <h2 className="text-3xl font-bold text-primary mb-md">No verses due for review</h2>
      <p className="text-secondary mb-lg">Great job! All your verses are on schedule.</p>
      <Link href="/dashboard">
        <button className="py-sm px-lg border-2 border-primary bg-primary text-background font-headline-md uppercase tracking-tighter hover:bg-background hover:text-primary transition-all active:scale-[0.98]">
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
}
