"use client";

import { useMemo, useState, ChangeEvent } from "react";
import { Card, CardHeader, CardContent } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { Badge } from "~/components/ui/Badge";
import { Trip, Activity, KeyEvent } from "~/types/trips";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { Select } from "~/components/ui/Select";
import { ResponsiveCalendar } from "@nivo/calendar";
import { ResponsiveLine } from "@nivo/line";

interface TripTimelineProps {
  trip: Trip;
}

interface SelectedDay {
  date: string;
  activities: Activity[];
  events: KeyEvent[];
}

interface SelectedActivities {
  type: string;
  date: string;
  activities: Activity[];
}

export function TripTimeline({ trip }: TripTimelineProps) {
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<SelectedActivities | null>(null);

  // Prepare calendar data
  const calendarData = useMemo(() => {
    const data: { day: string; value: number }[] = [];

    // Add activities to calendar
    trip.activities?.forEach((activity) => {
      const date = new Date(activity.date);
      const day = date.toISOString().split("T")[0];
      const existingDay = data.find(d => d.day === day);
      
      if (existingDay) {
        existingDay.value += 1;
      } else {
        data.push({ day, value: 1 });
      }
    });

    // Add key events to calendar
    trip.keyEvents?.forEach((event) => {
      const day = event.date.split("T")[0];
      const existingDay = data.find(d => d.day === day);
      
      if (existingDay) {
        existingDay.value += 1;
      } else {
        data.push({ day, value: 1 });
      }
    });

    return data;
  }, [trip]);

  type ActivityType = 'sightseeing' | 'food' | 'adventure' | 'relaxation' | 'other';
  
  // Prepare activity line data
  const lineData = useMemo(() => {
    const activityTypes: ActivityType[] = ['sightseeing', 'food', 'adventure', 'relaxation', 'other'];
    const dateMap = new Map<string, Map<ActivityType, number>>();

    trip.activities?.forEach((activity) => {
      const date = new Date(activity.date).toISOString().split("T")[0];

      if (!dateMap.has(date)) {
        dateMap.set(date, new Map(activityTypes.map(type => [type, 0])));
      }
      const dayData = dateMap.get(date)!;
      dayData.set(activity.type as ActivityType, (dayData.get(activity.type as ActivityType) || 0) + 1);
    });

    return activityTypes.map(type => ({
      id: type,
      data: Array.from(dateMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, counts]) => ({
          x: date,
          y: counts.get(type) || 0
        }))
    }));
  }, [trip]);

  return (
    <Card className="min-w-0 w-full">
      <CardHeader
        title={
          <div className="flex items-center justify-between">
            <Text variant="h4">Timeline & Activities</Text>
          </div>
        }
      />
      <CardContent>
        <div className="grid grid-cols-1 gap-8 w-full">
          {/* Activity Calendar */}
          <div>
            <div className="flex flex-col gap-6 mb-6">
              <div className="flex items-center justify-between">
                <Text variant="h4">Activity Calendar</Text>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date().toISOString().split("T")[0];
                        const calendarEl = document.querySelector(".calendar-container");
                        if (calendarEl) {
                          calendarEl.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const calendarEl = document.querySelector(".calendar-container");
                        if (calendarEl) {
                          calendarEl.scrollBy({ left: -400, behavior: "smooth" });
                        }
                      }}
                    >
                      ← Prev Month
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const calendarEl = document.querySelector(".calendar-container");
                        if (calendarEl) {
                          calendarEl.scrollBy({ left: 400, behavior: "smooth" });
                        }
                      }}
                    >
                      Next Month →
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Select
                  value={new Date(trip.startDate).getMonth().toString()}
                  onChange={(value: string) => {
                    // TODO: Implement month change
                    console.log("Selected month:", value);
                  }}
                  options={[
                    "January", "February", "March", "April",
                    "May", "June", "July", "August",
                    "September", "October", "November", "December"
                  ].map((month, index) => ({
                    value: index.toString(),
                    label: month
                  }))}
                />
                <Select
                  value={new Date(trip.startDate).getFullYear().toString()}
                  onChange={(value: string) => {
                    // TODO: Implement year change using value directly
                    console.log("Selected year:", value);
                  }}
                  options={Array.from(
                    { length: 3 },
                    (_, i) => {
                      const year = new Date(trip.startDate).getFullYear() + i;
                      return {
                        value: year.toString(),
                        label: year.toString()
                      };
                    }
                  )}
                />
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const calendarEl = document.querySelector(".calendar-container") as HTMLElement;
                      if (calendarEl) {
                        const currentScale = parseFloat(calendarEl.style.transform?.match(/scale\((.*?)\)/)?.[1] || "1");
                        calendarEl.style.transform = `scale(${Math.min(1.5, currentScale + 0.1)})`;
                      }
                    }}
                  >
                    Zoom In +
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const calendarEl = document.querySelector(".calendar-container") as HTMLElement;
                      if (calendarEl) {
                        const currentScale = parseFloat(calendarEl.style.transform?.match(/scale\((.*?)\)/)?.[1] || "1");
                        calendarEl.style.transform = `scale(${Math.max(0.5, currentScale - 0.1)})`;
                      }
                    }}
                  >
                    Zoom Out -
                  </Button>
                </div>
              </div>
            </div>
            <div className="calendar-container h-[700px] bg-background/50 rounded-lg p-8 overflow-x-auto origin-top">
              <style jsx global>{`
                .calendar-day {
                  transition: transform 0.2s ease, z-index 0.2s ease;
                  cursor: pointer;
                }
                .calendar-day:hover {
                  transform: scale(1.1);
                  z-index: 10;
                }
                .calendar-day[data-current="true"] {
                  stroke: #2563eb;
                  stroke-width: 2;
                }
              `}</style>
              <ResponsiveCalendar
                data={calendarData}
                from={trip.startDate.split("T")[0]}
                to={trip.endDate.split("T")[0]}
                emptyColor="#f3f4f6"
                colors={["#93c5fd", "#60a5fa", "#3b82f6", "#2563eb"]}
                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                yearSpacing={100}
                monthBorderColor="#ffffff"
                dayBorderWidth={2}
                dayBorderColor="#ffffff"
                monthLegendOffset={24}
                daySpacing={12}
                monthSpacing={80}
                legendFormat=">-.2"
                theme={{
                  labels: {
                    text: {
                      fontSize: 16,
                      fontWeight: 600
                    }
                  },
                  legends: {
                    text: {
                      fontSize: 14,
                      fontWeight: 500
                    }
                  },
                  tooltip: {
                    container: {
                      background: '#ffffff',
                      padding: '12px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      fontSize: '14px'
                    }
                  }
                }}
                legends={[
                  {
                    anchor: "bottom-right",
                    direction: "row",
                    translateY: 36,
                    itemCount: 4,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemTextColor: "#666",
                    symbolSize: 20,
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#000"
                        }
                      }
                    ]
                  }
                ]}
                onClick={(day) => {
                  const activities = trip.activities?.filter(
                    activity => activity.date.split("T")[0] === day.day
                  );
                  const events = trip.keyEvents?.filter(
                    event => event.date.split("T")[0] === day.day
                  );
                  setSelectedDay({
                    date: day.day,
                    activities: activities || [],
                    events: events || []
                  });
                  setIsDayModalOpen(true);
                }}
                tooltip={({ day, value }) => (
                  <div className="bg-background/95 backdrop-blur-md p-2 rounded-lg border border-border/50 shadow-lg">
                    <Text variant="body-sm">{new Date(day).toLocaleDateString()}</Text>
                    <Text variant="body-sm" color="secondary">
                      {Number(value)} {Number(value) === 1 ? "item" : "items"}
                    </Text>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Activity Distribution */}
          <div>
            <Text variant="h4" className="mb-4">Activity Distribution</Text>
            <div className="h-[400px] bg-background/50 rounded-lg p-6">
              <ResponsiveLine
                data={lineData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{
                  type: "time",
                  format: "%Y-%m-%d",
                  useUTC: false,
                  precision: "day"
                }}
                xFormat="time:%Y-%m-%d"
                yScale={{
                  type: "linear",
                  min: 0,
                  stacked: false
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Activities",
                  legendOffset: -40,
                  legendPosition: "middle"
                }}
                axisBottom={{
                  format: (value: string | number | Date) => {
                    const date = typeof value === 'string' ? new Date(value) : value;
                    return date instanceof Date ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
                  },
                  tickRotation: -45,
                  legendOffset: 36,
                  legendPosition: "middle"
                }}
                enablePoints={true}
                pointSize={8}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                enableSlices="x"
                useMesh={true}
                legends={[
                  {
                    anchor: "right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 10,
                    itemDirection: "left-to-right",
                    itemWidth: 100,
                    itemHeight: 24,
                    symbolSize: 16,
                    symbolShape: "circle",
                    itemTextColor: "#666",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#000",
                          itemBackground: "#f3f4f6"
                        }
                      }
                    ]
                  }
                ]}
                theme={{
                  axis: {
                    legend: {
                      text: {
                        fontSize: 14,
                        fontWeight: 600
                      }
                    },
                    ticks: {
                      text: {
                        fontSize: 12,
                        fontWeight: 500
                      }
                    }
                  },
                  legends: {
                    text: {
                      fontSize: 13,
                      fontWeight: 500
                    }
                  }
                }}
                onClick={(point) => {
                  const activities = trip.activities?.filter(
                    activity => 
                      activity.date.split("T")[0] === point.data.x && 
                      activity.type === point.serieId
                  );
                  setSelectedActivities({
                    type: point.serieId as string,
                    date: point.data.x as string,
                    activities: activities || []
                  });
                  setIsActivityModalOpen(true);
                }}
                tooltip={({ point }) => (
                  <div className="bg-background/95 backdrop-blur-md p-2 rounded-lg border border-border/50 shadow-lg">
                    <Text variant="body-sm" className="capitalize">{point.serieId}</Text>
                    <Text variant="body-sm" color="secondary">
                      {point.data.yFormatted} activities on {point.data.xFormatted}
                    </Text>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </CardContent>

      {/* Day Details Modal */}
      <Modal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        title={selectedDay ? `Activities on ${new Date(selectedDay.date).toLocaleDateString()}` : ""}
      >
        <div className="grid grid-cols-1 gap-6 w-full">
          {!selectedDay || (selectedDay.activities.length === 0 && selectedDay.events.length === 0) ? (
            <Text color="secondary">No activities or events scheduled for this day</Text>
          ) : (
            <>
              {selectedDay.activities.length > 0 && (
                <div className="grid grid-cols-1 gap-4 w-full">
                  <Text variant="body" className="font-semibold">Activities</Text>
                  {selectedDay.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 rounded-lg bg-background-secondary border border-border/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Text variant="body">{activity.activityName}</Text>
                          <Text variant="body-sm" color="secondary">
                            {activity.location} • {activity.duration} mins • ${activity.activityCost}
                          </Text>
                        </div>
                        <Badge className="capitalize">{activity.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedDay.events.length > 0 && (
                <div className="grid grid-cols-1 gap-4 w-full">
                  <Text variant="body" className="font-semibold">Events</Text>
                  {selectedDay.events.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 rounded-lg bg-background-secondary border border-border/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Text variant="body">{event.title}</Text>
                          {event.description && (
                            <Text variant="body-sm" color="secondary">
                              {event.description}
                            </Text>
                          )}
                        </div>
                        <Badge
                          className={
                            event.priorityLevel === "high"
                              ? "bg-red-500"
                              : event.priorityLevel === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }
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

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => {
                setIsDayModalOpen(false);
                // TODO: Open activity form for this date
              }}
            >
              Add Activity
            </Button>
          </div>
        </div>
      </Modal>

      {/* Activity Type Modal */}
      <Modal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
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
            <div className="grid grid-cols-1 gap-4 w-full">
              {selectedActivities.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 rounded-lg bg-background-secondary border border-border/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Text variant="body">{activity.activityName}</Text>
                      <Text variant="body-sm" color="secondary">
                        {activity.location} • {activity.duration} mins • ${activity.activityCost}
                      </Text>
                    </div>
                    {activity.bookingStatus && (
                      <Badge
                        className={
                          activity.bookingStatus === "completed"
                            ? "bg-green-500"
                            : activity.bookingStatus === "booked"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }
                      >
                        {activity.bookingStatus}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => {
                setIsActivityModalOpen(false);
                // TODO: Open activity form for this type/date
              }}
            >
              Add Activity
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
