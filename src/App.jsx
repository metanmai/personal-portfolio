import './App.css'
import Hero from "./components/Hero.jsx";
import Contact from "./components/Contact.jsx";
import Who from "./components/Who.jsx";
import Works from "./components/Works.jsx";
import {loadFull} from "tsparticles";
import {useCallback} from "react";
import Particles from "react-particles";

function App() {
  const options = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          area: 800
        }
      },
      color: {
        value: ["#090909", "#535353", "#a0a0a0", "#ffffff"]
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 2
      },
      size: {
        value: { min: 1, max: 12 }
      },
      move: {
        enable: true,
        speed: 2.5,
        direction: "none",
        random: true,
        straight: false,
        outModes: "out"
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab"
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 1
          }
        },
      }
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
      <div className="app-container">
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
