import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import { Suspense } from 'react'
import { DepthGrid } from './DepthGrid'
import { useTheme } from '../hooks/useTheme'

export function Scene3D() {
  const isDark = useTheme()
  
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
          <ambientLight intensity={isDark ? 0.2 : 0.6} />
          <pointLight position={[10, 10, 10]} intensity={isDark ? 0.3 : 0.8} color={isDark ? '#8b5cf6' : '#87ceeb'} />
          <pointLight position={[-10, -10, -10]} intensity={isDark ? 0.2 : 0.5} color={isDark ? '#4a148c' : '#b0e0e6'} />
          <Stars 
            radius={100} 
            depth={50} 
            count={isDark ? 5000 : 3000} 
            factor={4} 
            fade 
            speed={1} 
            saturation={isDark ? 0.3 : 0.6}
          />
          <DepthGrid isDark={isDark} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

