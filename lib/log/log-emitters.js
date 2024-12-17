import { EventEmitter } from "node:events"

// Create an event emitter for real-time updates
const logEmitters = new Map()
//in order to be served in realtime to the front-end, 
// we need to create an event emitter that will emit logs as they are created
const createLogEmitter = (crawlId) => {
  const emitter = new EventEmitter()
  logEmitters.set(crawlId, emitter)
  // Send previous logs
  // const previousLogs = await readPreviousLogs(crawlId);
  // for (const log of previousLogs) {
  //    const [timestamp, level, ...messageParts] = log.split(' - ');
  //    const message = messageParts.join(' - ');
  //    emitter.emit('log', { level: level.toLowerCase(), message, timestamp });
  //  }
  return emitter
}

const removeLogEmitter = (crawlId) => {
  logEmitters.delete(crawlId)
}

export { createLogEmitter, removeLogEmitter, logEmitters }