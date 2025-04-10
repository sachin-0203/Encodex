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
import Dashboard from './pages/Dashboard/Dashboard'
import AuthPage from './pages/AuthPage/AuthPage';
import MyContextProvider from './Context/MyContextProvider';
import { ThemeProvider } from './Context/ThemeContext';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
      
        <Route path='' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/guide' element={<Guide />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/profile' element={<Profile />} />
        
      </Route>
        <Route path='/AuthPage' element = {<AuthPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyContextProvider>
      <ThemeProvider>
        < RouterProvider router={router} />
      </ThemeProvider>
    </MyContextProvider>
  </StrictMode>,
)
