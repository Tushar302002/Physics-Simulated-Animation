import React, { useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useSpring } from "@react-spring/three";
import Menu from "./Menu";
import Portal from "./Portal";
import Effect from "./Effect";

function CameraAnimator({ active }) {
  const { camera } = useThree();

  useSpring({
    fov: active ? 75 : 45,
    position: active ? [10, 8, 12] : [0, 1, 15],
    onChange: (result) => {
      if (result.value.fov !== undefined) {
        camera.fov = result.value.fov;
        camera.updateProjectionMatrix();
      }
      if (result.value.position) {
        const [x, y, z] = result.value.position;
        camera.position.set(x, y, z);
      }
    },
  });

  return null; // we don’t render anything, just update camera
}

function App() {
  const [paused, setPaused] = useState(true);
  const [active, setActive] = useState(false);

  const togglePlayPause = () => setPaused((prev) => !prev);

  const handleRestart = () => {
    setPaused(true);
    setActive(false)
  };

  const handleActive = () => setActive(!active);

  return (
    <>
      <Menu
        paused={paused}
        handleRestart={handleRestart}
        togglePlayPause={togglePlayPause}
        active={active}
        handleActive={handleActive}
      />

      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 1, 15],
        }}
      >
        <Effect />
        {/* ✅ Animate the camera here */}
        <CameraAnimator active={active} />
        {/* Portal just handles the portal scene */}
        <Portal paused={paused} active={active} setActive={setActive} />
      </Canvas>
    </>
  );
}

export default App;
