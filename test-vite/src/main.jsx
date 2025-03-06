import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App';
import Landing from './landing';
import Lorem from './Lorem';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Landing />} /> 
        </Route>
        <Route path="/lorem" element={<Lorem />}/>
      </Routes>
  </BrowserRouter>
  </StrictMode>,
)
