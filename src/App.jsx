import './App.css'
import Hero from "./components/Hero.jsx";
import Contact from "./components/Contact.jsx";
import Who from "./components/Who.jsx";
import Works from "./components/Works.jsx";
import {loadFull} from "tsparticles";
import {useCallback} from "react";
import Particles from "react-particles";
// import Navbar from "./components/Navbar.jsx";

function App() {
  const options = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          area: 200
        }
      },
      color: {
        value: ["#00d1ff", "#2fef32", "#fdcd00", "#ff3939"]
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 2
      },
      size: {
        value: { min: 1, max: 7 }
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: "out"
      }
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  // const navbarRef = useRef(null);

  return (
      <div className="app-container">
        {/*<Navbar ref={navbarRef}/>*/}
        <Particles options={options} init={particlesInit} className="particle-background"/>

        <div className="components-container">
          <Hero/>
          <Who/>
          <Works/>
          <Contact/>
        </div>

      </div>
  )
}

export default App
