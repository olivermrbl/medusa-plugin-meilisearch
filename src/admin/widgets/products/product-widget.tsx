import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { useEffect, useState } from "react"
import { client } from "../../utils/meilisearch-client"
import { JsonViewSection } from "../../components/json-view"

const ProductWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [product, setProduct] = useState<any | null>(null)

  const search = async () => {
    const results = await client.index("products").search(data.title, {
      filter: [`id = ${data.id}`],
    })

    const { hits } = results

    setProduct(hits[0])
  }

  useEffect(() => {
    search()
  }, [data.title])

  return <JsonViewSection data={product} />
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductWidget
