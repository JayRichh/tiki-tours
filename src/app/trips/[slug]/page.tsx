"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Trip, Activity, KeyEvent, Deadline } from "~/types/trips";
import { tripService } from "~/services/trips";
import { Container } from "~/components/ui/Container";
import { Card } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { Spinner } from "~/components/ui/Spinner";
import { TabGroup } from "~/components/ui/TabGroup";
import { TripOverview } from "~/app/trips/components/detail/TripOverview";
import { TripTimeline } from "~/app/trips/components/detail/TripTimeline";
import { TripBudget } from "~/app/trips/components/detail/TripBudget";
import { TripActivities } from "~/app/trips/components/detail/TripActivities";
import { TripPlanning } from "~/app/trips/components/detail/TripPlanning";
import { TripChecklists } from "~/app/trips/components/detail/TripChecklists";
import { TripReports } from "~/app/trips/components/detail/TripReports";
import { TripDashboard } from "~/app/trips/components/detail/TripDashboard";
import { TripBreadcrumb } from "~/app/trips/components/TripBreadcrumb";

interface TabContentHandlers {
  handleUpdateTrip: (updates: Partial<Trip>) => Promise<void>;
  handleAddActivity: (activity: Omit<Activity, "id">) => Promise<void>;
  handleUpdateActivity: (activityId: string, updates: Partial<Activity>) => Promise<void>;
  handleDeleteActivity: (activityId: string) => Promise<void>;
  handleAddKeyEvent: (event: Omit<KeyEvent, "id">) => Promise<void>;
  handleUpdateKeyEvent: (eventId: string, updates: Partial<KeyEvent>) => Promise<void>;
  handleDeleteKeyEvent: (eventId: string) => Promise<void>;
  handleAddDeadline: (deadline: Omit<Deadline, "id">) => Promise<void>;
  handleUpdateDeadline: (deadlineId: string, updates: Partial<Deadline>) => Promise<void>;
  handleDeleteDeadline: (deadlineId: string) => Promise<void>;
}

const renderTabContent = (
  trip: Trip,
  handlers: TabContentHandlers,
  onTabChange: (tab: string) => void
) => ({
  overview: (
    <div className="w-full flex flex-col flex-1">
      <TripOverview 
        trip={trip} 
        onUpdate={handlers.handleUpdateTrip}
        onTabChange={onTabChange}
      />
    </div>
  ),
  dashboard: (
    <div className="w-full flex flex-col flex-1">
      <TripDashboard trip={trip} />
    </div>
  ),
  timeline: (
    <div className="w-full flex flex-col flex-1">
      <TripTimeline trip={trip} />
    </div>
  ),
  activities: (
    <div className="w-full flex flex-col flex-1">
      <TripActivities
        trip={trip}
        onAddActivity={handlers.handleAddActivity}
        onUpdateActivity={handlers.handleUpdateActivity}
        onDeleteActivity={handlers.handleDeleteActivity}
      />
    </div>
  ),
  planning: (
    <div className="w-full flex flex-col flex-1">
      <TripPlanning
        trip={trip}
        onAddKeyEvent={handlers.handleAddKeyEvent}
        onUpdateKeyEvent={handlers.handleUpdateKeyEvent}
        onDeleteKeyEvent={handlers.handleDeleteKeyEvent}
        onAddDeadline={handlers.handleAddDeadline}
        onUpdateDeadline={handlers.handleUpdateDeadline}
        onDeleteDeadline={handlers.handleDeleteDeadline}
      />
    </div>
  ),
  checklists: (
    <div className="w-full flex flex-col flex-1">
      <TripChecklists
        trip={trip}
        onUpdate={handlers.handleUpdateTrip}
      />
    </div>
  ),
  reports: (
    <div className="w-full flex flex-col flex-1">
      <TripReports trip={trip} />
    </div>
  )
});

const getTabs = (
  trip: Trip,
  content: ReturnType<typeof renderTabContent>
) => [
  { id: "overview", label: "Overview", content: content.overview },
  { id: "dashboard", label: "Dashboard", content: content.dashboard },
  { id: "timeline", label: "Timeline & Budget", content: (
    <div className="space-y-8 w-full flex flex-col flex-1">
      {content.timeline}
      <TripBudget trip={trip} />
    </div>
  ) },
  { id: "activities", label: "Activities", content: content.activities },
  { id: "planning", label: "Planning", content: content.planning },
  { id: "checklists", label: "Checklists", content: content.checklists },
  { id: "reports", label: "Reports", content: content.reports }
];

