
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

const RippleShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColor: { value: new THREE.Color('#D9FF00') },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uColor;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // Pseudo-random noise for grain effect
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 st = vUv;
      float aspect = uResolution.x / uResolution.y;
      vec2 centeredUv = (st - 0.5) * vec2(aspect, 1.0);
      vec2 mouseUv = (uMouse - 0.5) * vec2(aspect, 1.0);

      // Main glowing sphere position (offset to the right center)
      vec2 spherePos = vec2(0.3, -0.05);
      float distFromSphere = length(centeredUv - spherePos);
      
      // Ripple logic: sin wave based on distance to mouse
      float distToMouse = length(centeredUv - mouseUv);
      float ripple = sin(distToMouse * 25.0 - uTime * 3.5) * exp(-distToMouse * 4.0) * 0.1;
      
      // Grainy effect
      float grain = noise(st * uTime * 0.1) * 0.15;
      
      // Sphere glow calculation
      float glowSize = 0.8;
      float glow = smoothstep(glowSize, 0.0, distFromSphere + ripple);
      glow = pow(glow, 1.8); // Adjust contrast
      
      vec3 bgColor = vec3(0.078, 0.078, 0.078); // #141414
      vec3 sphereColor = uColor * 0.85;
      
      // Combine sphere glow with grain and ripple interference
      vec3 finalColor = mix(bgColor, sphereColor + grain, glow);
      
      // Add subtle overall grain
      finalColor += grain * 0.25;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

const BackgroundPlane = ({ color }: { color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, viewport } = useThree();
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      ...RippleShaderMaterial,
      uniforms: {
        ...RippleShaderMaterial.uniforms,
        uColor: { value: new THREE.Color(color) },
        uResolution: { value: new THREE.Vector2(size.width, size.height) }
      }
    });
  }, [color]);

  useEffect(() => {
    material.uniforms.uResolution.value.set(size.width, size.height);
  }, [size]);

  useFrame((state) => {
    if (meshRef.current) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      // Smooth interpolation for mouse position
      material.uniforms.uMouse.value.lerp(
        new THREE.Vector2(
          (state.mouse.x + 1) / 2,
          (state.mouse.y + 1) / 2
        ),
        0.1
      );
    }
  });

  return (
    <Plane ref={meshRef} args={[viewport.width, viewport.height]} material={material} />
  );
};

export const HeroScene: React.FC<{ color?: string }> = ({ color = "#D9FF00" }) => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas 
        gl={{ antialias: true, alpha: true }} 
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]}
      >
        <BackgroundPlane color={color} />
      </Canvas>
    </div>
  );
};
