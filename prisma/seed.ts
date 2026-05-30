import * as dotenv from "dotenv";
// Load .env.local first for local development override
dotenv.config({ path: ".env.local" });
// Fall back to standard .env if keys aren't found in .env.local
dotenv.config();

// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Fall back to the Supabase integration strings if local DATABASE_URL is missing
const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  console.error(
    "❌ Error: Connection string missing. Define DATABASE_URL or POSTGRES_URL_NON_POOLING.",
  );
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["warn", "error"] });
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Upsert a category (global – no userId). */
async function upsertCategory(data: {
  name: string;
  icon: string;
  color: string;
}) {
  // Use empty-string sentinel so the compound unique index is satisfied on
  // repeated runs (null != null in Postgres unique indexes).
  await prisma.category.upsert({
    where: { name_userId: { name: data.name, userId: "" } },
    update: {},
    create: { name: data.name, icon: data.icon, color: data.color },
  });
}

/** Upsert a bag type (global – no userId). */
async function upsertBagType(data: {
  name: string;
  icon: string;
  color: string;
}) {
  await prisma.bagType.upsert({
    where: { name_userId: { name: data.name, userId: "" } },
    update: {},
    create: { name: data.name, icon: data.icon, color: data.color },
  });
}

/**
 * Create a library item if it doesn't already exist.
 * Connects it to one or more categories by name.
 */
