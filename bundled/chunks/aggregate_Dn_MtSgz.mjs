globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as sql } from "./schema_98e5FuKX.mjs";
function count(expression) {
  return sql`count(${sql.raw("*")})`.mapWith(Number);
}
export {
  count as c
};
