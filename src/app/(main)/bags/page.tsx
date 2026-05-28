import React from "react";
import { bagTypeService } from "@/services/bag-type.service";
import { createClient } from "@/utils/supabase/server";
import BagTypesClient from "./BagTypesClient";

export default async function BagTypesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let bagTypes: any[] = [];
  if (user) {
    bagTypes = await bagTypeService.getAll(user.id);
  }

  return <BagTypesClient initialBagTypes={bagTypes} />;
}
