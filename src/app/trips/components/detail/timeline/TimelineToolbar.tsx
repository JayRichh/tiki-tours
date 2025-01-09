"use client";

import { Button } from "~/components/ui/Button";
import { Select } from "~/components/ui/Select";
import { Text } from "~/components/ui/Text";

interface TimelineToolbarProps {
  currentMonth: number;
  currentYear: number;
  startYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onToday: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  className?: string;
}

export function TimelineToolbar({
  currentMonth,
  currentYear,
  startYear,
  onMonthChange,
  onYearChange,
  onToday,
  onPrevMonth,
  onNextMonth,
  onZoomIn,
  onZoomOut,
  className
}: TimelineToolbarProps) {
  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: new Date(2000, i).toLocaleString('default', { month: 'long' })
  }));

  // Generate year options (trip year ± 2 years)
  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => ({
      value: (startYear - 2 + i).toString(),
      label: (startYear - 2 + i).toString()
    })
  );

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="min-w-[80px]"
          >
            Today
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevMonth}
              className="px-2"
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextMonth}
              className="px-2"
            >
              →
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Text variant="body-sm" color="secondary">Month:</Text>
            <Select
              value={currentMonth.toString()}
              onChange={(value) => onMonthChange(parseInt(value))}
              options={monthOptions}
              className="w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <Text variant="body-sm" color="secondary">Year:</Text>
            <Select
              value={currentYear.toString()}
              onChange={(value) => onYearChange(parseInt(value))}
              options={yearOptions}
              className="w-24"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            className="px-2"
          >
            +
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            className="px-2"
          >
            −
          </Button>
        </div>
      </div>
    </div>
  );
}
