import createFolderIfItDoesNotExist from "elliotisms/createFolderIfItDoesNotExist"
import {logEmitters, createLogEmitter, removeLogEmitter} from "./log/log-emitters.js"
import winston from "winston"
import { EventEmitter } from "node:events"

const logFolder = "./logs"
const init = async () => {
  await createFolderIfItDoesNotExist(logFolder)
}
init()

// Configure winston logger
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ level, message, timestamp }) =>
        `${timestamp} - ${level.toUpperCase()}: ${message}`
    )
  ),
  level: "info",
  transports: [
    new winston.transports.File({ filename: "./logs/logs.txt", level: "info" }),
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error"
    })
  ]
})

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}


class Logger {
  constructor(crawlId) {
    this.crawlId = crawlId
    this.emitter = new EventEmitter();
 
  }
  log(message) {
    this.info(message)
  }
  defaultLog(level, message) {
    let logMessage = this.makeMessage(message)
    logger.log(level, logMessage)
    this.emitLog(logMessage, level)
  }

  debug(message) {
    this.defaultLog("debug", message)
  }

  error(message) {
    this.defaultLog("error", message)
  }

  info(message) {
    this.defaultLog("info", message)
  }

  warn(message) {
    this.defaultLog("warn", message)
  }

  emitLog(message, level) {
  // const emitter = logEmitters.get(this.crawlId)
   // if (emitter) {
      this.emitter.emit("log", {
        level,
        message,
        timestamp: new Date().toISOString()
      })
   // }
  }

  makeMessage(message) {
    return `${this.crawlId ? `${this.crawlId} - ` : ""}${message}`
  }
}

//export unified logger
let defaultLogger = new Logger()
let defaultEmitter = defaultLogger.emitter
const log = defaultLogger.log.bind(defaultLogger)
log.info = defaultLogger.info.bind(defaultLogger)
log.warn = defaultLogger.warn.bind(defaultLogger)
log.error = defaultLogger.error.bind(defaultLogger)
log.debug = defaultLogger.debug.bind(defaultLogger)

export { createLogEmitter, log, removeLogEmitter, Logger, defaultEmitter }
