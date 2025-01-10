"use client";

import { AlertCircle, CheckCircle, Circle, Clock, Plus } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Modal } from "~/components/ui/Modal";
import { Text } from "~/components/ui/Text";

import { Checklist, ChecklistItem, Trip } from "~/types/trips";

import { ChecklistForm, ChecklistFormData } from "./ChecklistForm";

interface TripChecklistsProps {
  trip: Trip;
  onUpdate: (updates: Partial<Trip>) => Promise<void>;
}

export function TripChecklists({ trip, onUpdate }: TripChecklistsProps) {
  // Get dialog state from URL hash
  const [dialogState, setDialogState] = useState<{
    type: "checklist" | "item" | null;
    action: "new" | "edit" | null;
    id?: string;
  }>({ type: null, action: null });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setDialogState({ type: null, action: null });
        return;
      }

      // Format: #tab/dialog/action/params
      const [tab, dialog, action, ...params] = hash.split("/");
      if (tab === "checklists" && (dialog === "checklist" || dialog === "item") && action) {
        const param = params.join("/"); // Rejoin any remaining params
        setDialogState({
          type: dialog as "checklist" | "item",
          action: action as "new" | "edit",
          id: param || undefined,
        });
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Helper to update dialog state and URL hash
  const updateDialogState = (
    type: typeof dialogState.type,
    action: typeof dialogState.action,
    id?: string
  ) => {
    if (!type || !action) {
      window.history.pushState(null, "", window.location.pathname + "#checklists");
      setDialogState({ type: null, action: null });
      return;
    }

    const hash = `#checklists/${type}/${action}${id ? `/${id}` : ""}`;
    window.history.pushState(null, "", hash);
    setDialogState({ type, action, id });
  };

  const handleAddChecklist = useCallback(
    async (data: ChecklistFormData) => {
      const newChecklist: Checklist = {
        id: crypto.randomUUID(),
        title: data.title,
        items: [],
        category: data.category,
        dueDate: data.dueDate,
      };

      await onUpdate({
        checklists: [...(trip.checklists || []), newChecklist],
      });
      updateDialogState(null, null);
    },
    [trip, onUpdate]
  );

  const handleAddItem = useCallback(
    async (checklistId: string, data: ChecklistFormData) => {
      const newItem: ChecklistItem = {
        id: crypto.randomUUID(),
        title: data.title,
        completed: false,
        dueDate: data.dueDate,
        priority: data.priority,
        notes: data.notes,
      };

      const updatedChecklists = trip.checklists?.map((checklist) =>
        checklist.id === checklistId
          ? { ...checklist, items: [...checklist.items, newItem] }
          : checklist
      );

      await onUpdate({ checklists: updatedChecklists });
      updateDialogState(null, null);
    },
    [trip, onUpdate]
  );

  const handleToggleItem = useCallback(
    async (checklistId: string, itemId: string) => {
      const updatedChecklists = trip.checklists?.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : checklist
      );

      await onUpdate({ checklists: updatedChecklists });
    },
    [trip, onUpdate]
  );

  const getItemStatus = useCallback((item: ChecklistItem) => {
    if (item.completed) return "completed";
    if (!item.dueDate) return "pending";

    const now = new Date();
    const dueDate = new Date(item.dueDate);
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return "overdue";
    if (daysDiff <= 3) return "due-soon";
    return "pending";
  }, []);

  const renderStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "due-soon":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  }, []);

  return (
    <Card className="w-full">
      <CardHeader
        title={
          <div className="flex justify-between items-center">
            <Text variant="h3">Checklists</Text>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => updateDialogState("checklist", "new")}
            >
              Add Checklist
            </Button>
          </div>
        }
      />
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {trip.checklists?.map((checklist) => (
            <Card key={checklist.id}>
              <CardHeader
                title={
                  <div className="flex items-center justify-between">
                    <span>{checklist.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Plus className="h-4 w-4" />}
                      onClick={() => updateDialogState("item", "new", checklist.id)}
                    >
                      Add Item
                    </Button>
                  </div>
                }
                subtitle={
                  checklist.category && (
                    <Badge variant="solid" color="primary">
                      {checklist.category}
                    </Badge>
                  )
                }
              />
              <CardContent className="w-full">
                <div className="grid grid-cols-1 gap-3 w-full">
                  {checklist.items.map((item) => {
                    const status = getItemStatus(item);
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-2 rounded hover:bg-background/50 w-full"
                      >
                        <button
                          onClick={() => handleToggleItem(checklist.id, item.id)}
                          className="mt-1"
                        >
                          {renderStatusIcon(status)}
                        </button>
                        <div className="flex-1">
                          <Text className={item.completed ? "line-through text-foreground/50" : ""}>
                            {item.title}
                          </Text>
                          {item.dueDate && (
                            <Text variant="body-sm" color="secondary">
                              Due: {new Date(item.dueDate).toLocaleDateString()}
                            </Text>
                          )}
                          {item.notes && (
                            <Text variant="body-sm" color="secondary">
                              {item.notes}
                            </Text>
                          )}
                        </div>
                        {item.priority && (
                          <Badge
                            variant="solid"
                            color={
                              item.priority === "high"
                                ? "error"
                                : item.priority === "medium"
                                  ? "warning"
                                  : "info"
                            }
                          >
                            {item.priority}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Modal
          isOpen={dialogState.type === "checklist" && dialogState.action === "new"}
          onClose={() => updateDialogState(null, null)}
          title="New Checklist"
        >
          <ChecklistForm
            onSubmit={handleAddChecklist}
            onCancel={() => updateDialogState(null, null)}
          />
        </Modal>

        <Modal
          isOpen={dialogState.type === "item" && dialogState.action === "new"}
          onClose={() => updateDialogState(null, null)}
          title="New Checklist Item"
        >
          {dialogState.type === "item" && dialogState.action === "new" && dialogState.id && (
            <ChecklistForm
              isItem
              onSubmit={(data) => handleAddItem(dialogState.id!, data)}
              onCancel={() => updateDialogState(null, null)}
            />
          )}
        </Modal>
      </CardContent>
    </Card>
  );
}
