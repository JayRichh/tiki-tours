"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Trip, TripFilters, TripStats, Activity, KeyEvent, Deadline } from "~/types/trips";
import { tripService } from "~/services/trips";

export function useTrips(filters?: TripFilters) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load trips on mount
  useEffect(() => {
    const loadTrips = async () => {
      try {
        setIsLoading(true);
        // Ensure we're on the client side
        if (typeof window !== 'undefined') {
          const loadedTrips = await tripService.getTrips();
          console.log('Loaded trips:', loadedTrips); // Debug log
          setTrips(loadedTrips);
        }
      } catch (error) {
        console.error('Error loading trips:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrips();
  }, []); // Only run on mount

  // Handle filtering in memory
  const filteredTrips = useMemo(() => {
    if (!filters) return trips;
    return trips.filter((trip: Trip) => {
      if (filters.status && trip.status !== filters.status) return false;
      if (filters.startDate && trip.startDate < filters.startDate) return false;
      if (filters.endDate && trip.endDate > filters.endDate) return false;
      if (filters.destination && !trip.destination.toLowerCase().includes(filters.destination.toLowerCase())) return false;
      if (filters.minBudget && trip.tripBudget < filters.minBudget) return false;
      if (filters.maxBudget && trip.tripBudget > filters.maxBudget) return false;
      if (filters.holidayPreferences?.length && !filters.holidayPreferences.some(pref => trip.holidayPreferences?.includes(pref))) return false;
      return true;
    });
  }, [trips, filters]);

  const stats = useMemo<TripStats>(() => {
    const totalBudget = trips.reduce((sum: number, trip: Trip) => sum + (trip.tripBudget || 0), 0);
    const totalSpent = trips.reduce(
      (sum: number, trip: Trip) => sum + (trip.spentSoFar || 0),
      0
    );

    const now = new Date().toISOString();
    const upcomingTrips = trips.filter(
      (trip: Trip) => trip.startDate > now && !['completed', 'cancelled'].includes(trip.status)
    ).length;

    const inProgressTrips = trips.filter(
      (trip: Trip) => trip.status === 'in_progress'
    ).length;

    const completedTrips = trips.filter(
      (trip: Trip) => trip.status === 'completed'
    ).length;

    const relocatingTrips = trips.filter(
      (trip: Trip) => trip.status === 'relocating'
    ).length;

    return {
      totalBudget,
      totalSpent,
      remainingBudget: totalBudget - totalSpent,
      tripCount: trips.length,
      upcomingTrips,
      inProgressTrips,
      completedTrips,
      relocatingTrips
    };
  }, [trips]);

  const createTrip = useCallback(async (trip: Omit<Trip, "id" | "slug">) => {
    const newTrip = await tripService.createTrip(trip);
    setTrips((prev: Trip[]) => [...prev, newTrip]);
    return newTrip;
  }, []);

  const updateTrip = useCallback(async (idOrSlug: string, updates: Partial<Trip>) => {
    const updatedTrip = await tripService.updateTrip(idOrSlug, updates);
    if (!updatedTrip) return null;
    setTrips((prev: Trip[]) => prev.map((trip: Trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)));
    return updatedTrip;
  }, []);

  const deleteTrip = useCallback(async (idOrSlug: string) => {
    const success = await tripService.deleteTrip(idOrSlug);
    if (success) {
      const trip = trips.find(t => t.id === idOrSlug || t.slug === idOrSlug);
      if (trip) {
        setTrips((prev: Trip[]) => prev.filter((t: Trip) => t.id !== trip.id));
      }
    }
    return success;
  }, [trips]);

  // Key Events
  const addKeyEvent = useCallback(async (tripId: string, event: Omit<KeyEvent, "id">) => {
    const updatedTrip = await tripService.addKeyEvent(tripId, event);
    if (updatedTrip) {
      setTrips((prev: Trip[]) => prev.map((trip: Trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)));
    }
    return updatedTrip;
  }, []);

  const updateKeyEvent = useCallback(async (tripId: string, eventId: string, updates: Partial<KeyEvent>) => {
    const updatedTrip = await tripService.updateKeyEvent(tripId, eventId, updates);
    if (updatedTrip) {
      setTrips((prev: Trip[]) => prev.map((trip: Trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)));
    }
    return updatedTrip;
  }, []);

  const deleteKeyEvent = useCallback(async (tripId: string, eventId: string) => {
    const updatedTrip = await tripService.deleteKeyEvent(tripId, eventId);
    if (updatedTrip) {
      setTrips((prev: Trip[]) => prev.map((trip: Trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)));
    }
    return updatedTrip;
  }, []);

  // Deadlines
  const addDeadline = useCallback(async (tripId: string, deadline: Omit<Deadline, "id">) => {
    const updatedTrip = await tripService.addDeadline(tripId, deadline);
    if (updatedTrip) {
      setTrips((prev: Trip[]) => prev.map((trip: Trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)));
    }
    return updatedTrip;
  }, []);

  const updateDeadline = useCallback(async (tripId: string, deadlineId: string, updates: Partial<Deadline>) => {
    const updatedTrip = await tripService.updateDeadline(tripId, deadlineId, updates);
    if (updatedTrip) {
      setTrips((prev: Trip[]) => prev.map((trip: Trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)));
    }
    return updatedTrip;
  }, []);

  const deleteDeadline = useCallback(async (tripId: string, deadlineId: string) => {
    const updatedTrip = await tripService.deleteDeadline(tripId, deadlineId);
    if (updatedTrip) {
      setTrips((prev: Trip[]) => prev.map((trip: Trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)));
    }
    return updatedTrip;
  }, []);

  return {
    trips: filteredTrips,
    isLoading,
    stats,
    createTrip,
    updateTrip,
    deleteTrip,
    // Key Events
    addKeyEvent,
    updateKeyEvent,
    deleteKeyEvent,
    // Deadlines
    addDeadline,
    updateDeadline,
    deleteDeadline,
  };
}
