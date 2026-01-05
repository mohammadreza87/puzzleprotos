import { useEffect, useMemo, useState } from 'react';
import { useGLTF, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useColoringStore, COLORING_PALETTE } from '../hooks/useColoringState';

/**
 * Color mapping based on mesh name patterns
 * 1=Red, 2=Orange, 3=Yellow, 4=Green, 5=Blue, 6=Purple, 7=Pink, 8=Brown
 */
const getColorForMeshName = (name) => {
  const lowerName = name.toLowerCase();

  // Trees, leaves, foliage, grass → Green (4)
  if (lowerName.includes('tree') || lowerName.includes('leaf') || lowerName.includes('leaves') ||
      lowerName.includes('foliage') || lowerName.includes('bush') || lowerName.includes('plant') ||
      lowerName.includes('grass') || lowerName.includes('vegetation') || lowerName.includes('fern') ||
      lowerName.includes('moss') || lowerName.includes('vine') || lowerName.includes('hedge') ||
      lowerName.includes('shrub') || lowerName.includes('canopy')) {
    return 4; // Green
  }

  // Trunk, wood, bark, logs, branches → Brown (8)
  if (lowerName.includes('trunk') || lowerName.includes('wood') || lowerName.includes('bark') ||
      lowerName.includes('log') || lowerName.includes('branch') || lowerName.includes('stump') ||
      lowerName.includes('timber') || lowerName.includes('plank') || lowerName.includes('fence') ||
      lowerName.includes('bridge') || lowerName.includes('dock') || lowerName.includes('pier') ||
      lowerName.includes('cabin') || lowerName.includes('hut') || lowerName.includes('house') ||
      lowerName.includes('roof') || lowerName.includes('door') || lowerName.includes('sign')) {
    return 8; // Brown
  }

  // Water, pond, lake, river, swamp water → Blue (5)
  if (lowerName.includes('water') || lowerName.includes('pond') || lowerName.includes('lake') ||
      lowerName.includes('river') || lowerName.includes('stream') || lowerName.includes('ocean') ||
      lowerName.includes('sea') || lowerName.includes('wave') || lowerName.includes('puddle') ||
      lowerName.includes('splash') || lowerName.includes('liquid') || lowerName.includes('swamp')) {
    return 5; // Blue
  }

  // Ground, dirt, mud, terrain, island, land → Brown (8) or Yellow (3) for sand
  if (lowerName.includes('sand') || lowerName.includes('beach') || lowerName.includes('desert')) {
    return 3; // Yellow
  }
  if (lowerName.includes('ground') || lowerName.includes('dirt') || lowerName.includes('mud') ||
      lowerName.includes('terrain') || lowerName.includes('land') || lowerName.includes('island') ||
      lowerName.includes('floor') || lowerName.includes('path') || lowerName.includes('road') ||
      lowerName.includes('earth') || lowerName.includes('soil')) {
    return 8; // Brown
  }

  // Rock, stone, boulder, cliff → Purple (6) - for variety
  if (lowerName.includes('rock') || lowerName.includes('stone') || lowerName.includes('boulder') ||
      lowerName.includes('cliff') || lowerName.includes('mountain') || lowerName.includes('pebble') ||
      lowerName.includes('cave') || lowerName.includes('mineral')) {
    return 6; // Purple
  }

  // Flowers → various colors
  if (lowerName.includes('flower') || lowerName.includes('petal') || lowerName.includes('blossom') ||
      lowerName.includes('bloom') || lowerName.includes('rose')) {
    return 7; // Pink
  }

  // Mushroom, fungi → Red (1) or Orange (2)
  if (lowerName.includes('mushroom') || lowerName.includes('fungi') || lowerName.includes('toadstool')) {
    return 1; // Red
  }

  // Fruit, berry → Red (1) or Orange (2)
  if (lowerName.includes('fruit') || lowerName.includes('berry') || lowerName.includes('apple')) {
    return 1; // Red
  }
  if (lowerName.includes('orange') || lowerName.includes('pumpkin') || lowerName.includes('carrot')) {
    return 2; // Orange
  }

  // Sun, light, glow → Yellow (3)
  if (lowerName.includes('sun') || lowerName.includes('light') || lowerName.includes('glow') ||
      lowerName.includes('lantern') || lowerName.includes('lamp') || lowerName.includes('fire') ||
      lowerName.includes('flame') || lowerName.includes('torch')) {
    return 3; // Yellow
  }

  // Sky, cloud → Blue (5)
  if (lowerName.includes('sky') || lowerName.includes('cloud')) {
    return 5; // Blue
  }

  // Animals - various colors
  if (lowerName.includes('frog') || lowerName.includes('lizard') || lowerName.includes('snake') ||
      lowerName.includes('turtle') || lowerName.includes('alligator') || lowerName.includes('crocodile')) {
    return 4; // Green
  }
  if (lowerName.includes('bird') || lowerName.includes('butterfly') || lowerName.includes('dragonfly')) {
    return 5; // Blue
  }

  // Lily pad, cattail → Green (4)
  if (lowerName.includes('lily') || lowerName.includes('cattail') || lowerName.includes('reed') ||
      lowerName.includes('pad')) {
    return 4; // Green
  }

  // Default: cycle through remaining colors based on hash
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 8) + 1;
};

