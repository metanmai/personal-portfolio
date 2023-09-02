import {useCallback} from "react";
import {loadFull} from "tsparticles";
import Particles from "react-particles";

export const ParticlesBg = () => {
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
        value: ["#00d1ff", "#68fa47", "#fdcd00", "#ff3939", "ff7af4"]
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 2
      },
      size: {
        value: {min: 1, max: 7}
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
  return (
      <>
        <Particles options={options} init={particlesInit} className="particle-background"/>
      </>
  )
};