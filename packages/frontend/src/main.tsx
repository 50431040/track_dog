import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './assets/css/reset.css'
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>,
)
