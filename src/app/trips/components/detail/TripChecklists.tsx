"use client";

import { useState, useCallback } from "react";
import { Trip, Checklist, ChecklistItem } from "~/types/trips";
import { ChecklistForm, ChecklistFormData } from "./ChecklistForm";
import { Card, CardHeader, CardContent } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Text } from "~/components/ui/Text";
import { Badge } from "~/components/ui/Badge";
import { Modal } from "~/components/ui/Modal";
import { Plus, CheckCircle, Circle, AlertCircle, Clock } from "lucide-react";

interface TripChecklistsProps {
  trip: Trip;
  onUpdate: (updates: Partial<Trip>) => Promise<void>;
}

export function TripChecklists({ trip, onUpdate }: TripChecklistsProps) {
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState<string | null>(null);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);

  const handleAddChecklist = useCallback(async (data: ChecklistFormData) => {
    const newChecklist: Checklist = {
      id: crypto.randomUUID(),
      title: data.title,
      items: [],
      category: data.category,
      dueDate: data.dueDate
    };

    await onUpdate({
      checklists: [...(trip.checklists || []), newChecklist]
    });
    setIsAddingChecklist(false);
  }, [trip, onUpdate]);

  const handleAddItem = useCallback(async (checklistId: string, data: ChecklistFormData) => {
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      title: data.title,
      completed: false,
      dueDate: data.dueDate,
      priority: data.priority,
      notes: data.notes
    };

    const updatedChecklists = trip.checklists?.map(checklist => 
      checklist.id === checklistId
        ? { ...checklist, items: [...checklist.items, newItem] }
        : checklist
    );

    await onUpdate({ checklists: updatedChecklists });
    setIsAddingItem(null);
  }, [trip, onUpdate]);

  const handleToggleItem = useCallback(async (checklistId: string, itemId: string) => {
    const updatedChecklists = trip.checklists?.map(checklist => 
      checklist.id === checklistId
        ? {
            ...checklist,
            items: checklist.items.map(item =>
              item.id === itemId
                ? { ...item, completed: !item.completed }
                : item
            )
          }
        : checklist
    );

    await onUpdate({ checklists: updatedChecklists });
  }, [trip, onUpdate]);

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
              onClick={() => setIsAddingChecklist(true)}
            >
              Add Checklist
            </Button>
          </div>
        }
      />
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {trip.checklists?.map(checklist => (
            <Card key={checklist.id}>
              <CardHeader
                title={
                  <div className="flex items-center justify-between">
                    <span>{checklist.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Plus className="h-4 w-4" />}
                      onClick={() => setIsAddingItem(checklist.id)}
                    >
                      Add Item
                    </Button>
                  </div>
                }
                subtitle={checklist.category && (
                  <Badge variant="secondary">{checklist.category}</Badge>
                )}
              />
              <CardContent className="w-full">
                <div className="grid grid-cols-1 gap-3 w-full">
                  {checklist.items.map(item => {
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
                          <Text
                            className={item.completed ? "line-through text-foreground/50" : ""}
                          >
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
          isOpen={isAddingChecklist}
          onClose={() => setIsAddingChecklist(false)}
          title="New Checklist"
        >
          <ChecklistForm
            onSubmit={handleAddChecklist}
            onCancel={() => setIsAddingChecklist(false)}
          />
        </Modal>

        <Modal
          isOpen={!!isAddingItem}
          onClose={() => setIsAddingItem(null)}
          title="New Checklist Item"
        >
          {isAddingItem && (
            <ChecklistForm
              isItem
              onSubmit={(data) => handleAddItem(isAddingItem, data)}
              onCancel={() => setIsAddingItem(null)}
            />
          )}
        </Modal>
      </CardContent>
    </Card>
  );
}