/**
 * Loads a full GLB model and makes each mesh colorable
 */
export const FullGLBModel = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  const [meshes, setMeshes] = useState([]);
  const { regionColors, selectedColor, colorRegion, setTotalRegions } = useColoringStore();

  // Extract all meshes from the scene
  useEffect(() => {
    const foundMeshes = [];
    let colorIndex = 1;

    scene.traverse((child) => {
      if (child.isMesh) {
        // Assign expected color based on mesh name for realistic coloring
        const meshName = child.name || `mesh_${colorIndex}`;
        const expectedColor = getColorForMeshName(meshName);
        foundMeshes.push({
          id: meshName,
          mesh: child,
          expectedColor,
        });
        colorIndex++;
      }
    });

    setMeshes(foundMeshes);
    setTotalRegions(foundMeshes.length);
  }, [scene, setTotalRegions]);

  return (
    <group>
      {meshes.map((item) => (
        <ColorableMesh
          key={item.id}
          meshData={item}
          regionColors={regionColors}
          selectedColor={selectedColor}
          colorRegion={colorRegion}
        />
      ))}
    </group>
  );
};

/**
 * Individual colorable mesh
 */
const ColorableMesh = ({ meshData, regionColors, selectedColor, colorRegion }) => {
  const [hovered, setHovered] = useState(false);
  const [wrongColor, setWrongColor] = useState(false);

  const { id, mesh, expectedColor } = meshData;
  const isColored = regionColors[id] !== undefined;
  const currentColor = isColored
    ? COLORING_PALETTE[regionColors[id]].color
    : '#888888';

  // Clone geometry and create new material
  const clonedGeometry = useMemo(() => mesh.geometry.clone(), [mesh]);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentColor),
      metalness: 0.1,
      roughness: 0.6,
    });
  }, []);

  // Update material color
  useEffect(() => {
    const color = wrongColor ? '#ff0000' : currentColor;
    material.color.set(color);

    if (hovered && !isColored) {
      material.emissive.set(COLORING_PALETTE[selectedColor].color);
      material.emissiveIntensity = 0.4;
    } else {
      material.emissive.set('#000000');
      material.emissiveIntensity = 0;
    }
  }, [material, wrongColor, currentColor, hovered, isColored, selectedColor]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isColored) {
      const success = colorRegion(id, expectedColor);
      if (!success) {
        setWrongColor(true);
        setTimeout(() => setWrongColor(false), 300);
      }
    }
  };

  // Get world position and matrix from original mesh
  const position = useMemo(() => {
    const pos = new THREE.Vector3();
    mesh.getWorldPosition(pos);
    return pos.toArray();
  }, [mesh]);

  const rotation = useMemo(() => {
    const rot = new THREE.Euler();
    mesh.getWorldQuaternion(new THREE.Quaternion()).setFromEuler(rot);
    return [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z];
  }, [mesh]);

  const scale = useMemo(() => {
    const scl = new THREE.Vector3();
    mesh.getWorldScale(scl);
    return scl.toArray();
  }, [mesh]);

  // Calculate center of bounding box for label placement
  const labelPosition = useMemo(() => {
    const box = new THREE.Box3().setFromObject(mesh);
    const center = new THREE.Vector3();
    box.getCenter(center);
    return center;
  }, [mesh]);

  return (
    <group>
      <mesh
        geometry={clonedGeometry}
        material={material}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!isColored) {
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      />

      {/* Number label - only show on hover */}
      {!isColored && hovered && (
        <Billboard position={[labelPosition.x, labelPosition.y + 0.5, labelPosition.z]} follow={true}>
          <Text
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#000000"
            fontWeight="bold"
          >
            {expectedColor}
          </Text>
        </Billboard>
      )}
    </group>
  );
};

export default FullGLBModel;
