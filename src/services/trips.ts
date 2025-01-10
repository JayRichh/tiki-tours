// TripService.ts
import { generateUniqueSlug, slugify } from "~/utils/slugify";

import { Deadline, KeyEvent, Trip, TripFilters } from "~/types/trips";

class TripService {
  private static instance: TripService;

  private constructor() {
    // Initialize with detailed dummy relocation data if no trips exist
    const trips = this.getTripsFromStorage();
    if (trips.length === 0) {
      console.log("No trips found, initializing with test data");
      const londonToVancouverRelocation: Trip = {
        id: crypto.randomUUID(),
        slug: "london-to-vancouver-relocation",
        destination: "Vancouver, Canada",
        startDate: "2025-03-01",
        endDate: "2026-02-28",
        status: "relocating",
        tripBudget: 6000,
        activities: [
          {
            id: crypto.randomUUID(),
            activityName: "House Viewing",
            activityCost: 50,
            date: "2025-03-02",
            location: "Kitsilano, Vancouver",
            duration: 2,
            type: "other",
            bookingStatus: "planned",
          },
          {
            id: crypto.randomUUID(),
            activityName: "Welcome Dinner",
            activityCost: 100,
            date: "2025-03-02",
            location: "Gastown, Vancouver",
            duration: 3,
            type: "food",
            bookingStatus: "planned",
          },
          {
            id: crypto.randomUUID(),
            activityName: "Stanley Park Tour",
            activityCost: 75,
            date: "2025-03-03",
            location: "Stanley Park, Vancouver",
            duration: 4,
            type: "sightseeing",
            bookingStatus: "planned",
          },
          {
            id: crypto.randomUUID(),
            activityName: "Grouse Mountain Hike",
            activityCost: 120,
            date: "2025-03-04",
            location: "North Vancouver",
            duration: 6,
            type: "adventure",
            bookingStatus: "planned",
          },
          {
            id: crypto.randomUUID(),
            activityName: "Spa Day",
            activityCost: 200,
            date: "2025-03-05",
            location: "Downtown Vancouver",
            duration: 4,
            type: "relaxation",
            bookingStatus: "planned",
          },
        ],
        spentSoFar: 545,
        flexibleDates: true,
        relocationPlan: true,
        travelMode: "flight",
        currency: "GBP",
        tripPriority: "high",
        tripDetails: "Relocating from London (UK) to Vancouver (Canada) for a new job opportunity.",
        keyEvents: [
          {
            id: crypto.randomUUID(),
            title: "Meet with Immigration Consultant",
            date: "2024-08-01",
            description: "Discuss visa requirements and timelines.",
            priorityLevel: "high",
          },
          {
            id: crypto.randomUUID(),
            title: "Book Flight",
            date: "2025-01-10",
            description: "Book one-way flight from London to Vancouver (~£600-800).",
            priorityLevel: "high",
          },
          {
            id: crypto.randomUUID(),
            title: "Arrange Temporary Housing",
            date: "2025-02-15",
            description: "Set up short-term rental in Vancouver for the first month.",
            priorityLevel: "medium",
          },
        ],
        deadlines: [
          {
            id: crypto.randomUUID(),
            description: "Finalize job contract",
            dueDate: "2024-11-01",
            completed: false,
          },
          {
            id: crypto.randomUUID(),
            description: "Obtain Canadian visa",
            dueDate: "2025-01-01",
            completed: false,
          },
          {
            id: crypto.randomUUID(),
            description: "Book one-way flight",
            dueDate: "2025-01-15",
            completed: false,
          },
          {
            id: crypto.randomUUID(),
            description: "Arrange shipping service",
            dueDate: "2025-02-01",
            completed: false,
          },
        ],
        checklists: [
          {
            id: crypto.randomUUID(),
            title: "Pre-Departure Tasks",
            category: "preparation",
            items: [
              {
                id: crypto.randomUUID(),
                title: "Cancel UK utility contracts",
                completed: false,
                priority: "high",
              },
              {
                id: crypto.randomUUID(),
                title: "Notify landlord or sell property",
                completed: false,
                priority: "high",
              },
              {
                id: crypto.randomUUID(),
                title: "Organize farewell gatherings",
                completed: false,
                priority: "low",
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            title: "Budget Tracking",
            category: "finance",
            items: [
              {
                id: crypto.randomUUID(),
                title: "Flight (~£600-800)",
                completed: false,
                priority: "high",
              },
              {
                id: crypto.randomUUID(),
                title: "Shipping costs (~£500-800)",
                completed: false,
                priority: "high",
              },
              {
                id: crypto.randomUUID(),
                title: "Initial living costs (~£1000-1500)",
                completed: false,
                priority: "medium",
              },
              {
                id: crypto.randomUUID(),
                title: "Rental setup (~£1200-1500)",
                completed: false,
                priority: "high",
              },
              {
                id: crypto.randomUUID(),
                title: "Misc relocation expenses (~£400-600)",
                completed: false,
                priority: "medium",
              },
            ],
          },
        ],
        notes: [
          "Target arrival in Vancouver around late February 2025.",
          "Plan to stay in a short-term rental for the first month.",
          "Discuss bridging loan options with the bank if needed.",
          "Total budget needed: ~£6000 (with a contingency buffer).",
        ],
        lastUpdated: new Date().toISOString(),
      };
      this.saveTripsToStorage([londonToVancouverRelocation]);
    }
    this.migrateTrips();
  }

  static getInstance(): TripService {
    if (!TripService.instance) {
      TripService.instance = new TripService();
    }
    return TripService.instance;
  }

  private migrateTrips(): void {
    const trips = this.getTripsFromStorage();
    let needsMigration = false;

    const migratedTrips = trips.map((trip) => {
      if (!trip.slug) {
        needsMigration = true;
        const baseSlug = slugify(trip.destination);
        const existingSlugs = trips.map((t) => t.slug).filter(Boolean);
        const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
        return { ...trip, slug: uniqueSlug };
      }
      return trip;
    });

    if (needsMigration) {
      this.saveTripsToStorage(migratedTrips);
    }
  }

  async getTrips(filters?: TripFilters): Promise<Trip[]> {
    try {
      let trips = this.getTripsFromStorage();
      console.log("Retrieved trips from storage:", trips); // Debug log

      if (filters) {
        trips = trips.filter((trip) => {
          if (filters.status && trip.status !== filters.status) return false;
          if (filters.startDate && trip.startDate < filters.startDate) return false;
          if (filters.endDate && trip.endDate > filters.endDate) return false;
          if (
            filters.destination &&
            !trip.destination.toLowerCase().includes(filters.destination.toLowerCase())
          )
            return false;
          if (filters.minBudget && trip.tripBudget < filters.minBudget) return false;
          if (filters.maxBudget && trip.tripBudget > filters.maxBudget) return false;
          if (
            filters.holidayPreferences?.length &&
            !filters.holidayPreferences.some((pref) => trip.holidayPreferences?.includes(pref))
          ) {
            return false;
          }
          return true;
        });
      }

      return trips;
    } catch (error) {
      console.error("Error getting trips:", error);
      return [];
    }
  }

  async getTrip(idOrSlug: string): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      return trips.find((trip) => trip.id === idOrSlug || trip.slug === idOrSlug) || null;
    } catch (error) {
      console.error("Error getting trip:", error);
      return null;
    }
  }

