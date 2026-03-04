// This script switches the Prisma schema provider based on DATABASE_URL.
// Run before prisma generate in production to switch from sqlite to postgresql.
import { readFileSync, writeFileSync } from "fs";

const dbUrl = process.env.DATABASE_URL || "";
const schemaPath = "prisma/schema.prisma";
let schema = readFileSync(schemaPath, "utf-8");

if (dbUrl.startsWith("postgres")) {
  schema = schema.replace(
    /provider\s*=\s*"sqlite"/,
    'provider = "postgresql"'
  );
  writeFileSync(schemaPath, schema);
  console.log("Switched Prisma schema provider to postgresql");
} else {
  console.log("Using sqlite provider (local dev)");
}
