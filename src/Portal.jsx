import {
  useTexture,
  MeshPortalMaterial,
  RoundedBox,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { easing } from "maath";
import { useFrame } from "@react-three/fiber";
import Scene from "./Scene";


const Portal = ({ paused,active,setActive }) => {
  const meshPortalMaterialRef = useRef();

  useFrame((_, delta) => {
    easing.damp(
      meshPortalMaterialRef.current,
      "blend",
      active ? 1 : 0,
      0.2,
      delta
    );
  });


  const texture = useTexture("./textures/2.webp");

  return (
    <>
      <Stars />
      <RoundedBox
        args={[6, 8, 0.1]}
        radius={0.1}
      >
        <MeshPortalMaterial ref={meshPortalMaterialRef}>
          <Scene paused={paused} active={active} />

          <mesh>
            <sphereGeometry args={[500, 64, 64]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </>
  );
};

export default Portal;
