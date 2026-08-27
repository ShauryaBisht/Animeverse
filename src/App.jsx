import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Land from './pages/Land'
import AiringNow from './pages/AiringNow'
import Top from './pages/Top'
import Watchlist from './pages/Watchlist'
import Auth from './pages/Auth'
import Search from './pages/Search'
import Anime from './pages/Anime'



function App() {
  


  return (
    <>
      <Routes>
        <Route path='' element={<Land />} />
        <Route path='/auth' element={<Auth />}></Route>
        <Route path='/airing' element={<AiringNow />} />
        <Route path="/anime/:id" element={<Anime />} />
        <Route path='/top' element={<Top />} />
        <Route path='/watchlist' element={<Watchlist />} />
        <Route path='/search' element={<Search />} />
      </Routes>
    </>
  )
}

export default App
