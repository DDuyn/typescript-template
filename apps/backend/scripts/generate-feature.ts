import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const [feature] = process.argv.slice(2);

if (!feature) {
  console.error("❌ Usage: pnpm gen:feature <featureName>");
  process.exit(1);
}

const basePath = join(__dirname, "../../../apps/backend/src/features", feature);
const subfolders = ["domain", "api", "infra"];

subfolders.forEach((sub) => {
  const subPath = join(basePath, sub);
  mkdirSync(subPath, { recursive: true });
  const gitkeepPath = join(subPath, ".gitkeep");
  writeFileSync(gitkeepPath, "", { flag: "w" });
});

const compositionPath = join(basePath, "infra", `${feature}.composition.ts`);
writeFileSync(
  compositionPath,
  `// Composition root for the ${feature} feature\n`,
  { flag: "w" }
);

console.log(
  `✅ Created feature '${feature}' with domain, api, infra subfolders and composition.ts.`
);