  async createTrip(trip: Omit<Trip, "id" | "slug">): Promise<Trip> {
    try {
      const trips = this.getTripsFromStorage();
      const baseSlug = slugify(trip.destination);
      const existingSlugs = trips.map((t) => t.slug);
      const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

      const newTrip: Trip = {
        ...trip,
        id: crypto.randomUUID(),
        slug: uniqueSlug,
        activities: trip.activities || [],
        keyEvents: trip.keyEvents || [],
        deadlines: trip.deadlines || [],
        notes: trip.notes || [],
        spentSoFar: 0,
        status: trip.status || "draft",
        holidayPreferences: trip.holidayPreferences || [],
        lastUpdated: new Date().toISOString(),
      };
      trips.push(newTrip);
      this.saveTripsToStorage(trips);
      return newTrip;
    } catch (error) {
      console.error("Error creating trip:", error);
      throw error;
    }
  }

  async updateTrip(idOrSlug: string, updates: Partial<Trip>): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const index = trips.findIndex((trip) => trip.id === idOrSlug || trip.slug === idOrSlug);
      if (index === -1) return null;

      // If destination is being updated, generate new slug
      let updatedSlug = trips[index].slug;
      if (updates.destination) {
        const baseSlug = slugify(updates.destination);
        const existingSlugs = trips.map((t) => t.slug).filter((s) => s !== trips[index].slug);
        updatedSlug = generateUniqueSlug(baseSlug, existingSlugs);
      }

