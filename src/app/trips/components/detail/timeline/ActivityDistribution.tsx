"use client";

import { ResponsiveLine } from "@nivo/line";
import { Point, PointTooltipProps, Serie } from "@nivo/line";

import { useRef, useState } from "react";

import { Text } from "~/components/ui/Text";

import { useChartDimensions } from "~/hooks/useChartDimensions";

import { Trip } from "~/types/trips";

interface ActivityDistributionProps {
  trip: Trip;
  onPointClick: (type: string, date: string) => void;
}

const formatTooltipDate = (date: string): string => {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function ActivityDistribution({ trip, onPointClick }: ActivityDistributionProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const ZOOM_LEVELS = {
    1: { width: 800, height: 400 },
    2: { width: 1000, height: 500 },
    3: { width: 1200, height: 600 },
    4: { width: 1400, height: 700 },
  };

  const dimensions = ZOOM_LEVELS[zoomLevel as keyof typeof ZOOM_LEVELS];

  // Process activity data
  const activityTypes = ["sightseeing", "food", "adventure", "relaxation", "other"];
  const dateMap = new Map<string, Map<string, number>>();

  // Initialize date map with all activity types
  trip.activities?.forEach((activity) => {
    const date = activity.date.split("T")[0];
    if (!dateMap.has(date)) {
      dateMap.set(date, new Map(activityTypes.map((type) => [type, 0])));
    }
    const dayData = dateMap.get(date)!;
    dayData.set(activity.type, (dayData.get(activity.type) || 0) + 1);
  });

  // Convert to Nivo line data format
  const lineData: Serie[] = activityTypes.map((type) => ({
    id: type,
    data: Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, counts]) => ({
        x: date,
        y: counts.get(type) || 0,
      })),
  }));

  const colors = {
    sightseeing: "#3b82f6",
    food: "#f59e0b",
    adventure: "#10b981",
    relaxation: "#8b5cf6",
    other: "#6b7280",
  };

  return (
    <div className="space-y-4">
      <Text variant="h4">Activity Distribution</Text>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))}
          className="p-2 rounded-lg bg-background-secondary hover:bg-background-secondary/80"
          disabled={zoomLevel === 1}
        >
          <Text>-</Text>
        </button>
        <button
          onClick={() => setZoomLevel(Math.min(4, zoomLevel + 1))}
          className="p-2 rounded-lg bg-background-secondary hover:bg-background-secondary/80"
          disabled={zoomLevel === 4}
        >
          <Text>+</Text>
        </button>
      </div>
      
      <div
        className="relative bg-background/50 rounded-lg p-6"
        style={{ 
          width: dimensions.width,
          height: dimensions.height 
        }}
        key={zoomLevel}
      >
        <ResponsiveLine
            data={lineData}
            margin={{
              top: 50,
              right: 110,
              bottom: 50,
              left: 60,
            }}
            // lineHeight={chartDimensions.boundedHeight + chartDimensions.marginTop + chartDimensions.marginBottom}
            xScale={{
              type: "time",
              format: "%Y-%m-%d",
              useUTC: false,
              precision: "day",
            }}
            xFormat="time:%Y-%m-%d"
            yScale={{
              type: "linear",
              min: 0,
              stacked: false,
            }}
            curve="monotoneX"
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Activities",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            axisBottom={{
              format: "%b %d",
              tickRotation: -45,
              legendOffset: 36,
              legendPosition: "middle",
              tickValues: "every 2 days",
            }}
            enablePoints={true}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            enableSlices="x"
            useMesh={true}
            colors={activityTypes.map((type) => colors[type as keyof typeof colors])}
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
                      itemBackground: "#f3f4f6",
                    },
                  },
                ],
              },
            ]}
            theme={{
              axis: {
                legend: {
                  text: {
                    fontSize: 14,
                    fontWeight: 600,
                  },
                },
                ticks: {
                  text: {
                    fontSize: 12,
                    fontWeight: 500,
                  },
                },
              },
              legends: {
                text: {
                  fontSize: 13,
                  fontWeight: 500,
                },
              },
              tooltip: {
                container: {
                  background: "#ffffff",
                  color: "#374151",
                  fontSize: "14px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  padding: "12px",
                },
              },
              crosshair: {
                line: {
                  stroke: "#60a5fa",
                  strokeWidth: 1,
                  strokeOpacity: 0.5,
                },
              },
            }}
            onClick={(point) => {
              onPointClick(String(point.serieId), String(point.data.xFormatted));
            }}
            tooltip={({ point }) => (
              <div className="bg-background/95 backdrop-blur-md p-3 rounded-lg border border-border/50 shadow-lg">
                <Text variant="body-sm" className="font-medium capitalize">
                  {String(point.serieId)}
                </Text>
                <Text variant="body-sm" color="secondary">
                  {`${point.data.yFormatted} activities on ${formatTooltipDate(String(point.data.xFormatted))}`}
                </Text>
              </div>
            )}
          />
      </div>
    </div>
  );
}
