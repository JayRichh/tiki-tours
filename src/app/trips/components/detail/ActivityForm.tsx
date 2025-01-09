"use client";

import { useCallback } from "react";
import { Button } from "~/components/ui/Button";
import { Text } from "~/components/ui/Text";
import { Activity } from "~/types/trips";

interface ActivityFormProps {
  activity?: Partial<Activity>;
  onSubmit: (data: Omit<Activity, "id">) => void;
  onCancel: () => void;
}

export function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: Omit<Activity, "id"> = {
      activityName: formData.get("activityName") as string,
      activityCost: Number(formData.get("activityCost")),
      date: formData.get("date") as string,
      location: formData.get("location") as string,
      duration: Number(formData.get("duration")),
      type: formData.get("type") as Activity["type"],
      bookingStatus: formData.get("bookingStatus") as Activity["bookingStatus"] || undefined,
      notes: formData.get("notes") as string || undefined,
      category: formData.get("category") as string || undefined
    };

    onSubmit(data);
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Text variant="body-sm" color="secondary">Activity Name</Text>
          <input
            type="text"
            name="activityName"
            defaultValue={activity?.activityName}
            className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text variant="body-sm" color="secondary">Date</Text>
            <input
              type="date"
              name="date"
              defaultValue={activity?.date}
              className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
              required
            />
          </div>
          <div>
            <Text variant="body-sm" color="secondary">Duration (mins)</Text>
            <input
              type="number"
              name="duration"
              defaultValue={activity?.duration}
              className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
              required
            />
          </div>
        </div>

        <div>
          <Text variant="body-sm" color="secondary">Location</Text>
          <input
            type="text"
            name="location"
            defaultValue={activity?.location}
            className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text variant="body-sm" color="secondary">Cost</Text>
            <input
              type="number"
              name="activityCost"
              defaultValue={activity?.activityCost}
              className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
              required
            />
          </div>
          <div>
            <Text variant="body-sm" color="secondary">Category</Text>
            <input
              type="text"
              name="category"
              defaultValue={activity?.category}
              className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text variant="body-sm" color="secondary">Type</Text>
            <select
              name="type"
              defaultValue={activity?.type}
              className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
              required
            >
              <option value="sightseeing">Sightseeing</option>
              <option value="food">Food</option>
              <option value="adventure">Adventure</option>
              <option value="relaxation">Relaxation</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <Text variant="body-sm" color="secondary">Booking Status</Text>
            <select
              name="bookingStatus"
              defaultValue={activity?.bookingStatus}
              className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
            >
              <option value="">Not Required</option>
              <option value="planned">Planned</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <Text variant="body-sm" color="secondary">Notes</Text>
          <textarea
            name="notes"
            defaultValue={activity?.notes}
            className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {activity ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
