"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardContent } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import { Modal } from "~/components/ui/Modal";
import { Trip, Activity } from "~/types/trips";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveSankey } from "@nivo/sankey";
import { Plus, MapPin, Clock, DollarSign, Edit2, Trash2 } from "lucide-react";
import { ActivityForm } from "./ActivityForm";

interface TripActivitiesProps {
  trip: Trip;
  onUpdateActivity?: (activityId: string, updates: Partial<Activity>) => void;
  onDeleteActivity?: (activityId: string) => void;
  onAddActivity?: (activity: Omit<Activity, "id">) => void;
}

export function TripActivities({ 
  trip,
  onUpdateActivity,
  onDeleteActivity,
  onAddActivity
}: TripActivitiesProps) {
  // Get dialog state from URL hash
  const [dialogState, setDialogState] = useState<{
    type: "activity" | null;
    action: "new" | "edit" | "delete" | null;
    id?: string;
  }>({ type: null, action: null });

  const selectedActivity = useMemo(() => {
    if (dialogState.id) {
      return trip.activities.find(a => a.id === dialogState.id);
    }
    return undefined;
  }, [dialogState.id, trip.activities]);

  // Track today's date for new activity
  const [todayDate, setTodayDate] = useState<string | undefined>();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setDialogState({ type: null, action: null });
        setTodayDate(undefined);
        return;
      }

      // Format: #tab/dialog/action/params
      const [tab, dialog, action, ...params] = hash.split("/");
      if (tab === "activities" && dialog === "activity" && action) {
        const param = params.join("/"); // Rejoin any remaining params
        if (param.startsWith("today=")) {
          setTodayDate(param.split("=")[1]);
        }

        setDialogState({
          type: "activity",
          action: action as "new" | "edit" | "delete",
          id: param && !param.startsWith("today=") ? param : undefined
        });
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Helper to update dialog state and URL hash
  const updateDialogState = (type: typeof dialogState.type, action: typeof dialogState.action, id?: string) => {
    if (!type || !action) {
      window.history.pushState(null, "", window.location.pathname + "#activities");
      setDialogState({ type: null, action: null });
      return;
    }

    const hash = `#activities/${type}/${action}${id ? `/${id}` : ''}`;
    window.history.pushState(null, "", hash);
    setDialogState({ type, action, id });
  };

  // Activity type distribution
  const typeDistribution = useMemo(() => {
    const types = new Map<string, number>();
    
    trip.activities?.forEach((activity) => {
      types.set(
        activity.type,
        (types.get(activity.type) || 0) + 1
      );
    });

    return Array.from(types.entries()).map(([id, value]) => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1),
      value
    }));
  }, [trip.activities]);

  // Location flow data
  const locationFlow = useMemo(() => {
    const locations = new Set<string>();
    const links: { source: string; target: string; value: number }[] = [];

    trip.activities?.forEach((activity, index, arr) => {
      locations.add(activity.location);
      
      if (index > 0) {
        const source = arr[index - 1].location;
        const target = activity.location;
        
        const existingLink = links.find(
          link => link.source === source && link.target === target
        );

        if (existingLink) {
          existingLink.value += 1;
        } else {
          links.push({ source, target, value: 1 });
        }
      }
    });

    return {
      nodes: Array.from(locations).map(id => ({ id })),
      links
    };
  }, [trip.activities]);

  return (
    <Card>
      <CardHeader
        title={
          <div className="flex items-center justify-between">
            <Text variant="h4">Activities</Text>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => updateDialogState("activity", "new")}
            >
              Add Activity
            </Button>
          </div>
        }
      />
      <CardContent>
        <div className="grid grid-cols-1 gap-8 w-full">
          {/* Activity List */}
          <div className="grid grid-cols-1 gap-4 w-full">
            {trip.activities?.map((activity) => (
              <div
                key={activity.id}
                className="p-4 rounded-lg bg-background-secondary border border-border/50"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Text variant="body" className="font-medium">
                      {activity.activityName}
                    </Text>
                    <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{activity.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${activity.activityCost}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="solid" color="primary" className="capitalize">
                      {activity.type}
                    </Badge>
                    {activity.bookingStatus && (
                      <Badge
                        variant="solid"
                        color={
                          activity.bookingStatus === "completed"
                            ? "success"
                            : activity.bookingStatus === "booked"
                            ? "info"
                            : "warning"
                        }
                      >
                        {activity.bookingStatus}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      leftIcon={<Edit2 className="h-4 w-4" />}
                      onClick={() => updateDialogState("activity", "edit", activity.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                      onClick={() => updateDialogState("activity", "delete", activity.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Text variant="body-sm" color="secondary" className="mb-4">
              Activity Types
            </Text>
            <div className="h-[200px] w-full">
              <ResponsivePie
                data={typeDistribution}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: "nivo" }}
                borderWidth={1}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 0.2]],
                }}
                enableArcLinkLabels={false}
                arcLabel="id"
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
              />
            </div>
          </div>

          {/* Location Flow */}
          {locationFlow.links.length > 0 && (
            <div className="grid grid-cols-1 w-full">
              <Text variant="body-sm" color="secondary" className="mb-4">
                Location Flow
              </Text>
              <div className="h-[300px]">
                <ResponsiveSankey
                  data={locationFlow}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  align="justify"
                  colors={{ scheme: "category10" }}
                  nodeOpacity={1}
                  nodeThickness={18}
                  nodeInnerPadding={3}
                  nodeSpacing={24}
                  nodeBorderWidth={0}
                  linkOpacity={0.5}
                  linkHoverOthersOpacity={0.1}
                  enableLinkGradient={true}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Activity Form Modal */}
      <Modal
        isOpen={dialogState.type === "activity" && (dialogState.action === "new" || dialogState.action === "edit")}
        onClose={() => updateDialogState(null, null)}
        title={dialogState.action === "edit" ? "Edit Activity" : "Add Activity"}
      >
        <ActivityForm
          activity={selectedActivity || (todayDate ? { date: todayDate } as Partial<Activity> : undefined)}
          onSubmit={(data: Omit<Activity, "id">) => {
            if (dialogState.action === "edit" && dialogState.id) {
              onUpdateActivity?.(dialogState.id, data);
            } else {
              onAddActivity?.(data);
            }
            updateDialogState(null, null);
          }}
          onCancel={() => updateDialogState(null, null)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={dialogState.type === "activity" && dialogState.action === "delete"}
        onClose={() => updateDialogState(null, null)}
        title="Delete Activity"
      >
        <div className="space-y-6">
          <Text variant="body">
            Are you sure you want to delete {selectedActivity?.activityName}?
          </Text>
          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={() => updateDialogState(null, null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (dialogState.id && onDeleteActivity) {
                  onDeleteActivity(dialogState.id);
                }
                updateDialogState(null, null);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
