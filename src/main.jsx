import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App';
import './index.css'
import Home from './components/Home/Home'
import About from './components/About/About'
import Guide from './components/Guide/Guide'
import Contact from './components/Contact/Contact'
import Profile from './components/Profile/Profile'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/guide' element={<Guide />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/profile' element={<Profile />} />
      
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    < RouterProvider router={router} />
  </StrictMode>,
)