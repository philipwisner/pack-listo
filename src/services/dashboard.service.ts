import "server-only";
import prisma from "@/lib/prisma";

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

export async function getDashboardData(userId: string): Promise<{
  trips: TripList[];
  stats: DashboardStats;
  error: string | null;
}> {
  try {
    // Fetch all active lists for the user along with their items to calculate deep aggregates
    const lists = await prisma.list.findMany({
      where: { userId, isTemplate: false },
      include: {
        items: {
          include: {
            bagTypeRef: true,
          },
        },
      },
      orderBy: { tripDate: "asc" },
    });

    if (lists.length === 0) {
      return {
        trips: [],
        stats: {
          totalTrips: 0,
          packedTrips: 0,
          totalItemsPacked: 0,
          overallProgress: 0,
        },
        error: null,
      };
    }

    // Map over lists to construct unified TripList item models
    const trips: TripList[] = lists.map((list) => {
      const totalItems = list.items.length;
      const packedItems = list.items.filter((i) => i.isPacked).length;
      const packedPercentage =
        totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

      // Determine list bagType (fallback if not configured explicitly)
      const bagType =
        list.items.find((i) => i.bagTypeRef)?.bagTypeRef?.name ||
        "Carry-on Backpack";

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

    // Compute stats based directly on the gathered data
    const totalTrips = trips.length;
    const packedTrips = trips.filter((t) => t.packedPercentage === 100).length;
    const totalItemsPacked = trips.reduce((acc, t) => acc + t.packedItems, 0);
    const totalAllItems = trips.reduce((acc, t) => acc + t.totalItems, 0);
    const overallProgress =
      totalAllItems > 0
        ? Math.round((totalItemsPacked / totalAllItems) * 100)
        : 0;

    return {
      trips,
      stats: {
        totalTrips,
        packedTrips,
        totalItemsPacked,
        overallProgress,
      },
      error: null,
    };
  } catch (error: any) {
    console.error("Failed to fetch dashboard metrics via Prisma:", error);
    return {
      trips: [],
      stats: {
        totalTrips: 0,
        packedTrips: 0,
        totalItemsPacked: 0,
        overallProgress: 0,
      },
      error: error.message || String(error),
    };
  }
}
