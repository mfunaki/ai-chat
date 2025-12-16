// Note: Prisma v7 requires adapter for database connection
// This file is prepared for future use when database persistence is needed
// Currently, conversation history is stored in session only (frontend state)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma: any = null;

// TODO: Configure Prisma client with MongoDB adapter when database persistence is required
// import { PrismaClient } from "@/generated/prisma/client";
// import { PrismaMongoDB } from "@prisma/adapter-mongodb";
// import { MongoClient } from "mongodb";
//
// const client = new MongoClient(process.env.DATABASE_URL!);
// const adapter = new PrismaMongoDB(client);
// export const prisma = new PrismaClient({ adapter });
