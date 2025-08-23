import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const [feature] = process.argv.slice(2);

if (!feature) {
  console.error("❌ Usage: pnpm gen:feature <featureName>");
  process.exit(1);
}

const basePath = join(__dirname, "../src/features", feature);

// Create folder structure
const folders = ["api", "domain", "infra"];
folders.forEach((folder) => {
  mkdirSync(join(basePath, folder), { recursive: true });
});

// Create infra subfolders
mkdirSync(join(basePath, "infra", "repositories"), { recursive: true });
mkdirSync(join(basePath, "infra", "services"), { recursive: true });

// ===== 1. COMPOSITION =====
const compositionContent = `// ${feature}.composition.ts
import { ${capitalize(
  feature
)}Repository } from "./repositories/${feature}.repository";
import { ${capitalize(feature)}Service } from "./services/${feature}.service";

export type ${capitalize(feature)}Context = {
  repository: ${capitalize(feature)}Repository;
};

export function create${capitalize(feature)}Dependencies() {
  const ${feature}Service = new ${capitalize(feature)}Service();
  const ${feature}Repository = new ${capitalize(
  feature
)}Repository(${feature}Service);

  return {
    ${feature}Repository,
    ${feature}Service,
  };
}

export function create${capitalize(feature)}Context(): ${capitalize(
  feature
)}Context {
  const { ${feature}Repository } = create${capitalize(feature)}Dependencies();
  return { repository: ${feature}Repository };
}
`;

writeFileSync(
  join(basePath, "infra", `${feature}.composition.ts`),
  compositionContent
);

// ===== 2. ROUTES =====
const routesContent = `// ${feature}.routes.ts
import { requireAuth } from "@infra/http/middleware/auth.middleware";
import { Hono } from "hono";
import { create${capitalize(feature)}Context } from "./${feature}.composition";

// Import handlers here:
// import { create${capitalize(
  feature
)}Handler } from "../api/create-${feature}.handler";

export function create${capitalize(feature)}Router(): Hono {
  const router = new Hono();
  const context = create${capitalize(feature)}Context();

  // Add your routes here:
  // router.post("/", (c) => create${capitalize(feature)}Handler(c, context));
  // router.get("/:id", requireAuth, (c) => get${capitalize(
    feature
  )}Handler(c, context));

  return router;
}
`;

writeFileSync(join(basePath, "infra", `${feature}.routes.ts`), routesContent);

// ===== 3. REPOSITORY =====
const repositoryContent = `// repositories/${feature}.repository.ts
import { db } from "@infra/db/drizzle";
import { ${capitalize(feature)}Service } from "../services/${feature}.service";

export class ${capitalize(feature)}Repository {
  constructor(private ${feature}Service: ${capitalize(feature)}Service) {}

  async findById(id: string) {
    // Implementation using db
    // const [row] = await db.select().from(${feature}Table).where(eq(${feature}Table.id, id));
    // return row;
  }

  async create(data: any) {
    // Implementation using db
    // const [created] = await db.insert(${feature}Table).values(data).returning();
    // return created;
  }

  async update(id: string, data: any) {
    // Implementation using db
    // const [updated] = await db.update(${feature}Table).set(data).where(eq(${feature}Table.id, id)).returning();
    // return updated;
  }

  async delete(id: string) {
    // Implementation using db
    // await db.delete(${feature}Table).where(eq(${feature}Table.id, id));
    // return true;
  }
}
`;

writeFileSync(
  join(basePath, "infra", "repositories", `${feature}.repository.ts`),
  repositoryContent
);

// ===== 4. SERVICE =====
const serviceContent = `// services/${feature}.service.ts

export class ${capitalize(feature)}Service {
  // Add external service integrations here
  // For example: API calls, file operations, external databases, etc.

  async processExternalData(data: any) {
    // Implementation for external operations
    return data;
  }
}
`;

writeFileSync(
  join(basePath, "infra", "services", `${feature}.service.ts`),
  serviceContent
);

