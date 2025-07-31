import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const [domain, feature] = process.argv.slice(2);

if (!domain || !feature) {
  console.error("❌ Usage: pnpm gen:feature <domain> <feature>");
  process.exit(1);
}

const basePath = join(
  __dirname,
  "../../../apps/backend/src/domain",
  domain,
  "features",
  feature
);

mkdirSync(basePath, { recursive: true });

const files = [
  `${feature}.model.ts`,
  `${feature}.service.ts`,
  `${feature}.handler.ts`,
];

files.forEach((file) => {
  const path = join(basePath, file);
  writeFileSync(path, `// ${file} for ${domain}/${feature}\n`, { flag: "wx" });
});

console.log(
  `✅ Created ${domain}/${feature} with model, service, and handler.`
);
