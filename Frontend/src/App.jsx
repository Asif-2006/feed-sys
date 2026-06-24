import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CreatePost from "./pages/CreatePost";
import Feed from "./pages/Feed";
import Header from "./pages/Header";


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Feed />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/create-post' element={<CreatePost />} />
        <Route path='/about' element={<h1>About Us</h1>} />
      </Routes>
    </Router>
  )
}



export default App