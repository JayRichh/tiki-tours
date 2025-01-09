"use client";

import { useCallback, useEffect, useState } from "react";
import { useTrips } from "~/hooks/useTrips";
import { Trip, TripStatus } from "~/types/trips";
import { Container } from "~/components/ui/Container";
import { Modal } from "~/components/ui/Modal";
import { TripStats } from "./components/TripStats";
import { TripFilters } from "./components/TripFilters";
import { TripCard } from "./components/TripCard";
import { TripForm } from "./components/TripForm";
import { DeleteTripModal } from "./components/DeleteTripModal";
import { Spinner } from "~/components/ui/Spinner";

export default function TripsPage() {
  const [filters, setFilters] = useState<{ status?: TripStatus }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { trips, stats, isLoading, createTrip, updateTrip, deleteTrip } = useTrips(filters);

  useEffect(() => {
    console.log('Trips page state:', { isLoading, tripsCount: trips.length, filters });
  }, [isLoading, trips, filters]);

  const handleCreateTrip = useCallback(async (formData: FormData) => {
    const newTrip: Omit<Trip, "id" | "slug"> = {
      destination: formData.get("destination") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      tripBudget: formData.get("tripBudget") ? Number(formData.get("tripBudget")) : 0,
      status: "draft",
      activities: [],
      tripDetails: formData.get("tripDetails") as string || undefined,
      flexibleDates: formData.get("flexibleDates") === "true",
      numberOfTravelers: Number(formData.get("numberOfTravelers")) || undefined,
      travelMode: formData.get("travelMode") as string || undefined
    };

    await createTrip(newTrip);
    setIsCreateModalOpen(false);
  }, [createTrip]);

  const handleUpdateTrip = useCallback(async (formData: FormData) => {
    if (!selectedTrip) return;

    const updates: Partial<Trip> = {
      destination: formData.get("destination") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      tripBudget: Number(formData.get("tripBudget")),
      status: formData.get("status") as TripStatus,
      tripDetails: formData.get("tripDetails") as string || undefined,
      flexibleDates: formData.get("flexibleDates") === "true",
      numberOfTravelers: Number(formData.get("numberOfTravelers")) || undefined,
      travelMode: formData.get("travelMode") as string || undefined
    };

    await updateTrip(selectedTrip.slug, updates);
    setSelectedTrip(null);
  }, [selectedTrip, updateTrip]);

  const handleDeleteTrip = useCallback(async () => {
    if (!selectedTrip) return;
    await deleteTrip(selectedTrip.slug);
    setIsDeleteModalOpen(false);
    setSelectedTrip(null);
  }, [selectedTrip, deleteTrip]);

  if (isLoading) {
    return (
      <Container className="pt-20">
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="w-full min-h-screen">
      <TripStats stats={stats} />
      
      <TripFilters
        status={filters.status}
        onStatusChange={(status) => setFilters({ status })}
        onCreateNew={() => setIsCreateModalOpen(true)}
      />

      <div className="space-y-6">
        {trips.length === 0 ? (
          <div className="text-center py-8 text-foreground-secondary">
            No trips found. Create your first trip to get started!
          </div>
        ) : (
          trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onEdit={setSelectedTrip}
              onDelete={(trip) => {
                setSelectedTrip(trip);
                setIsDeleteModalOpen(true);
              }}
            />
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || !!selectedTrip}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedTrip(null);
        }}
        title={selectedTrip ? "Edit Trip" : "New Trip"}
      >
        <TripForm
          trip={selectedTrip}
          onSubmit={selectedTrip ? handleUpdateTrip : handleCreateTrip}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setSelectedTrip(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteTripModal
        trip={selectedTrip}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTrip(null);
        }}
        onConfirm={handleDeleteTrip}
      />
    </Container>
  );
}
