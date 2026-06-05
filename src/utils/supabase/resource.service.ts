export const ResourceService = {
  /**
   * Generic fetcher for "Fork-and-Hide" resources.
   * This removes the need for @ts-ignore.
   */
  async getResources<T>(
    userId: string,
    // Use the actual Prisma Delegate type for better safety
    delegate: any,
    hiddenDelegate: any,
    idKey: string,
  ): Promise<T[]> {
    // 1. Get hidden IDs
    const hidden = await hiddenDelegate.findMany({
      where: { userId },
      select: { [idKey]: true },
    });

    const hiddenIds = hidden.map((h: any) => h[idKey]);

    // 2. Fetch merged list using the delegate directly
    return await delegate.findMany({
      where: {
        AND: [
          { OR: [{ userId: null }, { userId }] },
          { id: { notIn: hiddenIds } },
        ],
      },
      orderBy: { name: "asc" },
    });
  },
};
