import { useState } from 'react'
import './App.css'
import LogIn from './components/LogIn'
import Footer from './components/Footer'
import LogInHeader from './components/LogInHeader'


function App() {

  return (
    <div> 
    <LogInHeader/>
    <LogIn/>
    <Footer/>
    </div>
   
   
  )
}

export default App