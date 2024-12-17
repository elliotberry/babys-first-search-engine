import { Client } from "@elastic/elasticsearch"
import dotenv from "dotenv"
import connectionUtilities from "./database/connection.js"
import webUtilities from "./database/web-utils.js"
import crawlUtils from "./database/crawl-utils.js"
import { log } from "./log.js"

dotenv.config()

if (!process.env.ELASTICSEARCH_NODE) {
  throw new Error("ELASTICSEARCH_NODE environment variable is required to know where to connect")
}

// Elasticsearch client setup
const esClient = new Client({ node: process.env.ELASTICSEARCH_NODE })

const handleError = (error, context) => {
  log.warn(`database error: ${context}: ${error.message}`)
}

const { checkConnection } = connectionUtilities(esClient, log)

//web utils factory creates functions for interacting with the web index
const { push, search, remove, update, urlExists } = webUtilities(
  esClient,
  log,
  handleError
)

//crawl utils factory creates functions for interacting with the crawl index
const { createCrawl, updateCrawl, getAllCrawlsWithDocuments, getCrawlById } =
  crawlUtils(esClient, log, handleError)

// Get total disk size
async function getTotalDiskSize() {
  try {
    const response = await esClient.cat.indices({
      bytes: "b", // Size in bytes
      format: "json"
    })

    const totalSize = response.body.reduce((accumulator, index) => {
      return accumulator + Number.parseInt(index["store.size"])
    }, 0)

    return totalSize
  } catch (error) {
    console.error("Error fetching indices:", error)
    throw error
  }
}

// Ensure index exists
const ensureIndexExists = async (index) => {
  try {
    const { body: exists } = await esClient.indices.exists({ index })
    if (!exists) {
      await esClient.indices.create({ index })
      log.info(`Index "${index}" created successfully`)
    }
  } catch (error) {
    log.info(`${index} index already exists; nice!`)
  }
}

// Ensure connection is healthy at startup
;(async () => {
  await checkConnection()
  await ensureIndexExists("web")
  await ensureIndexExists("crawls")
  console.log("database client startup complete")
})()

export {
  createCrawl,
  push,
  remove,
  search,
  update,
  updateCrawl,
  urlExists,
  getAllCrawlsWithDocuments,
  getCrawlById
}
