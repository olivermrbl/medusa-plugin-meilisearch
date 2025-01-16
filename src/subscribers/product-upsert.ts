import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import MeilisearchModuleService from "../modules/meilisearch/service"
import { productFields } from "./utils/product-fields"

export default async function productUpsertHandler({
  event,
  container,
}: SubscriberArgs) {
  const { data: eventData } = event as { data: { id: string } }

  const query = container.resolve("query")

  if (!eventData?.id) {
    return
  }

  const { data } = await query.graph({
    entity: "product",
    fields: productFields,
    filters: {
      id: eventData.id,
    },
  })

  const meilisearch = container.resolve<MeilisearchModuleService>("meilisearch")
  await meilisearch.addDocuments("products", data, "product")
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"],
}
