// Applies all five Prisma schemas to the database, in a safe order.
//
// WHY ORDER MATTERS: `user_d.*` tables are declared in several schema files (user, social,
// items) because Prisma cannot share models across schema files. `db push` drops anything
// the pushed schema doesn't know about in that DB schema, so each push must come from a file
// that is a superset of what is already there. `items` declares every user_d table
// (incl. password_reset_tokens), so it goes LAST.
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const name of ["user", "social", "community", "audit", "items"]) {
  console.log(`[db-push] ${name}`);
  execFileSync("npx", ["prisma", "db push", `--schema=src/lib/prisma/${name}.schema.prisma`, "--accept-data-loss", "--skip-generate"].flatMap((a) => a.split(" ")), {
    cwd: webRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}
