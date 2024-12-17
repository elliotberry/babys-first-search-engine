import { log } from "../log.js"
export function errorHandler(error, request, reply) {
  log.error(`Error: ${error.message}\n${error.stack}`)
  reply.status(500).send(`Error: ${error.message}\n${error.stack}`)
}

export function notFoundHandler(request, reply) {
  log.warn(`Not Found: ${request.url}`)
  reply.status(404).send("Not Found")
}
