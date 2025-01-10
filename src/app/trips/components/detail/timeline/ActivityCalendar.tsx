"use client";

import { ResponsiveCalendar } from "@nivo/calendar";
import { CalendarDatum, CalendarDayData } from "@nivo/calendar";

import { useRef } from "react";

import { Text } from "~/components/ui/Text";

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
  const { currentMonth, currentYear, zoomLevel, days, calendarConfig, setMonth, setYear, setZoomLevel } =
    useTimelineControls(trip);

  const handleZoomIn = () => {
    setZoomLevel(Math.min(4, zoomLevel + 1));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(1, zoomLevel - 1));
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

      <div className="relative bg-background/50 rounded-lg p-8 overflow-hidden w-full h-[500px]">
        <ResponsiveCalendar
            data={days.map((day) => ({
              day: day.date,
              value: day.value,
              color: day.color,
            }))}
            from={calendarConfig.from}
            to={calendarConfig.to}
            emptyColor={calendarConfig.emptyColor}
            colors={calendarConfig.colors}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            monthBorderColor={calendarConfig.monthBorderColor}
            dayBorderWidth={calendarConfig.dayBorderWidth}
            dayBorderColor="#ffffff"
            monthLegendOffset={calendarConfig.monthLegendOffset}
            theme={calendarConfig.theme}
            onClick={(day: CalendarDayData) => {
              if (day.day) onDayClick(day.day);
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
  );
}
