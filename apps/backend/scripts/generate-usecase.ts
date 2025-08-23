// apps/backend/scripts/generate-usecase.ts
import fs from "fs";
import path from "path";

const featureName = process.argv[2];
const useCaseName = process.argv[3];

if (!featureName || !useCaseName) {
  console.error("Usage: pnpm gen:usecase <featureName> <useCaseName>");
  process.exit(1);
}

const basePath = path.join(process.cwd(), "src", "features", featureName);

if (!fs.existsSync(basePath)) {
  console.error(`❌ Feature ${featureName} does not exist`);
  process.exit(1);
}

// ===== 1. HANDLER =====
const handlerPath = path.join(basePath, "api", `${useCaseName}.handler.ts`);
const handlerContent = `// api/${useCaseName}.handler.ts
import { isErr } from "@core/result/result";
import { Context } from "hono";
import { ${capitalize(
  featureName
)}Context } from "../domain/${featureName}.context";
import { ${useCaseName}Service } from "../domain/${useCaseName}.service";
import { ${useCaseName}RequestSchema } from "./${useCaseName}.request";

export const ${useCaseName}Handler = async (c: Context, context: ${capitalize(
  featureName
)}Context) => {
  const body = await c.req.json();
  const parseResult = ${useCaseName}RequestSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json({ error: "Invalid request", details: parseResult.error }, 400);
  }

  const result = await ${useCaseName}Service(parseResult.data, context);

  if (isErr(result)) {
    return c.json({ error: result.error }, 400);
  }

  return c.json(result.value);
};
`;

fs.writeFileSync(handlerPath, handlerContent);

// ===== 2. REQUEST SCHEMA =====
const requestPath = path.join(basePath, "api", `${useCaseName}.request.ts`);
const requestContent = `// api/${useCaseName}.request.ts
import { z } from "zod";

export const ${useCaseName}RequestSchema = z.object({
  // TODO: Define your request validation schema
});

export type ${capitalize(
  useCaseName
)}Request = z.infer<typeof ${useCaseName}RequestSchema>;
`;

fs.writeFileSync(requestPath, requestContent);

// ===== 3. SERVICE =====
const servicePath = path.join(basePath, "domain", `${useCaseName}.service.ts`);
const serviceContent = `// domain/${useCaseName}.service.ts
import { err, ok, Result } from "@core/result/result";
import { ${capitalize(featureName)}Context } from "./${featureName}.context";

export const ${useCaseName}Service = async (
  data: any,
  context: ${capitalize(featureName)}Context
): Promise<Result<any, string>> => {
  try {
    // TODO: Implement ${useCaseName} business logic
    const result = await context.repository.someMethod(data);
    
    if (!result) {
      return err("${useCaseName} operation failed");
    }

    return ok(result);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Unknown error");
  }
};
`;

fs.writeFileSync(servicePath, serviceContent);

// ===== 4. TEST =====
const testPath = path.join(basePath, "domain", `${useCaseName}.test.ts`);
const testContent = `// domain/${useCaseName}.test.ts
import { isErr, isOk } from "@core/result/result";
import { ${capitalize(
  featureName
)}Repository } from "../infra/repositories/${featureName}.repository";
import { describe, expect, it, vi } from "vitest";
import { ${capitalize(featureName)}Context } from "./${featureName}.context";
import { ${useCaseName}Service } from "./${useCaseName}.service";

describe("${useCaseName}Service", () => {
  it("should work correctly with valid data", async () => {
    const mockRepo: Partial<${capitalize(featureName)}Repository> = {
      someMethod: vi.fn().mockResolvedValue({ id: "test" }),
    };
    const context: ${capitalize(
      featureName
    )}Context = { repository: mockRepo as ${capitalize(
  featureName
)}Repository };

    const result = await ${useCaseName}Service({ test: "data" }, context);

    expect(isOk(result)).toBe(true);
  });

  it("should handle repository errors", async () => {
    const mockRepo: Partial<${capitalize(featureName)}Repository> = {
      someMethod: vi.fn().mockRejectedValue(new Error("DB error")),
    };
    const context: ${capitalize(
      featureName
    )}Context = { repository: mockRepo as ${capitalize(
  featureName
)}Repository };

    const result = await ${useCaseName}Service({ test: "data" }, context);

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBe("DB error");
    }
  });
});
`;

fs.writeFileSync(testPath, testContent);

console.log(`✅ Use case '${useCaseName}' created in feature '${featureName}'`);
console.log(`\n📁 Files created:`);
console.log(`├── api/${useCaseName}.handler.ts`);
console.log(`├── api/${useCaseName}.request.ts`);
console.log(`├── domain/${useCaseName}.service.ts`);
console.log(`└── domain/${useCaseName}.test.ts`);

console.log(`\n📝 Don't forget to:`);
console.log(`1. Add the route to ${featureName}.routes.ts:`);
console.log(
  `   router.post("/${useCaseName}", (c) => ${useCaseName}Handler(c, context));`
);
console.log(`2. Update the request schema with proper validation`);
console.log(`3. Implement the business logic in the service`);

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
