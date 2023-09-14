import {Suspense, useEffect, useRef, useState} from "react";
import {Canvas} from "@react-three/fiber";
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
	const [meshSize, setMeshSize] = useState(2.5);
	const [decal] = useTexture([imgUrl]);
	const meshRef = useRef();

	useEffect(() => {
		const checkWindowWidth = () => {
			if (window.innerWidth >= 1200) {
				setMeshSize(2.5);
			} else if (window.innerWidth >= 900) {
				setMeshSize(2);
			} else {
				setMeshSize(1.75);
			}
		};

		checkWindowWidth();

		window.addEventListener('resize', checkWindowWidth);

		return () => {
			window.removeEventListener('resize', checkWindowWidth);
		};
	});

	return (
		<Float
			speed={1.75}
			rotationIntensity={0}
			floatIntensity={0}
		>
			<ambientLight intensity={0.5} />
			<directionalLight position={[0, 0, 0.05]} />
			<mesh
				castShadow
				receiveShadow
				scale={meshSize}
				ref={meshRef}>
				<icosahedronGeometry args={[1, 1]} />
				<meshStandardMaterial
					color='#ff4046'
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