import { Card } from "~/components/ui/Card";
import { Container } from "~/components/ui/Container";
import { Skeleton } from "~/components/ui/Skeleton";

export default function TripsLoading() {
  return (
    <Container>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          </Card>
        ))}
      </div>

      {/* Trips List */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
