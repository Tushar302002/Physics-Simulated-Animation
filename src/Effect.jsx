import {
    EffectComposer,
    Pixelation,
    Vignette,
    BrightnessContrast,
    ChromaticAberration,
    Scanline,
    Grid,
    DotScreen,
    Noise,
    Glitch,
    GodRays,
  } from "@react-three/postprocessing";
  import { BlendFunction } from "postprocessing";
  import { useFrame } from "@react-three/fiber";
  import { useRef, forwardRef, useEffect } from "react";
  
  const Effect = forwardRef((props, ref) => {
  
    return (
      <EffectComposer>
        {/* <Pixelation granularity={10} /> */}
        {/* <Vignette
          offset={0.2}
          darkness={1.2}
          eskill={false}
          blendFunction={BlendFunction.NORMAL}
        /> */}
        {/* <ChromaticAberration offset={[0.02, 0.02]} /> */}
        {/* <Grid scale={0.25} lineWidth={0.1} /> */}
        {/* <DotScreen scale={0.1} angle={Math.PI * 0.25} /> */}
        <Noise />
        {/* <Glitch delay={[1.5, 3.5]} duration={[1, 10]} strength={[3, 10.0]} /> */}
      </EffectComposer>
    );
  });
  
  export default Effect;
  