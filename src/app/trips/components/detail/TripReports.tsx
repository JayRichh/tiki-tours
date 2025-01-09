"use client";

import { useMemo } from "react";
import { Trip, Activity } from "~/types/trips";
import { Card, CardHeader, CardContent } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { Badge } from "~/components/ui/Badge";
import { Progress } from "~/components/ui/Progress";
import { DollarSign, MapPin, Clock } from "lucide-react";

interface TripReportsProps {
  trip: Trip;
}

interface ActivitySummary {
  type: string;
  count: number;
  totalCost: number;
  locations: string[];
}

interface DaySummary {
  date: string;
  activities: Activity[];
  totalCost: number;
  locations: string[];
}

export function TripReports({ trip }: TripReportsProps) {
  // Activity type breakdown
  const activitySummary = useMemo(() => {
    const summary: Record<string, ActivitySummary> = {};
    
    trip.activities?.forEach(activity => {
      if (!summary[activity.type]) {
        summary[activity.type] = {
          type: activity.type,
          count: 0,
          totalCost: 0,
          locations: []
        };
      }
      
      summary[activity.type].count++;
      summary[activity.type].totalCost += activity.activityCost;
      if (!summary[activity.type].locations.includes(activity.location)) {
        summary[activity.type].locations.push(activity.location);
      }
    });

    return Object.values(summary).sort((a, b) => b.count - a.count);
  }, [trip.activities]);

  // Daily breakdown
  const dailySummary = useMemo(() => {
    const summary: Record<string, DaySummary> = {};
    
    trip.activities?.forEach(activity => {
      const date = activity.date.split('T')[0];
      if (!summary[date]) {
        summary[date] = {
          date,
          activities: [],
          totalCost: 0,
          locations: []
        };
      }
      
      summary[date].activities.push(activity);
      summary[date].totalCost += activity.activityCost;
      if (!summary[date].locations.includes(activity.location)) {
        summary[date].locations.push(activity.location);
      }
    });

    return Object.values(summary).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [trip.activities]);

  // Budget analysis
  const budgetAnalysis = useMemo(() => {
    const totalBudget = trip.tripBudget;
    const spentAmount = trip.spentSoFar || 0;
    const remainingBudget = totalBudget - spentAmount;
    const daysLeft = Math.ceil(
      (new Date(trip.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return {
      totalBudget,
      spentAmount,
      remainingBudget,
      daysLeft,
      dailyBudget: remainingBudget / (daysLeft || 1),
      spentPercentage: (spentAmount / totalBudget) * 100
    };
  }, [trip]);

  return (
    <Card className="w-full">
      <CardContent className="space-y-6">
        {/* Budget Overview */}
        <Card>
          <CardHeader title="Budget Analysis" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Text variant="body-sm" color="secondary">Total Budget</Text>
                <Text variant="h4" className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  ${trip.tripBudget.toLocaleString()}
                </Text>
              </div>
              <div>
                <Text variant="body-sm" color="secondary">Spent Amount</Text>
                <Text variant="h4" className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  ${(trip.spentSoFar || 0).toLocaleString()}
                </Text>
                <Progress value={budgetAnalysis.spentPercentage} className="mt-2" />
              </div>
              <div>
                <Text variant="body-sm" color="secondary">Daily Budget (Remaining)</Text>
                <Text variant="h4" className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  ${Math.round(budgetAnalysis.dailyBudget).toLocaleString()}
                </Text>
                <Text variant="body-sm" color="secondary">
                  for {budgetAnalysis.daysLeft} days
                </Text>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Type Breakdown */}
        <Card>
          <CardHeader title="Activity Breakdown" />
          <CardContent>
            <div className="grid grid-cols-1 gap-4 w-full">
              {activitySummary.map(summary => (
                <div key={summary.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {summary.type}
                      </Badge>
                      <Text>{summary.count} activities</Text>
                    </div>
                    <Text variant="body-sm" color="secondary">
                      ${summary.totalCost.toLocaleString()}
                    </Text>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {summary.locations.map(location => (
                      <Badge key={location} variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Schedule */}
        <Card>
          <CardHeader title="Daily Schedule" />
          <CardContent>
            <div className="grid grid-cols-1 gap-6 w-full">
              {dailySummary.map(day => (
                <div key={day.date} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Text variant="h4">
                      {new Date(day.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                    <Badge variant="secondary">
                      ${day.totalCost.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {day.activities.map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-2 rounded bg-background/50"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-foreground/50" />
                          <Text>{activity.activityName}</Text>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </Badge>
                        </div>
                        <Text variant="body-sm" color="secondary">
                          ${activity.activityCost.toLocaleString()}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
