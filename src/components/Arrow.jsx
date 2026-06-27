import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Arrow({ position, rotation, onClick }) {
  const groupRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Okun baktığı yönde (Z ekseni) süzülme animasyonu
    groupRef.current.position.z = position[2] + Math.sin(time * 3) * 0.15;
    
    // Parlama efekti: Daha uzun süre yanık kalması ve daha belirgin/katı beyaz olması için
    // Opacity 0.7 ile 1.0 arasında gidip gelir. Yani hiçbir zaman tam sönmez.
    const opacity = 0.85 + Math.sin(time * 3) * 0.15;
    if (materialRef.current) materialRef.current.opacity = opacity;
  });

  // Tamamen zemine paralel, kusursuz 2D Ok Şekli (Shape)
  const shape = new THREE.Shape();
  shape.moveTo(-0.15, 0.6);   // Sol arka kuyruk
  shape.lineTo(0.15, 0.6);    // Sağ arka kuyruk
  shape.lineTo(0.15, -0.2);   // Sağ gövde sonu
  shape.lineTo(0.4, -0.2);    // Sağ üçgen ucu (kanat)
  shape.lineTo(0, -0.8);      // En uç nokta (Tip)
  shape.lineTo(-0.4, -0.2);   // Sol üçgen ucu (kanat)
  shape.lineTo(-0.15, -0.2);  // Sol gövde sonu
  shape.lineTo(-0.15, 0.6);   // Başlangıca dön

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        if(onClick) onClick();
      }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial 
          ref={materialRef} 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={1.5} 
          transparent 
          opacity={0.9} 
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
