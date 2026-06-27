import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

export default function Room({ 
  position, 
  hasFrontDoor, 
  hasBackDoor, 
  onFloorClick,
  upperColor = '#cde3eb',
  lowerColor = '#c29b70',
  frontDoorOffset = 0,
  backDoorOffset = 0
}) {
  const upperWallMat = <meshStandardMaterial color={upperColor} roughness={0.9} />;
  const lowerWallMat = <meshStandardMaterial color={lowerColor} roughness={0.8} />;
  const ceilingMat = <meshStandardMaterial color="#f8f9fa" roughness={1} />;
  
  const floorTex = useTexture('/textures/wood_floor.jpg');
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(4, 4);
  const floorMat = <meshStandardMaterial map={floorTex} roughness={0.6} color="#e0d4c8" />;

  const WallSegment = ({ position, rotation, width }) => (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.5, 0]} receiveShadow>
        <planeGeometry args={[width, 3]} />
        {lowerWallMat}
      </mesh>
      <mesh position={[0, 5.5, 0]} receiveShadow>
        <planeGeometry args={[width, 5]} />
        {upperWallMat}
      </mesh>
      <mesh position={[0, 3, 0.05]} receiveShadow castShadow>
        <boxGeometry args={[width, 0.1, 0.1]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
    </group>
  );

  const DoorWall = ({ offset, zPosition, rotation }) => {
    const doorLeftEdge = offset - 3;
    const doorRightEdge = offset + 3;
    const leftWidth = doorLeftEdge - (-10);
    const leftCenter = -10 + leftWidth / 2;
    const rightWidth = 10 - doorRightEdge;
    const rightCenter = doorRightEdge + rightWidth / 2;

    return (
      <group position={[0, 0, zPosition]} rotation={rotation}>
        {leftWidth > 0 && <WallSegment position={[leftCenter, 0, 0]} rotation={[0, 0, 0]} width={leftWidth} />}
        {rightWidth > 0 && <WallSegment position={[rightCenter, 0, 0]} rotation={[0, 0, 0]} width={rightWidth} />}
        <mesh position={[offset, 7, 0]} receiveShadow>
          <planeGeometry args={[6, 2]} />
          {upperWallMat}
        </mesh>
      </group>
    );
  };

  return (
    <group position={position}>
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          if (onFloorClick) onFloorClick(position);
        }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[20, 20]} />
        {floorMat}
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        {ceilingMat}
      </mesh>

      <WallSegment position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} width={20} />
      <WallSegment position={[10, 0, 0]} rotation={[0, -Math.PI / 2, 0]} width={20} />

      {hasBackDoor ? <DoorWall offset={backDoorOffset} zPosition={-10} rotation={[0, 0, 0]} /> : <WallSegment position={[0, 0, -10]} rotation={[0, 0, 0]} width={20} />}
      {hasFrontDoor ? <DoorWall offset={frontDoorOffset} zPosition={10} rotation={[0, Math.PI, 0]} /> : <WallSegment position={[0, 0, 10]} rotation={[0, Math.PI, 0]} width={20} />}
    </group>
  );
}
