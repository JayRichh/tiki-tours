"use client";

import { Button } from "~/components/ui/Button";
import { Select } from "~/components/ui/Select";
import { Text } from "~/components/ui/Text";

import { useForm } from "~/hooks/useForm";

import { Trip, TripStatus } from "~/types/trips";

import { statusOptions } from "../constants";

interface TripFormValues {
  destination: string;
  startDate: string;
  endDate: string;
  tripBudget: number;
  tripDetails: string;
  flexibleDates: boolean;
  relocationPlan: boolean;
  numberOfTravelers?: number;
  travelMode: string;
  holidayPreferences: string;
  status: TripStatus;
}

interface TripFormProps {
  trip: Trip | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

const travelModeOptions = [
  { value: "flight", label: "Flight" },
  { value: "train", label: "Train" },
  { value: "car", label: "Car" },
  { value: "bus", label: "Bus" },
  { value: "ship", label: "Ship" },
  { value: "other", label: "Other" },
];

export function TripForm({ trip, onSubmit, onCancel }: TripFormProps) {
  const initialValues: TripFormValues = {
    destination: trip?.destination || "",
    startDate: trip?.startDate || "",
    endDate: trip?.endDate || "",
    tripBudget: trip?.tripBudget || 0,
    tripDetails: trip?.tripDetails || "",
    flexibleDates: trip?.flexibleDates || false,
    relocationPlan: trip?.relocationPlan || false,
    numberOfTravelers: trip?.numberOfTravelers || undefined,
    travelMode: trip?.travelMode || "",
    holidayPreferences: trip?.holidayPreferences?.join(", ") || "",
    status: trip?.status || "draft",
  };

  const form = useForm<TripFormValues>(initialValues, async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "holidayPreferences") {
          // Split and trim preferences
          const prefs = value
            .split(",")
            .map((p: string) => p.trim())
            .filter(Boolean);
          formData.append(key, prefs.join(","));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    await onSubmit(formData);
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Text variant="body-sm" color="secondary">
            Destination
          </Text>
          <input
            type="text"
            name="destination"
            placeholder="Where are you going?"
            value={form.values.destination}
            onChange={(e) => form.handleChange("destination", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text variant="body-sm" color="secondary">
              Start Date
            </Text>
            <input
              type="date"
              name="startDate"
              value={form.values.startDate}
              onChange={(e) => form.handleChange("startDate", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
              required
            />
          </div>
          <div>
            <Text variant="body-sm" color="secondary">
              End Date
            </Text>
            <input
              type="date"
              name="endDate"
              value={form.values.endDate}
              onChange={(e) => form.handleChange("endDate", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                name="relocationPlan"
                checked={form.values.relocationPlan}
                onChange={(e) => form.handleChange("relocationPlan", e.target.checked)}
                value="true"
              />
              <Text variant="body-sm" color="secondary">
                Relocation Plan
              </Text>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                name="flexibleDates"
                checked={form.values.flexibleDates}
                onChange={(e) => form.handleChange("flexibleDates", e.target.checked)}
                value="true"
              />
              <Text variant="body-sm" color="secondary">
                Flexible Dates
              </Text>
            </label>
          </div>
        </div>

        <div>
          <Text variant="body-sm" color="secondary">
            Budget (optional)
          </Text>
          <input
            type="number"
            name="tripBudget"
            placeholder="Enter budget amount"
            value={form.values.tripBudget || ""}
            onChange={(e) =>
              form.handleChange("tripBudget", e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
          />
        </div>

        <div>
          <Text variant="body-sm" color="secondary">
            Trip Details
          </Text>
          <textarea
            name="tripDetails"
            placeholder="Add any important details about your trip"
            value={form.values.tripDetails}
            onChange={(e) => form.handleChange("tripDetails", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text variant="body-sm" color="secondary">
              Number of Travelers
            </Text>
            <input
              type="number"
              name="numberOfTravelers"
              placeholder="How many people?"
              value={form.values.numberOfTravelers || ""}
              onChange={(e) =>
                form.handleChange(
                  "numberOfTravelers",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
            />
          </div>
          <div>
            <Text variant="body-sm" color="secondary">
              Travel Mode
            </Text>
            <select
              name="travelMode"
              value={form.values.travelMode}
              onChange={(e) => form.handleChange("travelMode", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
            >
              <option value="">Select mode of travel</option>
              {travelModeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Text variant="body-sm" color="secondary">
            Holiday Preferences (comma-separated)
          </Text>
          <input
            type="text"
            name="holidayPreferences"
            placeholder="e.g., beach, hiking, culture, food"
            value={form.values.holidayPreferences}
            onChange={(e) => form.handleChange("holidayPreferences", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
          />
        </div>

        {trip && (
          <div>
            <Text variant="body-sm" color="secondary">
              Status
            </Text>
            <Select
              options={statusOptions}
              value={form.values.status}
              onChange={(value) => form.handleChange("status", value)}
              placeholder="Select status"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {trip ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
