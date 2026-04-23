import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Land from './Components/Land'
import Home from './Components/Home'
import Top from './Components/Top'
import Watchlist from './Components/Watchlist'
import Header from './Components/Header'
import Search from './Components/Search'
import Anime from './Components/Anime'


function App() {
  


  return (
    <>
      <Routes>
        <Route path='' element={<Land />} />
        <Route path='/home' element={<Home  />} />
        <Route path="/title/:id" element={<Anime />} />
        <Route path='/top' element={<Top />} />
        <Route path='/watchlist' element={<Watchlist />} />
        <Route path='/search' element={<Search />} />
      </Routes>
    </>
  )
}

export default App
