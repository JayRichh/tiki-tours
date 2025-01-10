"use client";

import {
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  Edit2,
  FileText,
  Globe,
  List,
  MapPin,
  Plus,
  Users,
} from "lucide-react";

import { useState } from "react";

import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Modal } from "~/components/ui/Modal";
import { Progress } from "~/components/ui/Progress";
import { Text } from "~/components/ui/Text";

import { Trip } from "~/types/trips";

import { statusColors } from "../../constants";

interface TripOverviewProps {
  trip: Trip;
  onUpdate: (updates: Partial<Trip>) => void;
  onTabChange?: (tab: string) => void;
}

export function TripOverview({ trip, onUpdate, onTabChange }: TripOverviewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updates: Partial<Trip> = {
      destination: formData.get("destination") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      tripBudget: Number(formData.get("tripBudget")),
      tripDetails: (formData.get("tripDetails") as string) || undefined,
      numberOfTravelers: Number(formData.get("numberOfTravelers")) || undefined,
      travelMode: (formData.get("travelMode") as string) || undefined,
      flexibleDates: formData.get("flexibleDates") === "true",
      relocationPlan: formData.get("relocationPlan") === "true",
      holidayPreferences: formData.get("holidayPreferences")?.toString().split(",").filter(Boolean),
    };

    onUpdate(updates);
    setIsEditModalOpen(false);
  };
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card>
      <CardHeader
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Text variant="h2" gradient="primary" balance>
                {trip.destination}
              </Text>
              <div className="flex items-center gap-2">
                <Badge variant="solid" color="primary" className="text-sm capitalize">
                  {trip.status}
                </Badge>
                {trip.relocationPlan && (
                  <Badge variant="solid" color="info" className="text-sm">
                    Relocation
                  </Badge>
                )}
                {trip.flexibleDates && (
                  <Badge variant="solid" color="success" className="text-sm">
                    Flexible Dates
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              leftIcon={<Edit2 className="h-4 w-4" />}
              onClick={() => setIsEditModalOpen(true)}
            />
          </div>
        }
      />
      <CardContent className="space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-3 h-auto py-6 hover:bg-primary/5 transition-colors duration-300"
            onClick={() => {
              window.location.hash = "activities/activity/new";
              onTabChange?.("activities");
            }}
          >
            <Plus className="h-5 w-5" />
            <Text variant="body-sm">Add Activity</Text>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => {
              const today = new Date().toISOString().split("T")[0];
              window.location.hash = `activities/activity/new/today=${today}`;
              onTabChange?.("activities");
            }}
          >
            <Clock className="h-5 w-5" />
            <Text variant="body-sm">Today&apos;s Activity</Text>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => {
              const today = new Date().toISOString().split("T")[0];
              window.location.hash = `planning/event/new/today=${today}`;
              onTabChange?.("planning");
            }}
          >
            <Calendar className="h-5 w-5" />
            <Text variant="body-sm">Today&apos;s Event</Text>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => {
              window.location.hash = "checklists/checklist/new";
              onTabChange?.("checklists");
            }}
          >
            <List className="h-5 w-5" />
            <Text variant="body-sm">New Checklist</Text>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => {
              window.location.hash = "planning/deadline/new";
              onTabChange?.("planning");
            }}
          >
            <AlertCircle className="h-5 w-5" />
            <Text variant="body-sm">Set Deadline</Text>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => {
              const nextWeek = new Date();
              nextWeek.setDate(nextWeek.getDate() + 7);
              window.location.hash = `planning/deadline/new/date=${nextWeek.toISOString().split("T")[0]}`;
              onTabChange?.("planning");
            }}
          >
            <Clock className="h-5 w-5" />
            <Text variant="body-sm">Upcoming Deadline</Text>
          </Button>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6 bg-background/50 rounded-lg border border-border/50">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <Text variant="body-sm" color="secondary" className="mb-1">
                Duration
              </Text>
              <Text variant="body-lg" weight="medium">
                {duration} days
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <Text variant="body-sm" color="secondary" className="mb-1">
                Dates
              </Text>
              <Text variant="body-lg" weight="medium">
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <Text variant="body-sm" color="secondary" className="mb-1">
                Budget
              </Text>
              <Text variant="body-lg" weight="medium">
                ${trip.tripBudget.toLocaleString()}
                {trip.spentSoFar && (
                  <span className="text-foreground-secondary">
                    {" "}
                    (${trip.spentSoFar.toLocaleString()} spent)
                  </span>
                )}
              </Text>
            </div>
          </div>

          {trip.numberOfTravelers && (
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <Text variant="body-sm" color="secondary" className="mb-1">
                  Travelers
                </Text>
                <Text variant="body-lg" weight="medium">
                  {trip.numberOfTravelers} people
                </Text>
              </div>
            </div>
          )}

          {trip.travelMode && (
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <Text variant="body-sm" color="secondary" className="mb-1">
                  Travel Mode
                </Text>
                <Text variant="body-lg" weight="medium">
                  {trip.travelMode}
                </Text>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trip Details */}
          <Card className="bg-background/50">
            <CardHeader
              title={
                <Text variant="h4" gradient="primary">
                  Trip Details
                </Text>
              }
            />
            <CardContent>
              <Text variant="body-lg" color="secondary">
                {trip.tripDetails || "No details provided"}
              </Text>
              {trip.holidayPreferences && trip.holidayPreferences.length > 0 && (
                <div className="mt-4">
                  <Text variant="body-sm" color="secondary" className="mb-2">
                    Preferences
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {trip.holidayPreferences.map((pref) => (
                      <Badge key={pref} variant="secondary">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="bg-background/50">
            <CardHeader
              title={
                <Text variant="h4" gradient="primary">
                  Progress
                </Text>
              }
            />
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Text variant="body" color="secondary">
                    Budget Used
                  </Text>
                  <Text variant="body" weight="medium">
                    {Math.round(((trip.spentSoFar || 0) / trip.tripBudget) * 100)}%
                  </Text>
                </div>
                <Progress value={((trip.spentSoFar || 0) / trip.tripBudget) * 100} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Text variant="body" color="secondary">
                    Time Until Trip
                  </Text>
                  <Text variant="body" weight="medium">
                    {Math.ceil(
                      (new Date(trip.startDate).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </Text>
                </div>
                <Progress
                  value={Math.min(
                    100,
                    ((new Date().getTime() - new Date(trip.startDate).getTime()) /
                      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime())) *
                      100
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Trip Details"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Text variant="body-sm" color="secondary">
                Destination
              </Text>
              <input
                type="text"
                name="destination"
                defaultValue={trip.destination}
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
                  defaultValue={trip.startDate}
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
                  defaultValue={trip.endDate}
                  className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
                  required
                />
              </div>
            </div>

            <div>
              <Text variant="body-sm" color="secondary">
                Budget
              </Text>
              <input
                type="number"
                name="tripBudget"
                defaultValue={trip.tripBudget}
                className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
                required
              />
            </div>

            <div>
              <Text variant="body-sm" color="secondary">
                Details
              </Text>
              <textarea
                name="tripDetails"
                defaultValue={trip.tripDetails}
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
                  defaultValue={trip.numberOfTravelers}
                  className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
                />
              </div>
              <div>
                <Text variant="body-sm" color="secondary">
                  Travel Mode
                </Text>
                <input
                  type="text"
                  name="travelMode"
                  defaultValue={trip.travelMode}
                  className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="flexibleDates"
                    defaultChecked={trip.flexibleDates}
                    value="true"
                  />
                  <Text variant="body-sm" color="secondary">
                    Flexible Dates
                  </Text>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="relocationPlan"
                    defaultChecked={trip.relocationPlan}
                    value="true"
                  />
                  <Text variant="body-sm" color="secondary">
                    Relocation Plan
                  </Text>
                </label>
              </div>
            </div>

            <div>
              <Text variant="body-sm" color="secondary">
                Holiday Preferences (comma-separated)
              </Text>
              <input
                type="text"
                name="holidayPreferences"
                defaultValue={trip.holidayPreferences?.join(", ")}
                className="w-full px-4 py-2 rounded-lg border-2 border-border/50 bg-background/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
