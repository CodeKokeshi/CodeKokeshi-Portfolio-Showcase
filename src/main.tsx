import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Timeline from './Timeline.tsx'
import RelationshipGraph from './RelationshipGraph.tsx'

// Simple hash-based router
function Router() {
  const [route, setRoute] = useState(window.location.hash || '#/')

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === '#/timeline') {
    return <Timeline />
  }
  if (route === '#/relationships') {
    return <RelationshipGraph />
  }
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
