import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import NavBar from "./components/Navbar.jsx";
import './index.css'
import {ParticlesBg} from "./components/ParticlesBg.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <NavBar/>
            <App/>
        <ParticlesBg/>
    </React.StrictMode>
)
