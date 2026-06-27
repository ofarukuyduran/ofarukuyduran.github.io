import { useRef, useEffect } from 'react';
import { CameraControls, Environment, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import Frame from './Frame';
import Room from './Room';
import Arrow from './Arrow';
import paintingsData from '../data/paintings.json';

export default function Scene() {
  const controlsRef = useRef();
  
  const ataturkTex = useTexture('/textures/portrait.png');
  const welcomeBoardTex = useTexture('/textures/welcome_board.png');

  useEffect(() => {
    if (controlsRef.current) {
      const camPos = new THREE.Vector3(0, 2.0, 8);
      const targetPos = new THREE.Vector3(0, 2.0, -5);
      const lookAt = targetPos.clone().sub(camPos).normalize().multiplyScalar(0.1).add(camPos);
      controlsRef.current.setLookAt(camPos.x, camPos.y, camPos.z, lookAt.x, lookAt.y, lookAt.z, false);
    }
  }, []);

  const navigateToRoom = async (targetZ) => {
    if (!controlsRef.current) return;
    
    const currentPos = new THREE.Vector3();
    controlsRef.current.getPosition(currentPos);
    
    const move = async (cx, cy, cz, tx, ty, tz) => {
      const c = new THREE.Vector3(cx, cy, cz);
      const t = new THREE.Vector3(tx, ty, tz);
      const look = t.clone().sub(c).normalize().multiplyScalar(0.1).add(c);
      await controlsRef.current.setLookAt(c.x, c.y, c.z, look.x, look.y, look.z, true);
    };

    if (currentPos.z > -10 && targetZ < -10) await move(-4, 2.0, -8, -4, 2.0, -12);
    if (currentPos.z > -30 && targetZ < -30) await move(4, 2.0, -28, 4, 2.0, -32);
    if (currentPos.z < -30 && targetZ > -30) await move(4, 2.0, -32, 4, 2.0, -28);
    if (currentPos.z < -10 && targetZ > -10) await move(-4, 2.0, -12, -4, 2.0, -8);
  };

  const handleFrameClick = async (position, rotation) => {
    if (controlsRef.current) {
      const targetZ = position[2];
      await navigateToRoom(targetZ);
      
      const offset = new THREE.Vector3(0, 0, 6);
      offset.applyEuler(new THREE.Euler(...rotation));
      
      const targetPos = new THREE.Vector3(...position);
      const camPos = targetPos.clone().add(offset);
      
      camPos.y = 2.0;
      targetPos.y = 2.0;

      const lookAt = targetPos.clone().sub(camPos).normalize().multiplyScalar(0.1).add(camPos);

      await controlsRef.current.setLookAt(
        camPos.x, camPos.y, camPos.z,
        lookAt.x, lookAt.y, lookAt.z,
        true 
      );
    }
  };

  const handleFloorClick = async (roomPosition) => {
    if (controlsRef.current) {
      const targetZ = roomPosition[2];
      const currentPos = new THREE.Vector3();
      controlsRef.current.getPosition(currentPos);
      
      // Kameranın zaten hedeflenen odanın merkezinde olup olmadığını kontrol et
      const isAlreadyInRoom = Math.abs(currentPos.z - (targetZ + 6)) < 2;

      await navigateToRoom(targetZ);
      
      if (!isAlreadyInRoom) {
        // Odaya dışarıdan giriliyorsa: Kamerayı hafifçe tabloya yönelt
        const camPos = new THREE.Vector3(0, 2.0, targetZ + 6);
        const targetPos = new THREE.Vector3(6, 2.0, targetZ);
        const lookAt = targetPos.clone().sub(camPos).normalize().multiplyScalar(0.1).add(camPos);

        controlsRef.current.setLookAt(
          camPos.x, camPos.y, camPos.z,
          lookAt.x, lookAt.y, lookAt.z,
          true
        );
      } else {
        // Zaten odadaysak: Mevcut bakış açısını (head rotation) koruyarak sadece odayı ortala
        const camPos = new THREE.Vector3(0, 2.0, targetZ + 6);
        const currentTarget = new THREE.Vector3();
        controlsRef.current.getTarget(currentTarget);
        
        const dir = currentTarget.clone().sub(currentPos).normalize();
        const lookAt = dir.multiplyScalar(0.1).add(camPos);

        controlsRef.current.setLookAt(
          camPos.x, camPos.y, camPos.z,
          lookAt.x, lookAt.y, lookAt.z,
          true
        );
      }
    }
  };

  return (
    <>
      <CameraControls 
        ref={controlsRef} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2 + 0.1} 
        minDistance={0.1} 
        maxDistance={0.1} 
        mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 0 }} 
        touches={{ one: 32, two: 0 }} 
      />
      
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <Environment preset="city" />
      
      <Room position={[0, 0, 0]} hasFrontDoor={false} hasBackDoor={true} backDoorOffset={-4} upperColor="#cde3eb" lowerColor="#c29b70" onFloorClick={handleFloorClick} />
      <Room position={[0, 0, -20]} hasFrontDoor={true} frontDoorOffset={4} hasBackDoor={true} backDoorOffset={4} upperColor="#e2ebd8" lowerColor="#8a6b4e" onFloorClick={handleFloorClick} />
      <Room position={[0, 0, -40]} hasFrontDoor={true} frontDoorOffset={-4} hasBackDoor={false} upperColor="#fcf6bd" lowerColor="#9a9a9a" onFloorClick={handleFloorClick} />

      {/* Yönlendirme Okları (Tıklanabilir ve Her İki Yönde) */}
      <Arrow position={[-4, 0.05, -6]} rotation={[0, 0, 0]} onClick={() => handleFloorClick([0, 0, -20])} />
      <Arrow position={[4, 0.05, -26]} rotation={[0, 0, 0]} onClick={() => handleFloorClick([0, 0, -40])} />
      <Arrow position={[-4, 0.05, -14]} rotation={[0, Math.PI, 0]} onClick={() => handleFloorClick([0, 0, 0])} />
      <Arrow position={[4, 0.05, -34]} rotation={[0, Math.PI, 0]} onClick={() => handleFloorClick([0, 0, -20])} />

      {/* Atatürk Portresi */}
      <group position={[-4, 6.5, -9.9]}>
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[1.6, 2.1, 0.1]} />
          <meshStandardMaterial color="#4a2e00" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.4, 1.9]} />
          <meshStandardMaterial map={ataturkTex} roughness={0.5} />
        </mesh>
      </group>

      {/* Özel Hazırlanan Karşılama Panosu Görseli (Billboard) */}
      <group position={[4.5, 4.5, -9.9]}>
        {/* İnce Cam Çerçeve Arka Planı (Opsiyonel şıklık için görselin arkasında durur) */}
        <mesh position={[0, 0, -0.05]} castShadow>
          <boxGeometry args={[9.2, 3.7, 0.05]} />
          <meshPhysicalMaterial 
            color="#e6f7ff" 
            transmission={0.9} 
            opacity={1} 
            metalness={0.1} 
            roughness={0.1} 
            ior={1.5} 
            thickness={0.2} 
          />
        </mesh>

        {/* Sizin Hazırladığınız Tek Parça Yatay Görsel */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[9, 3.5]} />
          {/* Resmin ışıklardan etkilenip kararmaması için meshBasicMaterial kullanıyoruz */}
          <meshBasicMaterial map={welcomeBoardTex} transparent={true} />
        </mesh>
      </group>

      {paintingsData.map((painting) => (
        <Frame key={painting.id} data={painting} onClick={handleFrameClick} />
      ))}
    </>
  );
}
