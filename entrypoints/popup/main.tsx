import React from 'react'
import { createRoot } from 'react-dom/client'
import App from '../popup/App'

const root = document.createElement('div')
document.body.appendChild(root)
createRoot(root).render(<App />)