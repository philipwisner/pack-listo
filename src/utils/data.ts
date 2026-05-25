import { prisma } from "./db";
import { isMockMode } from "./auth/shared";

export interface TripList {
  id: string;
  name: string;
  destination: string | null;
  tripDate: Date | null;
  lengthOfStay: number | null;
  status: string; // "PLANNING", "READY", "PACKED"
  packedPercentage: number;
  totalItems: number;
  packedItems: number;
  bagType: string;
  isMock?: boolean;
}

export interface DashboardStats {
  totalTrips: number;
  packedTrips: number;
  totalItemsPacked: number;
  overallProgress: number;
}

const MOCK_TRIPS: TripList[] = [
  {
    id: "trip-barcelona-2026",
    name: "Summer in Barcelona",
    destination: "Barcelona, Spain",
    tripDate: new Date("2026-06-15"),
    lengthOfStay: 7,
    status: "PLANNING",
    packedPercentage: 75,
    totalItems: 16,
    packedItems: 12,
    bagType: "Carry-on Backpack",
    isMock: true,
  },
  {
    id: "trip-adirondacks-2026",
    name: "Weekend Hiking",
    destination: "Adirondacks, NY",
    tripDate: new Date("2026-05-30"),
    lengthOfStay: 2,
    status: "READY",
    packedPercentage: 100,
    totalItems: 8,
    packedItems: 8,
    bagType: "Carry-on Backpack",
    isMock: true,
  },
  {
    id: "trip-london-2026",
    name: "Business in London",
    destination: "London, UK",
    tripDate: new Date("2026-07-04"),
    lengthOfStay: 5,
    status: "PLANNING",
    packedPercentage: 10,
    totalItems: 20,
    packedItems: 2,
    bagType: "Checked Suitcase",
    isMock: true,
  },
];

const MOCK_STATS: DashboardStats = {
  totalTrips: 3,
  packedTrips: 1,
  totalItemsPacked: 22,
  overallProgress: 50,
};

export async function getDashboardData(userId: string): Promise<{
  trips: TripList[];
  stats: DashboardStats;
  isFallback: boolean;
}> {
  if (isMockMode()) {
    return { trips: MOCK_TRIPS, stats: MOCK_STATS, isFallback: true };
  }

  try {
    // Attempt actual Prisma DB query
    const lists = await prisma.list.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            item: true,
            bagTypeRef: true,
          },
        },
      },
      orderBy: { tripDate: "asc" },
    });

    if (lists.length === 0) {
      // If user is logged in but has no trips, we could return empty or mock data for preview
      return { trips: [], stats: { totalTrips: 0, packedTrips: 0, totalItemsPacked: 0, overallProgress: 0 }, isFallback: false };
    }

    const trips: TripList[] = lists.map((list) => {
      const totalItems = list.items.length;
      const packedItems = list.items.filter((i) => i.isPacked).length;
      const packedPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
      
      // Determine list bagType (fallback to Carry-on Backpack if not set)
      const bagType = list.items.find((i) => i.bagTypeRef)?.bagTypeRef?.name || "Carry-on Backpack";

      return {
        id: list.id,
        name: list.name,
        destination: list.destination,
        tripDate: list.tripDate,
        lengthOfStay: list.lengthOfStay,
        status: list.status,
        packedPercentage,
        totalItems,
        packedItems,
        bagType,
      };
    });

    const totalTrips = trips.length;
    const packedTrips = trips.filter((t) => t.packedPercentage === 100).length;
    const totalItemsPacked = trips.reduce((acc, t) => acc + t.packedItems, 0);
    const totalAllItems = trips.reduce((acc, t) => acc + t.totalItems, 0);
    const overallProgress = totalAllItems > 0 ? Math.round((totalItemsPacked / totalAllItems) * 100) : 0;

    return {
      trips,
      stats: {
        totalTrips,
        packedTrips,
        totalItemsPacked,
        overallProgress,
      },
      isFallback: false,
    };
  } catch (error) {
    console.warn("Prisma query failed, falling back to mock data. Database offline:", error);
    // Graceful fallback to mock data if database is not reachable/offline in local development
    return { trips: MOCK_TRIPS, stats: MOCK_STATS, isFallback: true };
  }
}
