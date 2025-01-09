"use client";

import { useState } from "react";
import { Card } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { Modal } from "~/components/ui/Modal";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import { Trip } from "~/types/trips";
import { ActivityCalendar } from "./timeline/ActivityCalendar";
import { ActivityDistribution } from "./timeline/ActivityDistribution";

interface TripTimelineProps {
  trip: Trip;
}

interface SelectedDay {
  date: string;
  activities: NonNullable<Trip["activities"]>;
  events: NonNullable<Trip["keyEvents"]>;
}

interface SelectedActivities {
  type: string;
  date: string;
  activities: NonNullable<Trip["activities"]>;
}

type PriorityBadgeColor = {
  high: "error";
  medium: "warning";
  low: "success";
};

const PRIORITY_BADGE_COLORS: PriorityBadgeColor = {
  high: "error",
  medium: "warning",
  low: "success"
};

export function TripTimeline({ trip }: TripTimelineProps) {
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<SelectedActivities | null>(null);

  const handleDayClick = (date: string) => {
    const activities = trip.activities?.filter(
      activity => activity.date.split("T")[0] === date
    ) || [];
    const events = trip.keyEvents?.filter(
      event => event.date.split("T")[0] === date
    ) || [];
    setSelectedDay({
      date,
      activities,
      events
    });
  };

  const handleActivityClick = (type: string, date: string) => {
    const activities = trip.activities?.filter(
      activity => 
        activity.date.split("T")[0] === date && 
        activity.type === type
    ) || [];
    setSelectedActivities({
      type,
      date,
      activities
    });
  };

  return (
    <Card>
      <div className="space-y-8 p-6">
        {/* Activity Calendar */}
        <ActivityCalendar 
          trip={trip}
          onDayClick={handleDayClick}
        />

        {/* Activity Distribution */}
        <ActivityDistribution 
          trip={trip}
          onPointClick={handleActivityClick}
        />

        {/* Day Details Modal */}
        <Modal
          isOpen={selectedDay !== null}
          onClose={() => setSelectedDay(null)}
          title={selectedDay ? `Activities on ${new Date(selectedDay.date).toLocaleDateString()}` : ""}
        >
          <div className="space-y-6">
            {!selectedDay || (selectedDay.activities.length === 0 && selectedDay.events.length === 0) ? (
              <Text color="secondary">No activities or events scheduled for this day</Text>
            ) : (
              <>
                {selectedDay.activities.length > 0 && (
                  <div className="space-y-4">
                    <Text variant="body" className="font-semibold">Activities</Text>
                    {selectedDay.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-4 rounded-lg bg-background-secondary border border-border/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Text variant="body">{activity.activityName}</Text>
                            <Text variant="body-sm" color="secondary">
                              {activity.location} • {activity.duration} mins • ${activity.activityCost}
                            </Text>
                          </div>
                          <Badge color="primary" variant="solid">{activity.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedDay.events.length > 0 && (
                  <div className="space-y-4">
                    <Text variant="body" className="font-semibold">Events</Text>
                    {selectedDay.events.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 rounded-lg bg-background-secondary border border-border/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Text variant="body">{event.title}</Text>
                            {event.description && (
                              <Text variant="body-sm" color="secondary">
                                {event.description}
                              </Text>
                            )}
                          </div>
                          <Badge
                            color={PRIORITY_BADGE_COLORS[event.priorityLevel as keyof PriorityBadgeColor]}
                            variant="solid"
                          >
                            {event.priorityLevel}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </Modal>

        {/* Activity Type Modal */}
        <Modal
          isOpen={selectedActivities !== null}
          onClose={() => setSelectedActivities(null)}
          title={
            selectedActivities
              ? `${selectedActivities.activities.length} ${selectedActivities.type} activities on ${new Date(
                  selectedActivities.date
                ).toLocaleDateString()}`
              : ""
          }
        >
          <div className="space-y-6">
            {!selectedActivities || selectedActivities.activities.length === 0 ? (
              <Text color="secondary">No activities of this type scheduled for this day</Text>
            ) : (
              <div className="space-y-4">
                {selectedActivities.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 rounded-lg bg-background-secondary border border-border/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Text variant="body">{activity.activityName}</Text>
                        <Text variant="body-sm" color="secondary">
                          {activity.location} • {activity.duration} mins • ${activity.activityCost}
                        </Text>
                      </div>
                      <Badge color="info" variant="solid">{activity.bookingStatus}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      </div>
    </Card>
  );
}
