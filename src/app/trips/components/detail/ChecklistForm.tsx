"use client";

import { useForm } from "~/hooks/useForm";
import { Button } from "~/components/ui/Button";
import { Text } from "~/components/ui/Text";
import { Select } from "~/components/ui/Select";

interface ChecklistFormProps {
  onSubmit: (data: ChecklistFormData) => Promise<void>;
  onCancel: () => void;
  isItem?: boolean;
}

export interface ChecklistFormData {
  title: string;
  category?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const categoryOptions = [
  { value: "travel", label: "Travel" },
  { value: "accommodation", label: "Accommodation" },
  { value: "documents", label: "Documents" },
  { value: "packing", label: "Packing" },
  { value: "activities", label: "Activities" },
  { value: "other", label: "Other" },
];

export function ChecklistForm({ onSubmit, onCancel, isItem = false }: ChecklistFormProps) {
  const form = useForm<ChecklistFormData>({
    title: "",
    category: "",
    dueDate: "",
    priority: undefined,
    notes: "",
  }, onSubmit);

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <div>
        <Text variant="body-sm" color="secondary">Title</Text>
        <input
          type="text"
          value={form.values.title}
          onChange={(e) => form.handleChange("title", e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
          required
        />
      </div>

      {!isItem && (
        <div>
          <Text variant="body-sm" color="secondary">Category</Text>
          <Select
            options={categoryOptions}
            value={form.values.category}
            onChange={(value) => form.handleChange("category", value)}
            placeholder="Select category"
          />
        </div>
      )}

      <div>
        <Text variant="body-sm" color="secondary">Due Date</Text>
        <input
          type="date"
          value={form.values.dueDate}
          onChange={(e) => form.handleChange("dueDate", e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
        />
      </div>

      {isItem && (
        <>
          <div>
            <Text variant="body-sm" color="secondary">Priority</Text>
            <Select
              options={priorityOptions}
              value={form.values.priority}
              onChange={(value) => form.handleChange("priority", value)}
              placeholder="Select priority"
            />
          </div>

          <div>
            <Text variant="body-sm" color="secondary">Notes</Text>
            <textarea
              value={form.values.notes}
              onChange={(e) => form.handleChange("notes", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
              rows={3}
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={form.isSubmitting}>
          {isItem ? "Add Item" : "Create Checklist"}
        </Button>
      </div>
    </form>
  );
}
