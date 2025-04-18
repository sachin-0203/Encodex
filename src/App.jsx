import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'


function App() {
  return (
    <>
        <Header/>
        <Toaster position='bottom-right' richColors/>
        <Outlet />
        <Footer />
    </>
  )
}

export default App
