import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Scene from './components/Scene';

function App() {
  const [showGuide, setShowGuide] = useState(true);
  const [guideText, setGuideText] = useState("");
  const fullText = "Sergimizin görselleri arasında gezinmek için mouse ile tıklayabilir veya ekrana dokunabilirsiniz...";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setGuideText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowGuide(false), 5000); // 5 saniye bekle ve kaybol
      }
    }, 50); // daktilo yazım hızı (ms)
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Canvas shadows camera={{ position: [0, 2.0, 8], fov: 60 }}>
        <color attach="background" args={['#caf0f8']} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <Loader />
      
      {/* Animasyonlu Daktilo Bilgi Balonu */}
      {showGuide && (
        <div style={{
          position: 'absolute', 
          bottom: '20%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.8)', 
          color: '#ffffff', 
          padding: '15px 30px',
          borderRadius: '30px', 
          fontSize: '1.2rem', 
          zIndex: 1000,
          fontFamily: 'sans-serif', 
          textAlign: 'center', 
          maxWidth: '80%',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)', 
          pointerEvents: 'none'
        }}>
          {guideText}
        </div>
      )}

      {/* Tıklama Rehberi (Alt Orta) */}
      <div className="ui-overlay">
        <span className="ui-text-tr">Tablolara tıklayarak ilerleyin</span>
        <span className="ui-text-en">Click on frames to move</span>
      </div>
    </>
  );
}

export default App;
