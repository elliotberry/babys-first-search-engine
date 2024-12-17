import createFolderIfItDoesNotExist from "elliotisms/createFolderIfItDoesNotExist"
import fs from "fs"
import { EventEmitter } from "node:events"
import readline from "node:readline"
import winston from "winston"

// Read previous logs from the file
const readPreviousLogs = async (crawlId) => {
  const logFile = "./logs/logs.txt"
  const logs = []

  try {
    const fileStream = fs.createReadStream(logFile)
    const rl = readline.createInterface({
      crlfDelay: Infinity,
      input: fileStream
    })

    for await (const line of rl) {
      if (line.includes(crawlId)) {
        logs.push(line)
      }
    }
  } catch (error) {
    console.error("Error reading logs:", error)
  }

  return logs
}

export default readPreviousLogs