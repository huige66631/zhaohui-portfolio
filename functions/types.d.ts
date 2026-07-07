interface D1ResultMeta {
  changes?: number;
}

interface D1RunResult {
  meta?: D1ResultMeta;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<D1RunResult>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface EventContext<Env = Record<string, unknown>, P extends string = string, Data = unknown> {
  request: Request;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
}
