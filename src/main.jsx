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
import { EncodexPlus } from './components/Subscription/Plus';
import { Checkout } from './components/Subscription/Checkout';
import Dashboard from './pages/Dashboard/Dashboard'
import { MyContextProvider } from './Context/MyContextProvider';
import { ThemeProvider } from './Context/ThemeContext';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Setting } from './pages/Setting/Setting';
import TermsAndConditions from './pages/Term&Condition/Terms&Conditions';
import PrivacyPolicy from './pages/Term&Condition/PrivacyPolicy';
import CancellationRefundPolicy from './pages/Term&Condition/Refund';
import VerifyEmail from './Email/VerifyEmail';

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
        <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/refund-and-cancellation' element={<CancellationRefundPolicy />} />
        <Route path='/plus' element={<EncodexPlus />} />
        <Route path='checkout' element={<Checkout />} />

      </Route>

      <Route path='/Setting' 
        element={
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        } 
      />

      <Route path='/verify' element={<VerifyEmail />} />
      
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
