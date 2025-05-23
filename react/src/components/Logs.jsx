import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "./enqueue/CrawlLog.scss"

const Logs = ({ notify }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [logMessages, setLogMessages] = useState([])
  const [eventSource, setEventSource] = useState(null)

  const startLogStream = (crawlId) => {
    const newEventSource = new EventSource(
      `http://localhost:3000/logs/stream/all`
    )
    setEventSource(newEventSource)
    setLogMessages([])

    newEventSource.onmessage = (event) => {
      const log = JSON.parse(event.data)
      setLogMessages((prevLogs) => [
        ...prevLogs,
        `${log.timestamp} - ${log.level.toUpperCase()}: ${log.message}`
      ])
    }

    newEventSource.onerror = () => {
      setLogMessages((prevLogs) => [
        ...prevLogs,
        "An error occurred with the log stream."
      ])
      newEventSource.close()
    }
  }

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [eventSource])

  return (
    <>
      <div>
        <div id={`log-container ${logMessages.length > 0 ? "active" : ""}`}>
          <h3 className="log-container-label">
            <span>Crawl Log</span>
          </h3>
          {logMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      </div>
    </>
  )
}

export default Logs
