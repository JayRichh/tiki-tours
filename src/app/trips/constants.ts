import { TripStatus } from "~/types/trips";

export const statusColors: Record<TripStatus, string> = {
  draft: "bg-gray-500",
  planning: "bg-blue-500",
  booked: "bg-green-500",
  relocating: "bg-purple-500",
  in_progress: "bg-yellow-500",
  completed: "bg-indigo-500",
};

export const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "planning", label: "Planning" },
  { value: "booked", label: "Booked" },
  { value: "relocating", label: "Relocating" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];
