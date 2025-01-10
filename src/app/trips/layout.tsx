import { Suspense } from "react";

import { Spinner } from "~/components/ui/Spinner";

function TripsLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <Spinner size="lg" variant="primary" />
    </div>
  );
}

export default function TripsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col flex-1 px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<TripsLoading />}>{children}</Suspense>
    </div>
  );
}
