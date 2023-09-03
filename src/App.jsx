import './App.css'
import Home from "./components/Home.jsx";
import Contact from "./components/Contact.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import {Testimonials} from "./components/Testimonials.jsx";
import NavBar from "./components/Navbar.jsx";
import {ParticlesBg} from "./components/Backgrounds/ParticlesBg.jsx";

function App() {

  return (
        <div className="app-container">
            <NavBar/>
            <div className="components-container">
                <Home id={`Home`}/>
                <Skills id={`Skills`}/>
                <Projects id={`Projects`}/>
                <Testimonials id={`Testimonials`}/>
                <Contact id={`Contact`}/>
            </div>
            <ParticlesBg/>
        </div>
  )
}

export default App;
