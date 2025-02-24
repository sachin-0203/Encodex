import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import { ThemeProvider } from './Context/ThemeContext'


function App() {
  return (
    <>
        <Header/>
          <Outlet />
        <Footer />
    </>
  )
}

export default App
