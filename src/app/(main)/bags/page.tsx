import { getCurrentUser } from "@/lib/auth";
import { BagType } from "@/generated/prisma/browser";
import { getBagTypesAction } from "@/features/bag-type/bag-type.actions";
import BagTypesClient from "./BagTypesClient";

export const metadata = {
  title: "Bags",
};

export default async function BagTypesPage() {
  const user = await getCurrentUser();

  let bagTypes: BagType[] = [];
  if (user) {
    const result = await getBagTypesAction();
    bagTypes = (result?.data as BagType[]) || [];
  }

  return <BagTypesClient initialBagTypes={bagTypes} />;
}
