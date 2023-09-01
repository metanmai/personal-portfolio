import React from "react";
import './App.css'
import Hero from "./components/Hero.jsx";
import Contact from "./components/Contact.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import {Testimonials} from "./components/Testimonials.jsx";

function App() {
    // const { homeRef, skillsRef, projectsRef, contactRef } = useScrollContext();

  return (
      // <ScrollContext>
      <div className="app-container">
        <div className="components-container">
          <Hero/>
          <Skills/>
          <Projects/>
            <Testimonials/>
          <Contact/>
        </div>
      </div>
      // </ScrollContext>
  )
}

export default App
