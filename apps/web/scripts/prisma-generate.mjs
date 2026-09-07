// Generates every Prisma client this app uses.
//
// There are two parallel sets of schema files, both consumed by the codebase:
//   - src/lib/prisma/*.schema.prisma  -> src/lib/generated/*   (used by src/lib/prisma/*.ts wrappers)
//   - src/generated/*/schema.prisma   -> src/generated/*       (imported directly by many route.js files)
//
// Running this at postinstall + prebuild keeps generated clients (incl. the
// correct query-engine binary for the deploy target) in sync with the schemas
// without committing them.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const schemas = [
  "src/lib/prisma/user.schema.prisma",
  "src/lib/prisma/social.schema.prisma",
  "src/lib/prisma/items.schema.prisma",
  "src/lib/prisma/community.schema.prisma",
  "src/lib/prisma/audit.schema.prisma",
  "src/generated/user/schema.prisma",
  "src/generated/social/schema.prisma",
  "src/generated/item/schema.prisma",
  "src/generated/community/schema.prisma",
  "src/generated/audit/schema.prisma",
];

for (const rel of schemas) {
  const abs = join(webRoot, rel);
  if (!existsSync(abs)) {
    console.warn(`[prisma-generate] skip (missing): ${rel}`);
    continue;
  }
  console.log(`[prisma-generate] ${rel}`);
  execFileSync("npx", ["prisma", "generate", `--schema=${abs}`], {
    cwd: webRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}
