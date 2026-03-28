import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  legacySlugs: string[];
};

async function upsertCategory(category: SeedCategory) {
  console.log(`Seeding category: ${category.slug}`);

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [{ slug: category.slug }, ...category.legacySlugs.map((slug) => ({ slug }))],
    },
    select: { id: true },
  });

  if (existingCategory) {
    await prisma.category.update({
      where: { id: existingCategory.id },
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });

    console.log(`Updated category: ${category.slug}`);
    return;
  }

  await prisma.category.create({
    data: {
      name: category.name,
      slug: category.slug,
      description: category.description,
    },
  });

  console.log(`Created category: ${category.slug}`);
}

async function main() {
  console.log("Start seeding categories...");

  const categories: SeedCategory[] = [
    {
      name: "Textbooks & Study Materials",
      slug: "textbooks-study-materials",
      description: "Textbooks, lecture notes, and study resources for students.",
      legacySlugs: ["giao-trinh"],
    },
    {
      name: "Electronics",
      slug: "electronics",
      description: "Laptops, headphones, calculators, and tech accessories.",
      legacySlugs: ["dien-tu"],
    },
    {
      name: "Home Appliances",
      slug: "home-appliances",
      description: "Fans, rice cookers, desk lamps, and everyday household items.",
      legacySlugs: ["do-gia-dung"],
    },
    {
      name: "Dorm Essentials",
      slug: "dorm-essentials",
      description: "Useful items for daily student life in dorms and shared rooms.",
      legacySlugs: ["do-ky-tuc-xa"],
    },
    {
      name: "Other",
      slug: "other",
      description: "Everything else that does not fit the main marketplace categories.",
      legacySlugs: ["khac"],
    },
  ];

  for (const category of categories) {
    await upsertCategory(category);
  }

  const count = await prisma.category.count();
  console.log(`Category count after seed: ${count}`);
}

main()
  .then(async () => {
    console.log("Seed completed");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
