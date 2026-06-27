import { useState } from 'react';
import { Text, useTexture } from '@react-three/drei';

export default function Frame({ data, onClick }) {
  const [hovered, setHovered] = useState(false);
  const corkTex = useTexture('/textures/corkboard.png');

  return (
    <group position={data.position} rotation={data.rotation || [0, 0, 0]}>
      {/* Dış Ahşap Çerçeve */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3.4, 2.4, 0.1]} />
        <meshStandardMaterial color={hovered ? '#c2a578' : '#8b5a2b'} roughness={0.8} />
      </mesh>
      
      {/* İç Mantar Pano Yüzeyi */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[3.2, 2.2]} />
        <meshStandardMaterial map={corkTex} roughness={1} />
      </mesh>

      {/* Kağıt / Resim */}
      <mesh 
        position={[0, 0, 0.07]} 
        onClick={(e) => {
          e.stopPropagation();
          onClick(data.position, data.rotation);
        }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[2.8, 1.8]} />
        <meshStandardMaterial color="#f8f9fa" />
      </mesh>
      
      <Text
        position={[0, 0, 0.08]}
        fontSize={0.25}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        Öğrenci Çalışması {data.id}
      </Text>

      {/* Ana Resim Raptiyeleri */}
      <mesh position={[-1.3, 0.8, 0.08]}>
        <sphereGeometry args={[0.03]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh position={[1.3, 0.8, 0.08]}>
        <sphereGeometry args={[0.03]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* 3D Bilgi Panosu (İğnelenmiş Kağıt) */}
      {/* Bu artık HTML değil, 3 boyutlu dünyanın bir parçası! Duvar arkasından GÖRÜNMEZ! */}
      <group position={[2.4, -0.5, 0.07]}>
        <mesh castShadow>
          <planeGeometry args={[1.6, 1.2]} />
          <meshStandardMaterial color="#fffae6" roughness={0.9} />
        </mesh>
        
        <Text position={[0, 0.4, 0.01]} fontSize={0.16} color="#0077b6" anchorX="center" anchorY="middle" maxWidth={1.4} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf">
          {data.month}
        </Text>
        <Text position={[0, 0.1, 0.01]} fontSize={0.12} color="#333333" anchorX="center" anchorY="middle" maxWidth={1.4} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf">
          {data.activity}
        </Text>
        <Text position={[0, -0.3, 0.01]} fontSize={0.1} color="#666666" anchorX="center" anchorY="middle" maxWidth={1.4} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf">
          {data.names}
        </Text>

        {/* Bilgi Kağıdı Raptiyesi */}
        <mesh position={[0, 0.5, 0.02]}>
          <sphereGeometry args={[0.03]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </group>
    </group>
  );
}
