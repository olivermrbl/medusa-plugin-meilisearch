import { Meilisearch } from "meilisearch"

// @ts-ignore
console.log(import.meta.env)

const MEILISEARCH_HOST =
  // @ts-ignore
  import.meta.env?.VITE_MEDUSA_ADMIN_MEILISEARCH_HOST || "http://127.0.0.1:7700"
const MEILISEARCH_API_KEY =
  // @ts-ignore
  import.meta.env?.VITE_MEILISEARCH_API_KEY || ""

export const client = new Meilisearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_API_KEY,
})
