import { Card, CardContent } from "~/components/ui/Card";
import { Container } from "~/components/ui/Container";
import { Skeleton } from "~/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <Container>
      {/* Hero Section */}
      <div className="relative py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <div className="space-y-6">
              <Skeleton className="h-16 w-full max-w-xl" />
              <Skeleton className="h-6 w-full max-w-lg" />
              <Skeleton className="h-6 w-full max-w-md" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-36" />
            </div>
          </div>
          <div className="flex-1">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20">
        <div className="text-center space-y-4 mb-12">
          <Skeleton className="h-10 w-80 mx-auto" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-8 space-y-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="text-center space-y-4 mb-12">
          <Skeleton className="h-10 w-72 mx-auto" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
