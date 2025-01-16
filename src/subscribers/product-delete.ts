import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import MeilisearchModuleService from "../modules/meilisearch/service"

export default async function productDeleteHandler({
  event,
  container,
}: SubscriberArgs) {
  const { data: eventData } = event as { data: { id: string } }

  if (!eventData?.id) {
    return
  }

  const meilisearch = container.resolve<MeilisearchModuleService>("meilisearch")
  await meilisearch.deleteDocument("products", eventData.id)
}

export const config: SubscriberConfig = {
  event: ["product.deleted"],
}
