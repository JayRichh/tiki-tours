export type TripStatus =
  | 'draft'
  | 'planning'
  | 'booked'
  | 'relocating'
  | 'in_progress'
  | 'completed'

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  category?: string;
  dueDate?: string;
}

export interface Trip {
  id: string
  slug: string
  destination: string
  startDate: string
  endDate: string
  flexibleDates?: boolean
  tripBudget: number
  spentSoFar?: number
  tripDetails?: string
  status: TripStatus
  activities: Activity[]
  keyEvents?: KeyEvent[]
  deadlines?: Deadline[]
  checklists?: Checklist[]
  relocationPlan?: boolean
  holidayPreferences?: string[]
  numberOfTravelers?: number
  travelMode?: string
  currency?: string
  notes?: string[]
  tripPriority?: 'low' | 'medium' | 'high'
  lastUpdated?: string
}

export interface Activity {
  id: string
  tripId?: string
  activityName: string
  activityCost: number
  date: string
  location: string
  duration: number
  type: 'sightseeing' | 'food' | 'adventure' | 'relaxation' | 'other'
  bookingStatus?: 'planned' | 'booked' | 'completed'
  notes?: string
  category?: string
}

export interface KeyEvent {
  id: string
  title: string
  date: string
  description?: string
  priorityLevel?: 'low' | 'medium' | 'high'
}

export interface Deadline {
  id: string
  description: string
  dueDate: string
  completed?: boolean
}

export interface TripFilters {
  status?: TripStatus
  startDate?: string
  endDate?: string
  destination?: string
  minBudget?: number
  maxBudget?: number
  holidayPreferences?: string[]
}

export interface TripStats {
  totalBudget: number
  totalSpent: number
  remainingBudget: number
  tripCount: number
  upcomingTrips: number
  inProgressTrips?: number
  completedTrips?: number
  relocatingTrips?: number
}
