import { Container } from "~/components/ui/Container";
import { Skeleton } from "~/components/ui/Skeleton";

export default function TripDetailLoading() {
  return (
    <Container size="full" className="pb-8 flex flex-col flex-1">
      <div className="space-y-6 flex flex-col flex-1 max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-32" />
        </div>

        <div className="min-h-[600px] w-full flex flex-col flex-1">
          {/* Tab Navigation */}
          <div className="border-b border-border/50">
            <div className="flex gap-2 mb-[-1px]">
              {[
                "Overview",
                "Dashboard",
                "Timeline & Budget",
                "Activities",
                "Planning",
                "Checklists",
                "Reports",
              ].map((tab) => (
                <Skeleton key={tab} className="h-10 w-28" />
              ))}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="pt-8 space-y-8">
            {/* Overview-like content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-8 w-32" />
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border rounded-lg space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
