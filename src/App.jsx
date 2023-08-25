import './App.css'
import Hero from "./components/Hero.jsx";
import Contact from "./components/Contact.jsx";
import Who from "./components/Who.jsx";
import Works from "./components/Works.jsx";

function App() {

  return (
    <div className="app-container">
        <Hero />
        <Who />
        <Works />
        <Contact />
    </div>
  )
}

export default App
