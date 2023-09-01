import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Testimonial} from "./components/Testimonial.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/*<Testimonial index={2}/>*/}
        <App/>
    </React.StrictMode>
);
