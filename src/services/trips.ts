import { Trip, TripFilters, KeyEvent, Deadline } from "~/types/trips";
import { slugify, generateUniqueSlug } from "~/utils/slugify";

class TripService {
  private static instance: TripService;

  private constructor() {
    // Initialize with some test data if no trips exist
    const trips = this.getTripsFromStorage();
    if (trips.length === 0) {
      console.log('No trips found, initializing with test data');
      const nzRelocationTrip: Trip = {
        id: crypto.randomUUID(),
        slug: 'newcastle-to-auckland-relocation',
        destination: 'Auckland, New Zealand',
        startDate: '2024-09-01',
        endDate: '2024-10-31',
        status: 'relocating',
        tripBudget: 4750,
        activities: [],
        spentSoFar: 0,
        flexibleDates: true,
        relocationPlan: true,
        travelMode: 'flight',
        currency: 'GBP',
        tripPriority: 'high',
        tripDetails: 'Relocation from Newcastle (UK) to Auckland (NZ)',
        keyEvents: [
          {
            id: crypto.randomUUID(),
            title: 'Book Flight',
            date: '2024-06-01',
            description: 'Book Emirates flight NCL to AKL (£700-1000)',
            priorityLevel: 'high'
          },
          {
            id: crypto.randomUUID(),
            title: 'Arrange Shipping',
            date: '2024-06-15',
            description: 'Organize shipping of essential items (£600-1000)',
            priorityLevel: 'high'
          }
        ],
        deadlines: [
          {
            id: crypto.randomUUID(),
            description: 'Confirm exact travel dates',
            dueDate: '2024-05-01',
            completed: false
          },
          {
            id: crypto.randomUUID(),
            description: 'Book Emirates flight',
            dueDate: '2024-06-01',
            completed: false
          },
          {
            id: crypto.randomUUID(),
            description: 'Arrange shipping service',
            dueDate: '2024-06-15',
            completed: false
          }
        ],
        checklists: [
          {
            id: crypto.randomUUID(),
            title: 'Pre-Departure Tasks',
            category: 'preparation',
            items: [
              {
                id: crypto.randomUUID(),
                title: 'Sort UK house/tenancy',
                completed: false,
                priority: 'high'
              },
              {
                id: crypto.randomUUID(),
                title: 'Pack essential items for shipping',
                completed: false,
                priority: 'high'
              },
              {
                id: crypto.randomUUID(),
                title: 'Research job opportunities in Auckland',
                completed: false,
                priority: 'high'
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            title: 'Budget Tracking',
            category: 'finance',
            items: [
              {
                id: crypto.randomUUID(),
                title: 'Flight booking (£700-1000)',
                completed: false,
                priority: 'high'
              },
              {
                id: crypto.randomUUID(),
                title: 'Shipping costs (£600-1000)',
                completed: false,
                priority: 'high'
              },
              {
                id: crypto.randomUUID(),
                title: 'Initial living costs (£600-750)',
                completed: false,
                priority: 'medium'
              },
              {
                id: crypto.randomUUID(),
                title: 'Rental setup (£1200-1500)',
                completed: false,
                priority: 'high'
              },
              {
                id: crypto.randomUUID(),
                title: 'Miscellaneous setup (£350-500)',
                completed: false,
                priority: 'medium'
              }
            ]
          }
        ],
        notes: [
          'Stay with family initially while job hunting',
          'Monthly savings target: £310 from Feb to Aug',
          'Total budget needed: ~£4750',
          'Shipping: Consider PSS International, Seven Seas Worldwide, or Anglo Pacific'
        ],
        lastUpdated: new Date().toISOString()
      };
      this.saveTripsToStorage([nzRelocationTrip]);
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

    const migratedTrips = trips.map(trip => {
      if (!trip.slug) {
        needsMigration = true;
        const baseSlug = slugify(trip.destination);
        const existingSlugs = trips.map(t => t.slug).filter(Boolean);
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
      console.log('Retrieved trips from storage:', trips); // Debug log

      if (filters) {
        trips = trips.filter(trip => {
          if (filters.status && trip.status !== filters.status) return false;
          if (filters.startDate && trip.startDate < filters.startDate) return false;
          if (filters.endDate && trip.endDate > filters.endDate) return false;
          if (filters.destination && !trip.destination.toLowerCase().includes(filters.destination.toLowerCase())) return false;
          if (filters.minBudget && trip.tripBudget < filters.minBudget) return false;
          if (filters.maxBudget && trip.tripBudget > filters.maxBudget) return false;
          if (filters.holidayPreferences?.length && !filters.holidayPreferences.some(pref => trip.holidayPreferences?.includes(pref))) return false;
          return true;
        });
      }

      return trips;
    } catch (error) {
      console.error('Error getting trips:', error);
      return [];
    }
  }

  async getTrip(idOrSlug: string): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      return trips.find(trip => trip.id === idOrSlug || trip.slug === idOrSlug) || null;
    } catch (error) {
      console.error('Error getting trip:', error);
      return null;
    }
  }

  async createTrip(trip: Omit<Trip, 'id' | 'slug'>): Promise<Trip> {
    try {
      const trips = this.getTripsFromStorage();
      const baseSlug = slugify(trip.destination);
      const existingSlugs = trips.map(t => t.slug);
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
        status: trip.status || 'draft',
        holidayPreferences: trip.holidayPreferences || [],
        lastUpdated: new Date().toISOString()
      };
      trips.push(newTrip);
      this.saveTripsToStorage(trips);
      return newTrip;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  }

  async updateTrip(idOrSlug: string, updates: Partial<Trip>): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const index = trips.findIndex(trip => trip.id === idOrSlug || trip.slug === idOrSlug);
      if (index === -1) return null;

      // If destination is being updated, generate new slug
      let updatedSlug = trips[index].slug;
      if (updates.destination) {
        const baseSlug = slugify(updates.destination);
        const existingSlugs = trips.map(t => t.slug).filter(s => s !== trips[index].slug);
        updatedSlug = generateUniqueSlug(baseSlug, existingSlugs);
      }

      const updatedTrip = {
        ...trips[index],
        ...updates,
        slug: updatedSlug,
        lastUpdated: new Date().toISOString()
      };
      trips[index] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error('Error updating trip:', error);
      return null;
    }
  }

  async deleteTrip(idOrSlug: string): Promise<boolean> {
    try {
      const trips = this.getTripsFromStorage();
      const index = trips.findIndex(trip => trip.id === idOrSlug || trip.slug === idOrSlug);
      if (index === -1) return false;

      trips.splice(index, 1);
      this.saveTripsToStorage(trips);
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      return false;
    }
  }

  // Key Events
  async addKeyEvent(tripId: string, event: Omit<KeyEvent, "id">): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const index = trips.findIndex(trip => trip.id === tripId || trip.slug === tripId);
      if (index === -1) return null;

      const newEvent = {
        ...event,
        id: crypto.randomUUID()
      };

      const updatedTrip = {
        ...trips[index],
        keyEvents: [...(trips[index].keyEvents || []), newEvent],
        lastUpdated: new Date().toISOString()
      };
      trips[index] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error('Error adding key event:', error);
      return null;
    }
  }

  async updateKeyEvent(tripId: string, eventId: string, updates: Partial<KeyEvent>): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const tripIndex = trips.findIndex(trip => trip.id === tripId || trip.slug === tripId);
      if (tripIndex === -1) return null;

      const eventIndex = trips[tripIndex].keyEvents?.findIndex(event => event.id === eventId);
      if (eventIndex === undefined || eventIndex === -1) return null;

      const updatedEvents = [...(trips[tripIndex].keyEvents || [])];
      updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], ...updates };

      const updatedTrip = {
        ...trips[tripIndex],
        keyEvents: updatedEvents,
        lastUpdated: new Date().toISOString()
      };
      trips[tripIndex] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error('Error updating key event:', error);
      return null;
    }
  }

  async deleteKeyEvent(tripId: string, eventId: string): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const tripIndex = trips.findIndex(trip => trip.id === tripId || trip.slug === tripId);
      if (tripIndex === -1) return null;

      const updatedTrip = {
        ...trips[tripIndex],
        keyEvents: trips[tripIndex].keyEvents?.filter(event => event.id !== eventId) || [],
        lastUpdated: new Date().toISOString()
      };
      trips[tripIndex] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error('Error deleting key event:', error);
      return null;
    }
  }

  // Deadlines
  async addDeadline(tripId: string, deadline: Omit<Deadline, "id">): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const index = trips.findIndex(trip => trip.id === tripId || trip.slug === tripId);
      if (index === -1) return null;

      const newDeadline = {
        ...deadline,
        id: crypto.randomUUID()
      };

      const updatedTrip = {
        ...trips[index],
        deadlines: [...(trips[index].deadlines || []), newDeadline],
        lastUpdated: new Date().toISOString()
      };
      trips[index] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error('Error adding deadline:', error);
      return null;
    }
  }

  async updateDeadline(tripId: string, deadlineId: string, updates: Partial<Deadline>): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const tripIndex = trips.findIndex(trip => trip.id === tripId || trip.slug === tripId);
      if (tripIndex === -1) return null;

      const deadlineIndex = trips[tripIndex].deadlines?.findIndex(deadline => deadline.id === deadlineId);
      if (deadlineIndex === undefined || deadlineIndex === -1) return null;

      const updatedDeadlines = [...(trips[tripIndex].deadlines || [])];
      updatedDeadlines[deadlineIndex] = { ...updatedDeadlines[deadlineIndex], ...updates };

      const updatedTrip = {
        ...trips[tripIndex],
        deadlines: updatedDeadlines,
        lastUpdated: new Date().toISOString()
      };
      trips[tripIndex] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error('Error updating deadline:', error);
      return null;
    }
  }

  async deleteDeadline(tripId: string, deadlineId: string): Promise<Trip | null> {
    try {
      const trips = this.getTripsFromStorage();
      const tripIndex = trips.findIndex(trip => trip.id === tripId || trip.slug === tripId);
      if (tripIndex === -1) return null;

      const updatedTrip = {
        ...trips[tripIndex],
        deadlines: trips[tripIndex].deadlines?.filter(deadline => deadline.id !== deadlineId) || [],
        lastUpdated: new Date().toISOString()
      };
      trips[tripIndex] = updatedTrip;
      this.saveTripsToStorage(trips);
      return updatedTrip;
    } catch (error) {
      console.error('Error deleting deadline:', error);
      return null;
    }
  }

  private getTripsFromStorage(): Trip[] {
    if (typeof window === 'undefined') return [];
    try {
      const tripsJson = localStorage.getItem('trips');
      console.log('Raw trips from storage:', tripsJson); // Debug log
      return tripsJson ? JSON.parse(tripsJson) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private saveTripsToStorage(trips: Trip[]): void {
    if (typeof window === 'undefined') return;
    try {
      console.log('Saving trips to storage:', trips); // Debug log
      localStorage.setItem('trips', JSON.stringify(trips));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }
}

export const tripService = TripService.getInstance();
