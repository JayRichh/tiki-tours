"use client";

import { ResponsiveCalendar } from "@nivo/calendar";
import { CalendarDatum, CalendarDayData } from "@nivo/calendar";

import { useRef } from "react";

import { Text } from "~/components/ui/Text";

import { useChartDimensions } from "~/hooks/useChartDimensions";
import { useTimelineControls } from "~/hooks/useTimelineControls";

import { Trip } from "~/types/trips";

import { TimelineToolbar } from "./TimelineToolbar";

interface ActivityCalendarProps {
  trip: Trip;
  onDayClick: (date: string) => void;
}

interface CustomCalendarDatum extends CalendarDatum {
  color?: string;
}

export function ActivityCalendar({ trip, onDayClick }: ActivityCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, updateScale] = useChartDimensions(containerRef, {
    marginTop: 50,
    marginRight: 110,
    marginBottom: 50,
    marginLeft: 60,
    minHeight: 500,
    maxScale: 1.5,
    minScale: 0.5,
  });

  const { currentMonth, currentYear, days, calendarConfig, setMonth, setYear, setScale } =
    useTimelineControls(trip);

  const handleZoomIn = () => {
    const newScale = Math.min(1.5, dimensions.scale + 0.1);
    updateScale(newScale);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.5, dimensions.scale - 0.1);
    updateScale(newScale);
    setScale(newScale);
  };

  const handleToday = () => {
    const today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setMonth(11);
      setYear(currentYear - 1);
    } else {
      setMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setMonth(0);
      setYear(currentYear + 1);
    } else {
      setMonth(currentMonth + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Text variant="h4">Activity Calendar</Text>
      </div>

      <TimelineToolbar
        currentMonth={currentMonth}
        currentYear={currentYear}
        startYear={new Date(trip.startDate).getFullYear()}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onToday={handleToday}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        className="mb-4"
      />

      <div
        ref={containerRef}
        className="relative bg-background/50 rounded-lg p-8 overflow-hidden"
        style={{ height: dimensions.height }}
      >
        <div
          className="w-full h-full origin-top-left"
          style={{
            transform: `scale(${dimensions.scale})`,
            width: `${100 / dimensions.scale}%`,
            height: `${100 / dimensions.scale}%`,
          }}
          key={dimensions.scale}
        >
          <ResponsiveCalendar
            data={days
              .filter((day) => {
                const date = new Date(day.date);
                return date.getFullYear() === currentYear;
              })
              .map((day) => ({
                day: day.date,
                value: day.value,
                color: day.color,
              }))}
            from={`${currentYear}-01-01`}
            to={`${currentYear}-12-31`}
            emptyColor="#f3f4f6"
            colors={["#e5f6ff", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb"]}
            margin={{
              top: dimensions.marginTop,
              right: dimensions.marginRight,
              bottom: dimensions.marginBottom,
              left: dimensions.marginLeft,
            }}
            yearSpacing={40}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            daySpacing={3}
            monthSpacing={40}
            monthLegendOffset={10}
            onClick={(day: CalendarDayData) => {
              if (day.day) onDayClick(day.day);
            }}
            theme={{
              labels: {
                text: {
                  fontSize: 14,
                  fontWeight: 600,
                  fill: "#374151",
                },
              },
              legends: {
                text: {
                  fontSize: 13,
                  fontWeight: 500,
                  fill: "#374151",
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
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