async function seedItem(
  name: string,
  categoryNames: string[],
  defaultWeight?: number,
) {
  const existing = await prisma.item.findFirst({
    where: { name, userId: null },
  });
  if (existing) {
    return;
  }

  // Resolve category IDs – use findFirst to safely pick one record per name
  const categoryIds: { id: string }[] = [];
  for (const catName of categoryNames) {
    const cat = await prisma.category.findFirst({
      where: { name: catName, userId: null },
    });
    if (cat) categoryIds.push({ id: cat.id });
  }

  await prisma.item.create({
    data: {
      name,
      defaultWeight: defaultWeight ?? null,
      categories: { connect: categoryIds },
      userId: null,
    },
  });
  console.log(`  + ${name}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("🌱  Starting seed…\n");

  await prisma.$transaction([
    prisma.listItem.deleteMany(),
    prisma.item.deleteMany(),
    prisma.category.deleteMany(),
    prisma.bagType.deleteMany(),
  ]);

  // =========================================================================
  // CATEGORIES
  // =========================================================================
  console.log("📂  Categories");
  const categories = [
    // --- originals ---
    { name: "Clothing", icon: "shirt", color: "#4f46e5" },
    { name: "Toiletries", icon: "droplet", color: "#0ea5e9" },
    { name: "Electronics", icon: "smartphone", color: "#eab308" },
    { name: "Documents", icon: "file-text", color: "#ef4444" },
    { name: "Health", icon: "activity", color: "#10b981" },
    { name: "Miscellaneous", icon: "package", color: "#8b5cf6" },
    // --- new ---
    { name: "Accessories", icon: "watch", color: "#f59e0b" },
    { name: "Footwear", icon: "footprints", color: "#92400e" },
    { name: "Skincare", icon: "sparkles", color: "#f472b6" },
    { name: "Entertainment", icon: "gamepad-2", color: "#6366f1" },
    { name: "Cables & Adapters", icon: "cable", color: "#64748b" },
    { name: "Packing Organizers", icon: "box", color: "#4ade80" },
  ];
  for (const cat of categories) {
    await upsertCategory(cat);
    console.log(`  ✓ ${cat.name}`);
  }

  // =========================================================================
  // BAG TYPES
  // =========================================================================
  console.log("\n🧳  Bag Types");
  const bagTypes = [
    // --- originals ---
    { name: "Carry-on Backpack", icon: "briefcase", color: "#3b82f6" },
    { name: "Checked Suitcase", icon: "luggage", color: "#f97316" },
    { name: "Personal Item", icon: "shopping-bag", color: "#ec4899" },
    // --- new ---
    { name: "Toiletries Bag", icon: "droplets", color: "#06b6d4" },
    { name: "On Person", icon: "user", color: "#8b5cf6" },
  ];
  for (const bt of bagTypes) {
    await upsertBagType(bt);
    console.log(`  ✓ ${bt.name}`);
  }

  // =========================================================================
  // LIBRARY ITEMS
  // =========================================================================
  console.log("\n📦  Library Items");

  // ── Packing Organizers ────────────────────────────────────────────────────
  console.log("\n  [Packing Organizers]");
  await seedItem("Small Packing Cube", ["Packing Organizers"]);
  await seedItem("Medium Packing Cube", ["Packing Organizers"]);
  await seedItem("Large Packing Cube", ["Packing Organizers"]);
  await seedItem("Dry Bag", ["Packing Organizers"]);
  await seedItem("Zipper Bag", ["Packing Organizers"]);
  await seedItem("Pill Box", ["Packing Organizers", "Health"]);

  // ── Clothing ─────────────────────────────────────────────────────────────
  console.log("\n  [Clothing]");
  await seedItem("Underwear", ["Clothing"]);
  await seedItem("Socks", ["Clothing"]);
  await seedItem("T-Shirt", ["Clothing"]);
  await seedItem("Gym Shirt", ["Clothing"]);
  await seedItem("Sleep T-Shirt", ["Clothing"]);
  await seedItem("Dress Shirt", ["Clothing"]);
  await seedItem("Button-Down Short Sleeve Shirt", ["Clothing"]);
  await seedItem("Button-Down Long Sleeve Shirt", ["Clothing"]);
  await seedItem("Undershirt", ["Clothing"]);
  await seedItem("Shorts", ["Clothing"]);
  await seedItem("Jeans", ["Clothing"]);
  await seedItem("Dress Pants", ["Clothing"]);
  await seedItem("Sweatpants", ["Clothing"]);
  await seedItem("Sweater", ["Clothing"]);
  await seedItem("Rain Jacket", ["Clothing"]);
  await seedItem("Hoodie", ["Clothing"]);
  await seedItem("Clothing Set", ["Clothing"]);
  await seedItem("Gloves", ["Clothing", "Accessories"]);
  await seedItem("Winter Hat", ["Clothing", "Accessories"]);

  // ── Footwear ──────────────────────────────────────────────────────────────
  console.log("\n  [Footwear]");
  await seedItem("Shoes", ["Footwear", "Clothing"]);
  await seedItem("Flip Flops", ["Footwear", "Clothing"]);

  // ── Accessories ───────────────────────────────────────────────────────────
  console.log("\n  [Accessories]");
  await seedItem("Clip Belt", ["Accessories"]);
  await seedItem("Baseball Cap", ["Accessories", "Clothing"]);
  await seedItem("Wristlet Wallet", ["Accessories"]);
  await seedItem("Sunglasses", ["Accessories"]);
  await seedItem("Watch", ["Accessories", "Electronics"]);
  await seedItem("Galaxy Watch", ["Accessories", "Electronics"]);
  await seedItem("Transition Glasses", ["Accessories"]);
  await seedItem("Glasses Case", ["Accessories"]);
  await seedItem("Cleaning Cloth", ["Accessories", "Electronics"]);

  // ── Electronics / Devices ────────────────────────────────────────────────
  console.log("\n  [Electronics]");
  await seedItem("MacBook", ["Electronics"]);
  await seedItem("iPad", ["Electronics", "Entertainment"]);
  await seedItem("Apple Pencil", ["Electronics"]);
  await seedItem("Nintendo Switch", ["Electronics", "Entertainment"]);
  await seedItem("Nintendo Switch Charger", [
    "Electronics",
    "Cables & Adapters",
  ]);
  await seedItem("Galaxy Buds", ["Electronics"]);
  await seedItem("Wireless Earbuds", ["Electronics"]);
  await seedItem("Wired Headphones", ["Electronics"]);
  await seedItem("External SSD", ["Electronics"]);
  await seedItem("100W USB-C Charging Brick", [
    "Electronics",
    "Cables & Adapters",
  ]);
  await seedItem("Galaxy Watch Charger", ["Electronics", "Cables & Adapters"]);
  await seedItem("Portable Charger", ["Electronics", "Cables & Adapters"]);
  await seedItem("Entertainment Pack", ["Electronics", "Entertainment"]);
  await seedItem("Earbud Tips", ["Electronics"]);

  // ── Cables & Adapters ────────────────────────────────────────────────────
  console.log("\n  [Cables & Adapters]");
  await seedItem("USB-C to USB-C Cable", ["Cables & Adapters"]);
  await seedItem("USB-A to USB-C Cable", ["Cables & Adapters"]);
  await seedItem("USB-C to Lightning Adapter", ["Cables & Adapters"]);
  await seedItem("USB-C to USB-A Adapter", ["Cables & Adapters"]);
  await seedItem("Micro USB Adapter", ["Cables & Adapters"]);
  await seedItem("Beard Trimmer Charger", ["Cables & Adapters", "Toiletries"]);

  // ── Documents & Essentials ───────────────────────────────────────────────
  console.log("\n  [Documents]");
  await seedItem("Passport", ["Documents"]);
  await seedItem("Keys", ["Documents", "Miscellaneous"]);
  await seedItem("Phone", ["Electronics", "Documents"]);
  await seedItem("Wallet", ["Documents", "Accessories"]);

  // ── Health & Medications ─────────────────────────────────────────────────
  console.log("\n  [Health]");
  await seedItem("Probiotics", ["Health"]);
  await seedItem("Lactaid", ["Health"]);
  await seedItem("Pepto-Bismol", ["Health"]);
  await seedItem("Tylenol", ["Health"]);
  await seedItem("Gas-X", ["Health"]);
  await seedItem("Mucinex", ["Health"]);
  await seedItem("NyQuil", ["Health"]);
  await seedItem("Prescription Medication", ["Health"]);
  await seedItem("Vitamins", ["Health"]);
  await seedItem("Band-Aids", ["Health", "Toiletries"]);
  await seedItem("Alcohol Wipes", ["Health"]);
  await seedItem("Nasal Spray", ["Health"]);
  await seedItem("Hand Sanitizer", ["Health", "Toiletries"]);
  await seedItem("Nose Pads", ["Health", "Accessories"]);
  await seedItem("Masks", ["Health", "Miscellaneous"]);

  // ── Toiletries ───────────────────────────────────────────────────────────
  console.log("\n  [Toiletries]");
  await seedItem("Toothbrush", ["Toiletries"]);
  await seedItem("Replacement Toothbrush Head", ["Toiletries"]);
  await seedItem("Dental Floss", ["Toiletries"]);
  await seedItem("Deodorant", ["Toiletries"]);
  await seedItem("Razor", ["Toiletries"]);
  await seedItem("Razor Blades", ["Toiletries"]);
  await seedItem("Nail Clippers", ["Toiletries"]);
  await seedItem("Tweezers", ["Toiletries"]);
  await seedItem("Foot Cream", ["Toiletries", "Skincare"]);
  await seedItem("Bar Soap", ["Toiletries"]);
  await seedItem("Beard Trimmer", ["Toiletries"]);
  await seedItem("Shampoo", ["Toiletries"]);
  await seedItem("Chapstick", ["Toiletries", "Skincare"]);

  // ── Skincare ─────────────────────────────────────────────────────────────
  console.log("\n  [Skincare]");
  await seedItem("Moisturizer", ["Skincare", "Toiletries"]);
  await seedItem("Face Sunscreen", ["Skincare", "Toiletries"]);
  await seedItem("Aftershave", ["Skincare", "Toiletries"]);
  await seedItem("BHA Serum", ["Skincare"]);
  await seedItem("Niacinamide Serum", ["Skincare"]);
  await seedItem("Sunscreen", ["Skincare", "Toiletries"]);
  await seedItem("Face Cleanser", ["Skincare", "Toiletries"]);

  // ── Miscellaneous ────────────────────────────────────────────────────────
  console.log("\n  [Miscellaneous]");
  await seedItem("Gum", ["Miscellaneous"]);
  await seedItem("Pen", ["Miscellaneous"]);
  await seedItem("Portable Fan", ["Miscellaneous", "Electronics"]);

  console.log("\n✅  Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
