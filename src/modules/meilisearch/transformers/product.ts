const prefix = `variant`

export const variantKeys = [
  "sku",
  "title",
  "upc",
  "ean",
  "mid_code",
  "hs_code",
  "options",
]

export const transformProduct = (product: any) => {
  let transformedProduct = { ...product } as Record<string, unknown>

  const initialObj = variantKeys.reduce((obj, key) => {
    obj[`${prefix}_${key}`] = []
    return obj
  }, {})
  initialObj[`${prefix}_options_value`] = []

  const flattenedVariantFields = product.variants.reduce((obj, variant) => {
    variantKeys.forEach((k) => {
      if (k === "options" && variant[k]) {
        const values = variant[k].map((option) => option.value)
        obj[`${prefix}_options_value`] =
          obj[`${prefix}_options_value`].concat(values)
        return
      }
      return variant[k] && obj[`${prefix}_${k}`].push(variant[k])
    })
    return obj
  }, initialObj)

  transformedProduct.type = product.type && product.type.value
  transformedProduct.collection_title =
    product.collection && product.collection.title
  transformedProduct.collection_handle =
    product.collection && product.collection.handle
  transformedProduct.tags = product.tags ? product.tags.map((t) => t.value) : []
  transformedProduct.categories = (product?.categories || []).map((c) => c.name)

  const prod = {
    ...transformedProduct,
    ...flattenedVariantFields,
  }

  delete prod.variants

  return prod
}
