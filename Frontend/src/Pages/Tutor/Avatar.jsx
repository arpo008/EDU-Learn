import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment, OrbitControls } from "@react-three/drei"; 

const Model = ({ scene, animations, isTalking }) => {
    const { actions, names } = useAnimations(animations, scene);
    
    const jawBone = useRef(null);
    const mouthL = useRef(null);
    const mouthR = useRef(null);

    const baseRotations = useRef({ jaw: 0, mouthL: 0, mouthR: 0 });
    // 🌟 ঠোঁট আলাদা করার জন্য হাড়ের আসল পজিশন সেভ রাখছি
    const basePositions = useRef({ jawY: 0, jawZ: 0 });

    useEffect(() => {
        if (names.length > 0 && actions[names[0]]) {
            actions[names[0]].reset().fadeIn(0.5).play();
        }

        if (scene) {
            scene.traverse((child) => {
                if (child.isBone) {
                    const name = child.name;
                    if (name === "jaw_09") {
                        jawBone.current = child;
                        baseRotations.current.jaw = child.rotation.x;
                        basePositions.current.jawY = child.position.y;
                        basePositions.current.jawZ = child.position.z;
                    }
                    if (name === "mouth_l_015") {
                        mouthL.current = child;
                        baseRotations.current.mouthL = child.rotation.z;
                    }
                    if (name === "mouth_r_016") {
                        mouthR.current = child;
                        baseRotations.current.mouthR = child.rotation.z;
                    }
                }
            });
            console.log("🎯 EduLearn Tutor Bones Synchronized!");
        }

        return () => {
            if (names.length > 0 && actions[names[0]]) {
                actions[names[0]].fadeOut(0.5);
            }
        };
    }, [scene, actions, names]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        if (isTalking) {
            // Natural speech pattern
            const jawTalk =
                Math.abs(Math.sin(t * 8)) * 0.18 +
                Math.abs(Math.sin(t * 3)) * 0.08 +
                Math.abs(Math.sin(t * 15)) * 0.05;

            if (jawBone.current) {
                // ১. চোয়াল ঘোরানো
                jawBone.current.rotation.x = baseRotations.current.jaw + jawTalk;
                // 🌟 ২. মাস্টার হ্যাক: চোয়ালের হাড়কে জোর করে নিচের দিকে টেনে নামানো 
                // (0.02 ভ্যালুটা বাড়ালে/কমালে মুখ আরও বেশি/কম ফাঁক হবে)
                jawBone.current.position.y = basePositions.current.jawY - (jawTalk * 0.02);
            }

            const lipMove = Math.sin(t * 6) * 0.04 + Math.sin(t * 11) * 0.02;

            if (mouthL.current) {
                mouthL.current.rotation.z = baseRotations.current.mouthL + lipMove;
            }
            if (mouthR.current) {
                mouthR.current.rotation.z = baseRotations.current.mouthR - lipMove;
            }

        } else {
            // Reset mouth smoothly
            if (jawBone.current) {
                jawBone.current.rotation.x = baseRotations.current.jaw;
                // 🌟 পজিশন আগের জায়গায় ফেরত নেওয়া
                jawBone.current.position.y = basePositions.current.jawY;
            }
            if (mouthL.current) {
                mouthL.current.rotation.z = baseRotations.current.mouthL;
            }
            if (mouthR.current) {
                mouthR.current.rotation.z = baseRotations.current.mouthR;
            }
        }
    });

    return (
        <primitive 
            object={scene}
            scale={0.015}
            position={[0, -0.5, 0]}
            rotation={[0, 0, 0]}
        />
    );
};



const Avatar = ({ isTalking }) => {

    const { scene, animations } = useGLTF("/teacher2.glb");

    return (

        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0 pointer-events-auto">

            <Canvas camera={{ position: [0, 1.8, 4], fov: 40 }}>

                <ambientLight intensity={1.5} />

                <spotLight
                    position={[10, 10, 10]}
                    angle={0.2}
                    penumbra={1}
                    intensity={2}
                />

                <Environment preset="city" />

                <Suspense fallback={null}>

                    <Model
                        scene={scene}
                        animations={animations}
                        isTalking={isTalking}
                    />

                </Suspense>

                <OrbitControls 
                    makeDefault
                    target={[0, 1.2, 0]}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.5}
                />

            </Canvas>

        </div>

    );

};

export default Avatar;