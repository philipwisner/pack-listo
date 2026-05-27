"use server";

import { redirect } from "next/navigation";
import { prisma } from "../db";
import { getCurrentUser } from "@/utils/auth/server";

async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    redirect("/dashboard");
  }
  return user;
}

function getField(formData: FormData, key: string) {
  return (formData.get(key) as string | null)?.trim() || "";
}

export async function createCategoryAction(_state: any, formData: FormData) {
  await requireAdminUser();

  const name = getField(formData, "name");
  const icon = getField(formData, "icon");
  const color = getField(formData, "color");

  if (!name) {
    return { error: "Category name is required" };
  }

  await prisma.category.create({ data: { name, icon: icon || null, color: color || null, userId: null } });
  redirect("/admin");
}

export async function updateCategoryAction(_state: any, formData: FormData) {
  await requireAdminUser();

  const id = getField(formData, "id");
  const name = getField(formData, "name");
  const icon = getField(formData, "icon");
  const color = getField(formData, "color");

  if (!id || !name) {
    return { error: "Category id and name are required" };
  }

  await prisma.category.update({ where: { id }, data: { name, icon: icon || null, color: color || null } });
  redirect("/admin");
}

export async function deleteCategoryAction(_state: any, formData: FormData) {
  await requireAdminUser();

  const id = getField(formData, "id");
  if (!id) {
    return { error: "Category id is required" };
  }

  await prisma.category.delete({ where: { id } });
  redirect("/admin");
}

export async function createBagTypeAction(_state: any, formData: FormData) {
  await requireAdminUser();

  const name = getField(formData, "name");
  const icon = getField(formData, "icon");
  const color = getField(formData, "color");

  if (!name) {
    return { error: "Bag type name is required" };
  }

  await prisma.bagType.create({ data: { name, icon: icon || null, color: color || null, userId: null } });
  redirect("/admin");
}

export async function updateBagTypeAction(_state: any, formData: FormData) {
  await requireAdminUser();

  const id = getField(formData, "id");
  const name = getField(formData, "name");
  const icon = getField(formData, "icon");
  const color = getField(formData, "color");

  if (!id || !name) {
    return { error: "Bag type id and name are required" };
  }

  await prisma.bagType.update({ where: { id }, data: { name, icon: icon || null, color: color || null } });
  redirect("/admin");
}

export async function deleteBagTypeAction(_state: any, formData: FormData) {
  await requireAdminUser();

  const id = getField(formData, "id");
  if (!id) {
    return { error: "Bag type id is required" };
  }

  await prisma.bagType.delete({ where: { id } });
  redirect("/admin");
}

export async function createItemAction(_state: any, formData: FormData) {
  await requireAdminUser();

  const name = getField(formData, "name");
  const defaultWeightRaw = getField(formData, "defaultWeight");
  const categoryIds = formData.getAll("categoryIds").filter(Boolean) as string[];
  const defaultWeight = defaultWeightRaw ? parseFloat(defaultWeightRaw) : null;

  if (!name) {
    return { error: "Item name is required" };
  }

  await prisma.item.create({
    data: {
      name,
      defaultWeight,
      userId: null,
      categories: {
        connect: categoryIds.map((id) => ({ id })),
      },
    },
  });
  redirect("/admin");
}

export async function updateItemAction(_state: any, formData: FormData) {
  await requireAdminUser();

  const id = getField(formData, "id");
  const name = getField(formData, "name");
  const defaultWeightRaw = getField(formData, "defaultWeight");
  const categoryIds = formData.getAll("categoryIds").filter(Boolean) as string[];
  const defaultWeight = defaultWeightRaw ? parseFloat(defaultWeightRaw) : null;

  if (!id || !name) {
    return { error: "Item id and name are required" };
  }

  await prisma.item.update({
    where: { id },
    data: {
      name,
      defaultWeight,
      categories: {
        set: categoryIds.map((id) => ({ id })),
      },
    },
  });
  redirect("/admin");
}

export async function deleteItemAction(_state: any, formData: FormData) {
  await requireAdminUser();

  const id = getField(formData, "id");
  if (!id) {
    return { error: "Item id is required" };
  }

  await prisma.item.delete({ where: { id } });
  redirect("/admin");
}
