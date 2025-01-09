"use client";

import { Card, CardContent } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { TripStats as TripStatsType } from "~/types/trips";
import { Globe, Calendar, Users, DollarSign } from "lucide-react";

interface TripStatsProps {
  stats: TripStatsType;
}

export function TripStats({ stats }: TripStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Text variant="body-sm" color="secondary">Total Budget</Text>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <Text className="text-2xl font-bold mt-2">${stats.totalBudget.toLocaleString()}</Text>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Text variant="body-sm" color="secondary">Active Trips</Text>
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <Text className="text-2xl font-bold mt-2">{stats.inProgressTrips}</Text>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Text variant="body-sm" color="secondary">Upcoming Trips</Text>
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <Text className="text-2xl font-bold mt-2">{stats.upcomingTrips}</Text>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Text variant="body-sm" color="secondary">Completed Trips</Text>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <Text className="text-2xl font-bold mt-2">{stats.completedTrips}</Text>
        </CardContent>
      </Card>
    </div>
  );
}
