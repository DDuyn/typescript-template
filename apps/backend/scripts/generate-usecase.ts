import fs from "fs";
import path from "path";

const featureName = process.argv[2];
const useCaseName = process.argv[3];

if (!featureName || !useCaseName) {
  console.error("Usage: pnpm gen:usecase <featureName> <useCaseName>");
  process.exit(1);
}

const baseDir = path.join(
  process.cwd(),
  "src",
  "features",
  featureName,
  "domain",
  useCaseName
);

if (fs.existsSync(baseDir)) {
  console.error(
    `❌ Use case ${useCaseName} already exists in feature ${featureName}`
  );
  process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });

// service
const serviceFile = path.join(baseDir, `${useCaseName}.service.ts`);
fs.writeFileSync(
  serviceFile,
  `// ${useCaseName}.service.ts
export async function ${useCaseName}Service() {
  // TODO: implement ${useCaseName} service logic
  return {};
}
`
);

// model
const modelFile = path.join(baseDir, `${useCaseName}.model.ts`);
fs.writeFileSync(
  modelFile,
  `// ${useCaseName}.model.ts
export type ${capitalize(useCaseName)}Model = {
  // TODO: define model for ${useCaseName}
};
`
);

// test
const testFile = path.join(baseDir, `${useCaseName}.test.ts`);
fs.writeFileSync(
  testFile,
  `// ${useCaseName}.test.ts
import { ${useCaseName}Service } from "./${useCaseName}.service";

test("${useCaseName}Service should work", async () => {
  const result = await ${useCaseName}Service();
  expect(result).toBeDefined();
});
`
);

// Create API folder and files
const apiDir = path.join(
  process.cwd(),
  "src",
  "features",
  featureName,
  "api",
  useCaseName
);

if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// Create placeholder files in API folder
const handlerFile = path.join(apiDir, `${useCaseName}.handler.ts`);
const requestFile = path.join(apiDir, `${useCaseName}.request.ts`);
const responseFile = path.join(apiDir, `${useCaseName}.response.ts`);
const gitkeepFile = path.join(apiDir, `.gitkeep`);

fs.writeFileSync(handlerFile, `// TODO: implement ${useCaseName} handler`);
fs.writeFileSync(requestFile, `// TODO: define ${useCaseName} request`);
fs.writeFileSync(responseFile, `// TODO: define ${useCaseName} response`);
fs.writeFileSync(gitkeepFile, "");

console.log(
  `✅ Use case '${useCaseName}' created inside feature '${featureName}'.`
);

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