export default function TripDetailPage() {
  const { slug } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Load trip data
  useEffect(() => {
    const loadTrip = async () => {
      if (typeof slug !== "string") return;
      
      try {
        const tripData = await tripService.getTrip(slug);
        setTrip(tripData);
      } catch (error) {
        console.error("Failed to load trip:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [slug]);

  // Trip Updates
  const handleUpdateTrip = useCallback(async (updates: Partial<Trip>) => {
    if (!trip) return;
    const updatedTrip = await tripService.updateTrip(trip.slug, updates);
    if (updatedTrip) {
      setTrip(updatedTrip);
    }
  }, [trip]);

  // Activities
  const handleAddActivity = useCallback(async (activity: Omit<Activity, "id">) => {
    if (!trip) return;
    const updatedTrip = await tripService.updateTrip(trip.slug, {
      activities: [...(trip.activities || []), { ...activity, id: crypto.randomUUID(), tripId: trip.id }]
    });
    if (updatedTrip) {
      setTrip(updatedTrip);
    }
  }, [trip]);

  const handleUpdateActivity = useCallback(async (activityId: string, updates: Partial<Activity>) => {
    if (!trip) return;
    const updatedActivities = trip.activities.map(activity =>
      activity.id === activityId ? { ...activity, ...updates } : activity
    );
    const updatedTrip = await tripService.updateTrip(trip.slug, { activities: updatedActivities });
    if (updatedTrip) {
      setTrip(updatedTrip);
    }
  }, [trip]);

  const handleDeleteActivity = useCallback(async (activityId: string) => {
    if (!trip) return;
    const updatedTrip = await tripService.updateTrip(trip.slug, {
      activities: trip.activities.filter(activity => activity.id !== activityId)
    });
    if (updatedTrip) {
      setTrip(updatedTrip);
    }
  }, [trip]);

  // Key Events
  const handleAddKeyEvent = useCallback(async (event: Omit<KeyEvent, "id">) => {
    if (!trip) return;
    const updatedTrip = await tripService.addKeyEvent(trip.slug, event);
    if (updatedTrip) {
      setTrip(updatedTrip);
    }
  }, [trip]);

  const handleUpdateKeyEvent = useCallback(async (eventId: string, updates: Partial<KeyEvent>) => {
    if (!trip) return;
    const updatedTrip = await tripService.updateKeyEvent(trip.slug, eventId, updates);
    if (updatedTrip) {
      setTrip(updatedTrip);
    }
  }, [trip]);

  const handleDeleteKeyEvent = useCallback(async (eventId: string) => {
    if (!trip) return;
    const updatedTrip = await tripService.deleteKeyEvent(trip.slug, eventId);
    if (updatedTrip) {
      setTrip(updatedTrip);
    }
  }, [trip]);

  // Deadlines
  const handleAddDeadline = useCallback(async (deadline: Omit<Deadline, "id">) => {
    if (!trip) return;
    const updatedTrip = await tripService.addDeadline(trip.slug, deadline);
    if (updatedTrip) {
      setTrip(updatedTrip);
    }
  }, [trip]);

  const handleUpdateDeadline = useCallback(async (deadlineId: string, updates: Partial<Deadline>) => {
    if (!trip) return;
    const updatedTrip = await tripService.updateDeadline(trip.slug, deadlineId, updates);
    if (updatedTrip) {
      setTrip(updatedTrip);
    }
  }, [trip]);

  const handleDeleteDeadline = useCallback(async (deadlineId: string) => {
    if (!trip) return;
    const updatedTrip = await tripService.deleteDeadline(trip.slug, deadlineId);
    if (updatedTrip) {
      setTrip(updatedTrip);
    }
  }, [trip]);

  if (loading) {
    return (
      <Container size="full" className="pt-20 flex flex-col flex-1">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner size="lg" variant="primary" />
        </div>
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container size="full" className="min-h-screen flex flex-col flex-1">
        <Card>
          <div className="p-6">
            <Text>Trip not found</Text>
          </div>
        </Card>
      </Container>
    );
  }

  const handlers = {
    handleUpdateTrip,
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    handleAddKeyEvent,
    handleUpdateKeyEvent,
    handleDeleteKeyEvent,
    handleAddDeadline,
    handleUpdateDeadline,
    handleDeleteDeadline
  };

  const tabContent = renderTabContent(trip, handlers, setActiveTab);
  const tabs = getTabs(trip, tabContent);

  return (
    <Container size="full" className="pb-8 flex flex-col flex-1">
      <div className="space-y-6 flex flex-col flex-1 max-w-[1400px] mx-auto">
        <TripBreadcrumb trip={trip} />
        <div className="min-h-[600px] w-full flex flex-col flex-1">
          <TabGroup
            tabs={tabs}
            value={activeTab}
            onChange={setActiveTab}
            variant="pills"
            className="h-full"
          />
        </div>
      </div>
    </Container>
  );
}
