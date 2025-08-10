import type { Class } from "./types/Class";

// Usamos un mapa adicional para mantener la relación entre nombres y tokens
const providers = new Map();
const tokenRegistry = new Map<string, Symbol | Class<any>>();

// Función auxiliar para obtener un identificador estable
function getTokenId(token: Symbol | Class<any>): string {
  if (typeof token === "symbol") {
    return token.description ?? token.toString();
  } else if (typeof token === "function") {
    return token.name;
  }
  return token.toString();
}

export function provide<T extends Symbol | Class<any>>(
  token: T
): T extends Class<infer U> ? U : never {
  if (!token) throw new Error("Token is required");

  const tokenId = getTokenId(token);

  // Buscamos primero por la referencia exacta
  if (providers.has(token)) {
    return providers.get(token);
  }

  // Si no encontramos por referencia, intentamos buscar por el ID
  const registeredToken = tokenRegistry.get(tokenId);
  if (registeredToken && providers.has(registeredToken)) {
    return providers.get(registeredToken);
  }

  throw new Error(`Provider {${tokenId}} not registered`);
}

export function register<T>(token: Symbol | Class<any>, provider: T) {
  const tokenId = getTokenId(token);

  // Si ya existe un token con el mismo ID, usamos ese token registrado
  const existingToken = tokenRegistry.get(tokenId);
  if (existingToken) {
    providers.set(existingToken, provider);
    return existingToken;
  }

  // En caso contrario, registramos el nuevo token
  providers.set(token, provider);
  tokenRegistry.set(tokenId, token);
  if (provider && typeof (provider as any).onRegister === "function") {
    (provider as any).onRegister();
  }
  return token;
}

export function unregister(token: Symbol | Class<any>) {
  const tokenId = getTokenId(token);

  // Eliminamos por referencia directa
  if (providers.has(token)) {
    providers.delete(token);
  }

  // También eliminamos por ID si existe
  const registeredToken = tokenRegistry.get(tokenId);
  if (registeredToken && providers.has(registeredToken)) {
    providers.delete(registeredToken);
  }

  // Eliminamos la entrada del registro
  tokenRegistry.delete(tokenId);
}