      const updatedTrip = {
        ...trips[index],
        ...updates,
        slug: updatedSlug,
        lastUpdated: new Date().toISOString(),
      };
      trips[index] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error("Error updating trip:", error);
      return null;
    }
  }

  async deleteTrip(idOrSlug: string): Promise<boolean> {
    try {
      const trips = this.getTripsFromStorage();
      const index = trips.findIndex((trip) => trip.id === idOrSlug || trip.slug === idOrSlug);
      if (index === -1) return false;

      trips.splice(index, 1);
      this.saveTripsToStorage(trips);
      return true;
    } catch (error) {
      console.error("Error deleting trip:", error);
      return false;
    }
  }

  // Key Events
  async addKeyEvent(tripId: string, event: Omit<KeyEvent, "id">): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const index = trips.findIndex((trip) => trip.id === tripId || trip.slug === tripId);
      if (index === -1) return null;

      const newEvent = {
        ...event,
        id: crypto.randomUUID(),
      };

      const updatedTrip = {
        ...trips[index],
        keyEvents: [...(trips[index].keyEvents || []), newEvent],
        lastUpdated: new Date().toISOString(),
      };
      trips[index] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error("Error adding key event:", error);
      return null;
    }
  }

  async updateKeyEvent(
    tripId: string,
    eventId: string,
    updates: Partial<KeyEvent>
  ): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const tripIndex = trips.findIndex((trip) => trip.id === tripId || trip.slug === tripId);
      if (tripIndex === -1) return null;

      const eventIndex = trips[tripIndex].keyEvents?.findIndex((event) => event.id === eventId);
      if (eventIndex === undefined || eventIndex === -1) return null;

      const updatedEvents = [...(trips[tripIndex].keyEvents || [])];
      updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], ...updates };

      const updatedTrip = {
        ...trips[tripIndex],
        keyEvents: updatedEvents,
        lastUpdated: new Date().toISOString(),
      };
      trips[tripIndex] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error("Error updating key event:", error);
      return null;
    }
  }

  async deleteKeyEvent(tripId: string, eventId: string): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const tripIndex = trips.findIndex((trip) => trip.id === tripId || trip.slug === tripId);
      if (tripIndex === -1) return null;

      const updatedTrip = {
        ...trips[tripIndex],
        keyEvents: trips[tripIndex].keyEvents?.filter((event) => event.id !== eventId) || [],
        lastUpdated: new Date().toISOString(),
      };
      trips[tripIndex] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error("Error deleting key event:", error);
      return null;
    }
  }

  // Deadlines
  async addDeadline(tripId: string, deadline: Omit<Deadline, "id">): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const index = trips.findIndex((trip) => trip.id === tripId || trip.slug === tripId);
      if (index === -1) return null;

      const newDeadline = {
        ...deadline,
        id: crypto.randomUUID(),
      };

      const updatedTrip = {
        ...trips[index],
        deadlines: [...(trips[index].deadlines || []), newDeadline],
        lastUpdated: new Date().toISOString(),
      };
      trips[index] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error("Error adding deadline:", error);
      return null;
    }
  }

  async updateDeadline(
    tripId: string,
    deadlineId: string,
    updates: Partial<Deadline>
  ): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const tripIndex = trips.findIndex((trip) => trip.id === tripId || trip.slug === tripId);
      if (tripIndex === -1) return null;

      const deadlineIndex = trips[tripIndex].deadlines?.findIndex(
        (deadline) => deadline.id === deadlineId
      );
      if (deadlineIndex === undefined || deadlineIndex === -1) return null;

      const updatedDeadlines = [...(trips[tripIndex].deadlines || [])];
      updatedDeadlines[deadlineIndex] = { ...updatedDeadlines[deadlineIndex], ...updates };

      const updatedTrip = {
        ...trips[tripIndex],
        deadlines: updatedDeadlines,
        lastUpdated: new Date().toISOString(),
      };
      trips[tripIndex] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error("Error updating deadline:", error);
      return null;
    }
  }

  async deleteDeadline(tripId: string, deadlineId: string): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const tripIndex = trips.findIndex((trip) => trip.id === tripId || trip.slug === tripId);
      if (tripIndex === -1) return null;

      const updatedTrip = {
        ...trips[tripIndex],
        deadlines:
          trips[tripIndex].deadlines?.filter((deadline) => deadline.id !== deadlineId) || [],
        lastUpdated: new Date().toISOString(),
      };
      trips[tripIndex] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error("Error deleting deadline:", error);
      return null;
    }
  }

  private getTripsFromStorage(): Trip[] {
    if (typeof window === "undefined") return [];
    try {
      const tripsJson = localStorage.getItem("trips");
      console.log("Raw trips from storage:", tripsJson); // Debug log
      return tripsJson ? JSON.parse(tripsJson) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  }

  private saveTripsToStorage(trips: Trip[]): void {
    if (typeof window === "undefined") return;
    try {
      console.log("Saving trips to storage:", trips); // Debug log
      localStorage.setItem("trips", JSON.stringify(trips));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }
}

export const tripService = TripService.getInstance();
