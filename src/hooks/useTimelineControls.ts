import { useState, useCallback, useMemo } from 'react';
import { Trip, Activity, KeyEvent } from '~/types/trips';

interface TimelineDay {
  date: string;
  value: number;
  activities: Activity[];
  events: KeyEvent[];
  color: string;
}

interface TimelineControls {
  currentMonth: number;
  currentYear: number;
  scale: number;
  days: TimelineDay[];
  calendarConfig: {
    from: string;
    to: string;
    emptyColor: string;
    colors: string[];
    daySpacing: number;
    dayBorderWidth: number;
    monthSpacing: number;
    monthBorderColor: string;
    monthLegendOffset: number;
    yearSpacing: number;
    theme: any;
  };
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  setScale: (scale: number) => void;
  getHighlightColor: (value: number) => string;
  getDayActivities: (date: string) => { activities: Activity[]; events: KeyEvent[] };
}

export function useTimelineControls(trip: Trip): TimelineControls {
  const [currentMonth, setMonth] = useState(() => new Date(trip.startDate).getMonth());
  const [currentYear, setYear] = useState(() => new Date(trip.startDate).getFullYear());
  const [scale, setScale] = useState(1);

  // Color scale for activity density
  const colorScale = ['#e5f6ff', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb'];
  const getHighlightColor = useCallback((value: number) => {
    if (value === 0) return '#f3f4f6';
    if (value <= 1) return colorScale[0];
    if (value <= 2) return colorScale[1];
    if (value <= 3) return colorScale[2];
    if (value <= 4) return colorScale[3];
    return colorScale[4];
  }, []);

  // Process timeline data
  const days = useMemo(() => {
    const dayMap = new Map<string, TimelineDay>();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    // Initialize all days in range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dayMap.set(dateStr, {
        date: dateStr,
        value: 0,
        activities: [],
        events: [],
        color: '#f3f4f6'
      });
    }

    // Add activities
    trip.activities?.forEach(activity => {
      const dateStr = activity.date.split('T')[0];
      const day = dayMap.get(dateStr);
      if (day) {
        day.activities.push(activity);
        day.value += 1;
        day.color = getHighlightColor(day.value);
      }
    });

    // Add events
    trip.keyEvents?.forEach(event => {
      const dateStr = event.date.split('T')[0];
      const day = dayMap.get(dateStr);
      if (day) {
        day.events.push(event);
        day.value += 1;
        day.color = getHighlightColor(day.value);
      }
    });

    return Array.from(dayMap.values());
  }, [trip, getHighlightColor]);

  // Calendar configuration
  const calendarConfig = useMemo(() => ({
    from: trip.startDate.split('T')[0],
    to: trip.endDate.split('T')[0],
    emptyColor: '#f3f4f6',
    colors: colorScale,
    daySpacing: 3,
    dayBorderWidth: 2,
    monthSpacing: 40,
    monthBorderColor: '#ffffff',
    monthLegendOffset: 24,
    yearSpacing: 60,
    theme: {
      labels: {
        text: {
          fontSize: 14,
          fontWeight: 600,
          fill: '#374151'
        }
      },
      legends: {
        text: {
          fontSize: 13,
          fontWeight: 500,
          fill: '#374151'
        }
      },
      tooltip: {
        container: {
          background: '#ffffff',
          color: '#374151',
          fontSize: '14px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '12px'
        }
      },
      grid: {
        line: {
          stroke: '#e5e7eb',
          strokeWidth: 1
        }
      },
      crosshair: {
        line: {
          stroke: '#60a5fa',
          strokeWidth: 1,
          strokeOpacity: 0.5
        }
      }
    }
  }), [trip, colorScale]);

  const getDayActivities = useCallback((date: string) => {
    const day = days.find(d => d.date === date);
    return {
      activities: day?.activities || [],
      events: day?.events || []
    };
  }, [days]);

  return {
    currentMonth,
    currentYear,
    scale,
    days,
    calendarConfig,
    setMonth,
    setYear,
    setScale,
    getHighlightColor,
    getDayActivities
  };
}
