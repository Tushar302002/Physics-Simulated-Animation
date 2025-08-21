import { a,useSpring } from "@react-spring/three";
import { OrbitControls, PositionalAudio, useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody, useRapier } from "@react-three/rapier";
import React, { useEffect, useRef } from "react";
import * as THREE from 'three'

function Ball({ paused }) {
  const ballTexture = useTexture("./textures/ballTexture.jpg");
  const ballRef = useRef(null);

  const { camera } = useThree();
  
 

//   ✅ Camera follow logic during animation is running
  useFrame(() => {
    if (ballRef.current) {
      const ballPos = ballRef.current.translation();
      if (ballPos) {
        // Only move the camera smoothly if not paused
        if (!paused) {
          camera.position.lerp(
            {
                x: ballPos.x + 4,
                y: ballPos.y + 12,
                z: ballPos.z + 14,
              },
            0.1
          );
        }
        camera.lookAt(ballPos.x, ballPos.y, ballPos.z);
      }
    }
  });



  return (
    <RigidBody
      colliders="ball"
      ref={ballRef}
      restitution={1}
      friction={0}
      linearDamping={0.5}
    // angularDamping={0.05}
    >
      <mesh position={[0, 8, 2]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="white" map={ballTexture} />
      </mesh>
    </RigidBody>
  );
}

function Wall() {
  const { world } = useRapier(); // ✅ inside Physics now
  const audioRef = useRef(null)

  function handleWallCollision() {
    audioRef.current.play()
    console.log("Wall hit, switching gravity!");
    world.gravity = { x: 0, y: -4.81, z: 0 }; // change gravity at runtime
  }

  return (
    <>
      <PositionalAudio ref={audioRef} url="./audios/ballStop.wav" distance={5} loop={false} />
      <RigidBody
        type="fixed"
        restitution={1}
        friction={0}
        onCollisionEnter={handleWallCollision}
      >
        <mesh position={[0, 8, -70]}>
          <boxGeometry args={[20, 20]} />
          <meshStandardMaterial color="skyblue" />
        </mesh>
      </RigidBody>
    </>
  );
}

function Floor() {
  const floorTexture = useTexture("./textures/floorBrownTexture.jpg");

  return (
    <RigidBody
      type="fixed"
      restitution={1}
      friction={0}
    >
      <mesh rotation-x={-Math.PI * 0.5} position-y={-2}>
        <boxGeometry args={[160, 160]} />
        <meshStandardMaterial color="white" map={floorTexture} />
      </mesh>
    </RigidBody>
  );
}

function Model({ paused,active }) {
  const model = useGLTF("./models/Baseball.glb");
  const modelRef=useRef(null)
  const { actions } = useAnimations(model.animations, model.scene);
  const actionRef = useRef(null);

  // ✅ Animate scale based on "active"
  const { scale } = useSpring({
    scale: active ? 6 : 1,
    // config: { tension: 150, friction: 20 },
  });

  // Setup once
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      actionRef.current = firstAction;

      // Configure
      firstAction.reset();
      firstAction.setLoop(THREE.LoopOnce, 1);
      firstAction.clampWhenFinished = true;
    }
  }, [actions]);

  useEffect(() => {
    const action = actionRef.current;
    if (!action) return;
  
    if (paused) {
      action.paused = true;
    } else {
      // Clip duration in seconds
      const clipDuration = action.getClip().duration;
  
      // Skip to 1.75s if it's the beginning
      if (action.time === 0) {
        action.reset().play();
        action.time = Math.min(1.75, clipDuration - 0.01); // avoid overshoot
      } 
      // If already finished, restart from 1.75s
      else if (action.time === clipDuration) {
        action.reset().play();
        action.time = Math.min(1.75, clipDuration - 0.01);
      }
  
      action.paused = false;
    }
  }, [paused]);

  return (
    <a.primitive
    ref={modelRef}
      object={model.scene}
      scale={scale}
      position={[0, -1, 5]}
      rotation-y={Math.PI}
    />
  );
}


export default function Scene({ paused,active }) {
  return (
    <group>
      <ambientLight />
      <directionalLight />
      <OrbitControls />

      <Model paused={paused} active={active} />
      <Physics gravity={[0, 0, -9.81]} paused={paused}>
        <Ball paused={paused} />
        <Floor />
        <Wall />
      </Physics>
    </group>
  );
}
