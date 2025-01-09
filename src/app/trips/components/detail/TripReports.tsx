"use client";

import { useMemo } from "react";
import { Trip, Activity } from "~/types/trips";
import { Card, CardHeader, CardContent } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { Badge } from "~/components/ui/Badge";
import { Progress } from "~/components/ui/Progress";
import { DollarSign, MapPin, Clock, PieChart, TrendingUp, CheckSquare } from "lucide-react";

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

  // Calculate spending trends
  const spendingTrends = useMemo(() => {
    const trends: { date: string; amount: number }[] = [];
    const sortedActivities = [...(trip.activities || [])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let cumulativeSpent = 0;
    sortedActivities.forEach(activity => {
      cumulativeSpent += activity.activityCost;
      trends.push({
        date: activity.date.split('T')[0],
        amount: cumulativeSpent
      });
    });

    return trends;
  }, [trip.activities]);

  // Calculate activity type distribution
  const activityDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    trip.activities?.forEach(activity => {
      distribution[activity.type] = (distribution[activity.type] || 0) + 1;
    });
    return Object.entries(distribution).map(([type, count]) => ({
      type,
      count,
      percentage: (count / (trip.activities?.length || 1)) * 100
    }));
  }, [trip.activities]);

  // Calculate checklist stats
  const checklistStats = useMemo(() => {
    const stats = {
      total: 0,
      completed: 0,
      byCategory: {} as Record<string, { total: number; completed: number }>
    };

    trip.checklists?.forEach(checklist => {
      const category = checklist.category || 'Uncategorized';
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = { total: 0, completed: 0 };
      }

      checklist.items.forEach(item => {
        stats.total++;
        stats.byCategory[category].total++;
        if (item.completed) {
          stats.completed++;
          stats.byCategory[category].completed++;
        }
      });
    });

    return stats;
  }, [trip.checklists]);

  return (
    <Card className="w-full">
      <CardContent className="space-y-8">
        {/* Budget Overview */}
        <Card>
          <CardHeader title="Budget Overview" />
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

        {/* Spending Trends */}
        <Card>
          <CardHeader 
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Spending Trends</span>
              </div>
            }
          />
          <CardContent>
            <div className="h-64 w-full">
              {spendingTrends.length > 0 ? (
                <div className="relative h-full">
                  <svg className="w-full h-full">
                    {spendingTrends.map((point, i) => {
                      const x = (i / (spendingTrends.length - 1)) * 100;
                      const y = 100 - (point.amount / (trip.tripBudget || 1)) * 100;
                      return (
                        <g key={i}>
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="4"
                            className="fill-primary"
                          />
                          {i > 0 && (
                            <line
                              x1={`${(i - 1) / (spendingTrends.length - 1) * 100}%`}
                              y1={`${100 - (spendingTrends[i - 1].amount / (trip.tripBudget || 1)) * 100}%`}
                              x2={`${x}%`}
                              y2={`${y}%`}
                              className="stroke-primary stroke-2"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-foreground-secondary">
                  No spending data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Distribution */}
        <Card>
          <CardHeader 
            title={
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                <span>Activity Distribution</span>
              </div>
            }
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {activityDistribution.map(({ type, count, percentage }) => (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="capitalize">
                        {type}
                      </Badge>
                      <Text variant="body-sm" color="secondary">
                        {count} activities ({percentage.toFixed(1)}%)
                      </Text>
                    </div>
                    <Progress value={percentage} />
                  </div>
                ))}
              </div>
              <div className="relative aspect-square">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {activityDistribution.map(({ percentage }, i) => {
                    const startAngle = activityDistribution
                      .slice(0, i)
                      .reduce((sum, { percentage }) => sum + (percentage * 3.6), 0);
                    const endAngle = startAngle + (percentage * 3.6);
                    
                    const startRad = (startAngle - 90) * Math.PI / 180;
                    const endRad = (endAngle - 90) * Math.PI / 180;
                    
                    const x1 = 50 + 40 * Math.cos(startRad);
                    const y1 = 50 + 40 * Math.sin(startRad);
                    const x2 = 50 + 40 * Math.cos(endRad);
                    const y2 = 50 + 40 * Math.sin(endRad);
                    
                    const largeArc = percentage > 50 ? 1 : 0;
                    
                    return (
                      <path
                        key={i}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        className={`fill-primary-${((i % 3) + 1) * 100}`}
                        style={{ opacity: 0.8 - (i * 0.1) }}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist Progress */}
        <Card>
          <CardHeader 
            title={
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                <span>Checklist Progress</span>
              </div>
            }
          />
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Text>Overall Progress</Text>
                <Text variant="body-sm" color="secondary">
                  {checklistStats.completed} / {checklistStats.total} items completed
                </Text>
              </div>
              <Progress 
                value={checklistStats.total ? (checklistStats.completed / checklistStats.total) * 100 : 0} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {Object.entries(checklistStats.byCategory).map(([category, stats]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">{category}</Badge>
                      <Text variant="body-sm" color="secondary">
                        {stats.completed} / {stats.total}
                      </Text>
                    </div>
                    <Progress 
                      value={stats.total ? (stats.completed / stats.total) * 100 : 0}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
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
