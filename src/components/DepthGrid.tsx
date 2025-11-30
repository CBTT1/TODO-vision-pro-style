import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export function DepthGrid() {
  const gridRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      gridRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <mesh ref={gridRef} position={[0, 0, -10]} rotation={[0, 0, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshBasicMaterial
        color="#bd93f9"
        wireframe
        opacity={0.15}
        transparent
      />
    </mesh>
  )
}

