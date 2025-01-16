import { MedusaError } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/medusa"
import { MeiliSearch } from "meilisearch"
import { transformProduct } from "./transformers/product"

type DocumentSettings = {
  /**
   * The resource type and related settings to index in Meilisearch, e.g. "product"
   */
  [documentType: string]: {
    /**
     * The settings for the index
     */
    indexSettings: {
      /**
       * The attributes that are searchable in the index
       */
      searchableAttributes: string[]
      /**
       * The attributes that are displayed in the index
       */
      displayedAttributes: string[]
      /**
       * The attributes that are filterable in the index
       */
      filterableAttributes: string[]
    }

    /**
     * The primary key for the index, defaults to "id"
     */
    primaryKey?: string
    /**
     * The transformer function to transform the document to a format that Meilisearch can index
     */
    transformer: (document: any) => Promise<Record<string, unknown>>
  }
}

type MeilisearchOptions = {
  apiKey: string
  host: string
  settings: DocumentSettings
}

type InjectedDependencies = {
  logger: Logger
}

export default class MeilisearchModuleService {
  private client_: MeiliSearch
  private config_: MeilisearchOptions
  private logger: Logger

  constructor({ logger }: InjectedDependencies, options: MeilisearchOptions) {
    this.logger = logger

    if (!options.apiKey) {
      throw new Error("API key is required")
    }

    if (!options.host) {
      throw new Error("Host is required")
    }

    this.client_ = new MeiliSearch({
      host: options.host,
      apiKey: options.apiKey,
    })

    this.config_ = options
  }

  __hooks = {
    onApplicationStart: async () => {
      try {
        const { settings } = this.config_

        await Promise.all(
          Object.entries(settings || {}).map(async ([indexName, value]) => {
            return await this.updateSettings(indexName, value.indexSettings)
          })
        )

        this.logger.info("Meilisearch settings updated")
      } catch (error) {
        this.logger.error("Failed to update Meilisearch settings", error)
      }
    },
  }

  __joinerConfig() {
    return {
      serviceName: "meilisearch",
      primaryKeys: ["id"],
      linkableKeys: {},
      alias: [
        {
          name: "search_index",
        },
      ],
    }
  }

  async list(filter, config) {
    return await this.search(filter.index, filter.query, filter.options)
  }

  async createIndex(
    indexName: string,
    options: Record<string, unknown> = { primaryKey: "id" }
  ) {
    return await this.client_.createIndex(indexName, options)
  }

  getIndex(indexName: string) {
    return this.client_.index(indexName)
  }

  async addDocuments(indexName: string, documents: any, type: string) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)

    return await this.client_
      .index(indexName)
      .addDocuments(transformedDocuments)
  }

  async replaceDocuments(indexName: string, documents: any, type: string) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)

    return await this.client_
      .index(indexName)
      .updateDocuments(transformedDocuments)
  }

  async deleteDocument(indexName: string, documentId: string) {
    return await this.client_.index(indexName).deleteDocument(documentId)
  }

  async deleteAllDocuments(indexName: string) {
    return await this.client_.index(indexName).deleteAllDocuments()
  }

  async search(indexName: string, query: string, options: Record<string, any>) {
    const { paginationOptions, filter, additionalOptions } = options ?? {}

    try {
      return await this.client_.index(indexName).search(query, {
        filter,
        ...(paginationOptions ?? {}),
        ...(additionalOptions ?? {}),
      })
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Index ${indexName} not found. Create a new index manually or by adding documents, e.g. with a subscriber.`
      )
    }
  }

  async updateSettings(indexName: string, settings: Record<string, unknown>) {
    return await this.client_.index(indexName).updateSettings(settings)
  }

  getTransformedDocuments(type: string, documents: any[]) {
    if (!documents?.length) {
      return []
    }

    switch (type) {
      case "product":
        const productsTransformer =
          this.config_.settings?.[type]?.transformer ?? transformProduct

        return documents.map(productsTransformer)
      default:
        return documents
    }
  }
}
