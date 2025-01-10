"use client";

import { AlertCircle, Calendar, CheckCircle, Clock, DollarSign } from "lucide-react";

import { useMemo } from "react";

import { Badge } from "~/components/ui/Badge";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Progress } from "~/components/ui/Progress";
import { Text } from "~/components/ui/Text";

import { Activity, ChecklistItem, Deadline, Trip } from "~/types/trips";

interface TripDashboardProps {
  trip: Trip;
}

interface DeadlineWarning {
  type: "overdue" | "upcoming";
  item: Deadline | Activity | ChecklistItem;
  itemType: "deadline" | "activity" | "checklist";
  dueDate: string;
  title: string;
}

export function TripDashboard({ trip }: TripDashboardProps) {
  // Calculate all warnings
  const warnings = useMemo(() => {
    const result: DeadlineWarning[] = [];
    const now = new Date();

    // Check deadlines
    trip.deadlines?.forEach((deadline) => {
      const dueDate = new Date(deadline.dueDate);
      if (!deadline.completed) {
        if (dueDate < now) {
          result.push({
            type: "overdue",
            item: deadline,
            itemType: "deadline",
            dueDate: deadline.dueDate,
            title: deadline.description,
          });
        } else if (dueDate.getTime() - now.getTime() <= 3 * 24 * 60 * 60 * 1000) {
          result.push({
            type: "upcoming",
            item: deadline,
            itemType: "deadline",
            dueDate: deadline.dueDate,
            title: deadline.description,
          });
        }
      }
    });

    // Check activities
    trip.activities?.forEach((activity) => {
      const activityDate = new Date(activity.date);
      if (activity.bookingStatus === "planned") {
        if (activityDate < now) {
          result.push({
            type: "overdue",
            item: activity,
            itemType: "activity",
            dueDate: activity.date,
            title: activity.activityName,
          });
        } else if (activityDate.getTime() - now.getTime() <= 3 * 24 * 60 * 60 * 1000) {
          result.push({
            type: "upcoming",
            item: activity,
            itemType: "activity",
            dueDate: activity.date,
            title: activity.activityName,
          });
        }
      }
    });

    // Check checklist items
    trip.checklists?.forEach((checklist) => {
      checklist.items.forEach((item) => {
        if (!item.completed && item.dueDate) {
          const dueDate = new Date(item.dueDate);
          if (dueDate < now) {
            result.push({
              type: "overdue",
              item,
              itemType: "checklist",
              dueDate: item.dueDate,
              title: item.title,
            });
          } else if (dueDate.getTime() - now.getTime() <= 3 * 24 * 60 * 60 * 1000) {
            result.push({
              type: "upcoming",
              item,
              itemType: "checklist",
              dueDate: item.dueDate,
              title: item.title,
            });
          }
        }
      });
    });

    return result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [trip]);

  // Calculate completion stats
  const stats = useMemo(() => {
    const totalActivities = trip.activities?.length || 0;
    const bookedActivities =
      trip.activities?.filter((a) => a.bookingStatus === "booked").length || 0;
    const completedActivities =
      trip.activities?.filter((a) => a.bookingStatus === "completed").length || 0;

    const totalChecklistItems =
      trip.checklists?.reduce((sum, list) => sum + list.items.length, 0) || 0;
    const completedChecklistItems =
      trip.checklists?.reduce(
        (sum, list) => sum + list.items.filter((item) => item.completed).length,
        0
      ) || 0;

    return {
      activitiesProgress: totalActivities ? (bookedActivities / totalActivities) * 100 : 0,
      activitiesCompletion: totalActivities ? (completedActivities / totalActivities) * 100 : 0,
      checklistProgress: totalChecklistItems
        ? (completedChecklistItems / totalChecklistItems) * 100
        : 0,
      budgetProgress: trip.tripBudget ? ((trip.spentSoFar || 0) / trip.tripBudget) * 100 : 0,
    };
  }, [trip]);

  return (
    <Card className="w-full">
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <Text variant="body-sm" color="secondary">
                    Trip Duration
                  </Text>
                  <Text variant="h4">
                    {Math.ceil(
                      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </Text>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <Text variant="body-sm" color="secondary">
                    Budget Spent
                  </Text>
                  <Text variant="h4">${trip.spentSoFar || 0}</Text>
                  <Progress value={stats.budgetProgress} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <Text variant="body-sm" color="secondary">
                    Activities Booked
                  </Text>
                  <Progress value={stats.activitiesProgress} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <Text variant="body-sm" color="secondary">
                    Checklist Progress
                  </Text>
                  <Progress value={stats.checklistProgress} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <Card>
            <CardHeader title="Warnings & Reminders" />
            <CardContent>
              <div className="space-y-3">
                {warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded bg-background/50">
                    {warning.type === "overdue" ? (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Text>{warning.title}</Text>
                        <Badge
                          variant="solid"
                          color={warning.type === "overdue" ? "error" : "warning"}
                        >
                          {warning.type}
                        </Badge>
                        <Badge variant="secondary">{warning.itemType}</Badge>
                      </div>
                      <Text variant="body-sm" color="secondary">
                        Due: {new Date(warning.dueDate).toLocaleDateString()}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
