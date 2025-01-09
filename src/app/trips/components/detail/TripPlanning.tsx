"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { Trip, KeyEvent, Deadline } from "~/types/trips";
import { Calendar, Clock, Plus } from "lucide-react";

interface TripPlanningProps {
  trip: Trip;
  onAddKeyEvent?: (event: Omit<KeyEvent, "id">) => void;
  onUpdateKeyEvent?: (eventId: string, updates: Partial<KeyEvent>) => void;
  onDeleteKeyEvent?: (eventId: string) => void;
  onAddDeadline?: (deadline: Omit<Deadline, "id">) => void;
  onUpdateDeadline?: (deadlineId: string, updates: Partial<Deadline>) => void;
  onDeleteDeadline?: (deadlineId: string) => void;
}

export function TripPlanning({
  trip,
  onAddKeyEvent,
  onUpdateKeyEvent,
  onDeleteKeyEvent,
  onAddDeadline,
  onUpdateDeadline,
  onDeleteDeadline
}: TripPlanningProps) {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<KeyEvent | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);

  const handleEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      description: formData.get("description") as string || undefined,
      priorityLevel: formData.get("priorityLevel") as "low" | "medium" | "high" || "medium"
    };

    if (selectedEvent) {
      onUpdateKeyEvent?.(selectedEvent.id, data);
    } else {
      onAddKeyEvent?.(data);
    }
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDeadlineSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      description: formData.get("description") as string,
      dueDate: formData.get("dueDate") as string,
      completed: formData.get("completed") === "true"
    };

    if (selectedDeadline) {
      onUpdateDeadline?.(selectedDeadline.id, data);
    } else {
      onAddDeadline?.(data);
    }
    setIsDeadlineModalOpen(false);
    setSelectedDeadline(null);
  };

  return (
    <Card>
      <CardHeader
        title={
          <div className="flex items-center justify-between">
            <Text variant="h4">Planning & Timeline</Text>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsDeadlineModalOpen(true)}
              >
                Add Deadline
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsEventModalOpen(true)}
              >
                Add Event
              </Button>
            </div>
          </div>
        }
      />
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Key Events */}
          <div className="col-span-1 md:col-span-2 w-full">
            <Text variant="body-sm" color="secondary" className="mb-4">
              Key Events
            </Text>
            <div className="grid grid-cols-1 gap-4 w-full">
              {trip.keyEvents?.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg bg-background-secondary border border-border/50"
                >
                  <div className="flex items-center justify-between">
          <div className="w-full">
                      <Text variant="body">{event.title}</Text>
                      <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        {event.description && (
                          <Text variant="body-sm" color="secondary">
                            {event.description}
                          </Text>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          event.priorityLevel === "high"
                            ? "bg-red-500"
                            : event.priorityLevel === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }
                      >
                        {event.priorityLevel}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsEventModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deadlines */}
          <div className="col-span-1 md:col-span-2 w-full">
            <Text variant="body-sm" color="secondary" className="mb-4">
              Deadlines & Tasks
            </Text>
            <div className="grid grid-cols-1 gap-4 w-full">
              {trip.deadlines?.map((deadline) => (
                <div
                  key={deadline.id}
                  className="p-4 rounded-lg bg-background-secondary border border-border/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Text variant="body">{deadline.description}</Text>
                      <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Due: {new Date(deadline.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={deadline.completed ? "ghost" : "outline"}
                        size="sm"
                        onClick={() => {
                          onUpdateDeadline?.(deadline.id, {
                            completed: !deadline.completed
                          });
                        }}
                      >
                        {deadline.completed ? "Completed" : "Mark Complete"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDeadline(deadline);
                          setIsDeadlineModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Event Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        title={selectedEvent ? "Edit Event" : "Add Event"}
      >
        <form onSubmit={handleEventSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Text variant="body-sm" color="secondary">Title</Text>
              <input
                type="text"
                name="title"
                defaultValue={selectedEvent?.title}
                className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
                required
              />
            </div>
            <div>
              <Text variant="body-sm" color="secondary">Date</Text>
              <input
                type="date"
                name="date"
                defaultValue={selectedEvent?.date}
                className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
                required
              />
            </div>
            <div>
              <Text variant="body-sm" color="secondary">Description</Text>
              <textarea
                name="description"
                defaultValue={selectedEvent?.description}
                className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
                rows={3}
              />
            </div>
            <div>
              <Text variant="body-sm" color="secondary">Priority</Text>
              <select
                name="priorityLevel"
                defaultValue={selectedEvent?.priorityLevel || "medium"}
                className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsEventModalOpen(false);
                setSelectedEvent(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {selectedEvent ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deadline Modal */}
      <Modal
        isOpen={isDeadlineModalOpen}
        onClose={() => {
          setIsDeadlineModalOpen(false);
          setSelectedDeadline(null);
        }}
        title={selectedDeadline ? "Edit Deadline" : "Add Deadline"}
      >
        <form onSubmit={handleDeadlineSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Text variant="body-sm" color="secondary">Description</Text>
              <input
                type="text"
                name="description"
                defaultValue={selectedDeadline?.description}
                className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
                required
              />
            </div>
            <div>
              <Text variant="body-sm" color="secondary">Due Date</Text>
              <input
                type="date"
                name="dueDate"
                defaultValue={selectedDeadline?.dueDate}
                className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
                required
              />
            </div>
            {selectedDeadline && (
              <div>
                <Text variant="body-sm" color="secondary">Status</Text>
                <select
                  name="completed"
                  defaultValue={selectedDeadline.completed ? "true" : "false"}
                  className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
                >
                  <option value="false">Pending</option>
                  <option value="true">Completed</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeadlineModalOpen(false);
                setSelectedDeadline(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {selectedDeadline ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
