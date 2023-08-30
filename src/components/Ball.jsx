import {Suspense, useEffect, useRef} from "react";
import * as THREE from 'three';
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";
import CanvasLoader from "./Loader.jsx";
import PropTypes from "prop-types";

const Ball = ({imgUrl}) => {
	const [decal] = useTexture([imgUrl]);
	const groupRef = useRef();
	const speed = 0.005; // Rotation speed (adjust as needed)

	useEffect(() => {
    const group = groupRef.current;
    const axis = new THREE.Vector3(0.5, 0.5, 0);
    let rad = 0;
    const radIncrement = speed; // Radial increment based on speed

    const animate = () => {
		rad += speed;
      	group.rotation.y = rad; // Rotate the group
		// Render the scene and continue the animation loop
		requestAnimationFrame(animate);
    };
    animate();
	}, []);

	return (
		<Float speed={1.75} rotationIntensity={1} floatIntensity={2} ref={groupRef}>
			<ambientLight intensity={0.25} />
			<directionalLight position={[0, 0, 0.05]} />
			<mesh castShadow receiveShadow scale={2.75}>
				<icosahedronGeometry args={[1, 1]} />
				<meshStandardMaterial
					color='#fff8eb'
					polygonOffset
					polygonOffsetFactor={-5}
					flatShading
				/>
				<Decal
					position={[0, 0, 1]}
					rotation={[2 * Math.PI, 0, 6.25]}
					scale={1}
					map={decal}
					flatShading
				/>
			</mesh>
		</Float>
	);
};

const BallCanvas = ({ icon }) => {
  return (
      <Canvas
          frameloop='demand'
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls enableZoom={false} />
          <Ball imgUrl={icon} />
        </Suspense>

        <Preload all />
      </Canvas>
  );
};

Ball.propTypes = {
	imgUrl: PropTypes.string.isRequired
};

BallCanvas.propTypes = {
	icon: PropTypes.string.isRequired
};

export default BallCanvas;