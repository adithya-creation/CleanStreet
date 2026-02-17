import { useState } from 'react'
import './App.css'
import Navbar from './Pages/NavBar'
import Dashboard from './Pages/Dashboard'
import Footer from './Pages/Footer'

function App() {
  return (
    <>
      <Navbar/>
      <Dashboard/>
      <Footer/>
    </>
  )
}

export default App
