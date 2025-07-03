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
import { MyContextProvider } from './Context/MyContextProvider';
import { ThemeProvider } from './Context/ThemeContext';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Setting } from './pages/Setting/Setting';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
      
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/guide' element={<Guide />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/profile' 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Route>

      <Route path='/Setting' 
        element={
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        } 
      />
      
      <Route path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />

          </ProtectedRoute>
        }
      />

    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="907532710684-9ehbdn45tkhmgtrcbkusljdshdq8rd8d.apps.googleusercontent.com">
      <AuthProvider>
        <MyContextProvider>
          <ThemeProvider>
            < RouterProvider router={router} />
          </ThemeProvider>
        </MyContextProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
