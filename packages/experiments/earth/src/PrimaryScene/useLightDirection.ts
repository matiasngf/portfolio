import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import { Vector3 } from "three";
import { useSpring } from "framer-motion";

const initialSunRotation = new Vector3(1, 0, 0).applyAxisAngle(
  new Vector3(0, 0, 1),
  Math.PI * (13 / 180)
);

export const useLightDirection = () => {
  const sunRotationSpring = useSpring(0, { velocity: 1, bounce: 0 });

  const [lightDirection, setLightDirection] = useState<Vector3>(
    initialSunRotation.clone()
  );

  const [config, setControls]: any = useControls(() => ({
    sunRotation: {
      label: "Sun rotation",
      value: 0,
      min: 0,
      max: 360,
      step: 0.1,
    },
    autoRotate: {
      label: "Auto rotate",
      value: false,
    },
  }));

  useFrame((_, delta) => {
    if (config.autoRotate) {
      setControls({ sunRotation: config.sunRotation + delta });
    }
  });

  useEffect(() => {
    sunRotationSpring.set(config.sunRotation);
  }, [config.sunRotation]);

  useEffect(() => {
    const unsuscribeRotation = sunRotationSpring.on("change", (v) => {
      const rotationAxis = new Vector3(0, 1, 0);
      const angle = Math.PI * (-v / 180);
      setLightDirection(
        initialSunRotation.clone().applyAxisAngle(rotationAxis, angle)
      );
    });
    return () => {
      unsuscribeRotation();
    };
  }, []);
  return lightDirection;
}