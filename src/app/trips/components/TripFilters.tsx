"use client";

import { Button } from "~/components/ui/Button";
import { Select } from "~/components/ui/Select";
import { TripStatus } from "~/types/trips";
import { statusOptions } from "../constants";
import { Plus } from "lucide-react";

interface TripFiltersProps {
  status?: TripStatus;
  onStatusChange: (status: TripStatus | undefined) => void;
  onCreateNew: () => void;
}

export function TripFilters({ status, onStatusChange, onCreateNew }: TripFiltersProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Select
          options={statusOptions}
          value={status}
          onChange={(value) => onStatusChange(value as TripStatus)}
          placeholder="Filter by status"
          clearable
        />
      </div>
      <Button
        variant="primary"
        leftIcon={<Plus className="h-4 w-4" />}
        onClick={onCreateNew}
      >
        New Trip
      </Button>
    </div>
  );
}
