import React from 'react'
import CheckoutForm from './Components/CheckoutForm'
import Dashboard from './Dashboard/Dashboard'
import Footer from './Footer/Footer'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import './App.css'

const App = () => {
  useScrollAnimation()
  
  return (
    <div>
        <CheckoutForm/>
        <Dashboard/>
        <Footer/>
    </div>
  )
}

export default App