// ===== 5. CONTEXT TYPE =====
const contextContent = `// domain/${feature}.context.ts
import { ${capitalize(
  feature
)}Repository } from "../infra/repositories/${feature}.repository";

export type ${capitalize(feature)}Context = {
  repository: ${capitalize(feature)}Repository;
};
`;

writeFileSync(
  join(basePath, "domain", `${feature}.context.ts`),
  contextContent
);

// ===== 6. EXAMPLE HANDLER =====
const handlerContent = `// api/create-${feature}.handler.ts
import { isErr } from "@core/result/result";
import { Context } from "hono";
import { ${capitalize(feature)}Context } from "../domain/${feature}.context";
import { create${capitalize(
  feature
)}Service } from "../domain/create-${feature}.service";
import { create${capitalize(
  feature
)}RequestSchema } from "./create-${feature}.request";

export const create${capitalize(
  feature
)}Handler = async (c: Context, context: ${capitalize(feature)}Context) => {
  const body = await c.req.json();
  const parseResult = create${capitalize(feature)}RequestSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json({ error: "Invalid request", details: parseResult.error }, 400);
  }

  const result = await create${capitalize(
    feature
  )}Service(parseResult.data, context);

  if (isErr(result)) {
    return c.json({ error: result.error }, 400);
  }

  return c.json(result.value, 201);
};
`;

writeFileSync(
  join(basePath, "api", `create-${feature}.handler.ts`),
  handlerContent
);

// ===== 7. EXAMPLE REQUEST SCHEMA =====
const requestContent = `// api/create-${feature}.request.ts
import { z } from "zod";

export const create${capitalize(feature)}RequestSchema = z.object({
  // Add your validation schema here
  name: z.string().min(1),
});

export type Create${capitalize(
  feature
)}Request = z.infer<typeof create${capitalize(feature)}RequestSchema>;
`;

writeFileSync(
  join(basePath, "api", `create-${feature}.request.ts`),
  requestContent
);

// ===== 8. EXAMPLE SERVICE =====
const domainServiceContent = `// domain/create-${feature}.service.ts
import { err, ok, Result } from "@core/result/result";
import { ${capitalize(feature)}Context } from "./${feature}.context";

export const create${capitalize(feature)}Service = async (
  data: any,
  context: ${capitalize(feature)}Context
): Promise<Result<any, string>> => {
  try {
    const result = await context.repository.create(data);
    
    if (!result) {
      return err("Failed to create ${feature}");
    }

    return ok(result);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Unknown error");
  }
};
`;

writeFileSync(
  join(basePath, "domain", `create-${feature}.service.ts`),
  domainServiceContent
);

// Success message
console.log(`✅ Feature '${feature}' created successfully!`);
console.log(`\n📁 Structure created:`);
console.log(`├── api/`);
console.log(`│   ├── create-${feature}.handler.ts`);
console.log(`│   └── create-${feature}.request.ts`);
console.log(`├── domain/`);
console.log(`│   ├── ${feature}.context.ts`);
console.log(`│   └── create-${feature}.service.ts`);
console.log(`└── infra/`);
console.log(`    ├── ${feature}.composition.ts`);
console.log(`    ├── ${feature}.routes.ts`);
console.log(`    ├── repositories/`);
console.log(`    │   └── ${feature}.repository.ts`);
console.log(`    └── services/`);
console.log(`        └── ${feature}.service.ts`);

console.log(`\n📝 Next steps:`);
console.log(`1. Add to api.ts:`);
console.log(
  `   import { create${capitalize(
    feature
  )}Router } from "@features/${feature}/infra/${feature}.routes";`
);
console.log(
  `   api.route("/${feature}", create${capitalize(feature)}Router());`
);
console.log(`\n2. Create database schema if needed`);
console.log(`3. Add your business logic to services`);
console.log(`4. Configure routes in ${feature}.routes.ts`);

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
