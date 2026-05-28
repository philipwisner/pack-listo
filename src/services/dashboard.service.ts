import 'server-only';
import prisma from "@/lib/prisma";

export const dashboardService = {
  async getDashboardData(userId: string) {
    const [
      activeListsCount,
      totalItemsCount,
      bagTypesCount,
      totalItemsInLists,
      packedItemsInLists,
      upcomingTrips
    ] = await Promise.all([
      // Active Lists Count (non-templates)
      prisma.list.count({
        where: { userId, isTemplate: false }
      }),
      // Total Items in Inventory
      prisma.item.count({
        where: { userId }
      }),
      // Bag Types Count (User's + System defaults)
      prisma.bagType.count({
        where: {
          OR: [
            { userId },
            { userId: null }
          ]
        }
      }),
      // Total items across all active lists (for ratio)
      prisma.listItem.count({
        where: { list: { userId, isTemplate: false } }
      }),
      // Total packed items across all active lists
      prisma.listItem.count({
        where: { list: { userId, isTemplate: false }, isPacked: true }
      }),
      // Upcoming trips
      prisma.list.findMany({
        where: { userId, isTemplate: false },
        orderBy: { tripDate: 'asc' },
        take: 3
      })
    ]);

    const packedRatio = totalItemsInLists > 0 
      ? Math.round((packedItemsInLists / totalItemsInLists) * 100) 
      : 0;

    const nextTrip = upcomingTrips[0];

    return {
      stats: {
        activeListsCount,
        totalItemsCount,
        bagTypesCount,
        packedRatio,
        nextTripName: nextTrip?.name || 'No upcoming trips'
      },
      upcomingTrips: upcomingTrips.map((trip: any) => ({
        id: trip.id,
        destination: trip.destination || 'TBD',
        date: trip.tripDate ? trip.tripDate.toISOString().split('T')[0] : 'TBD',
        status: trip.status || 'PLANNING',
        priority: trip === nextTrip
      }))
    };
  }
};
