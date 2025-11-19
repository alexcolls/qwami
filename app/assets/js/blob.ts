// QWAMI Blob Visualization with Three.js
// Inspired by kwami.io animated blob

import * as THREE from 'three';

export class QwamiBlob {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private geometry: THREE.IcosahedronGeometry;
  private material: THREE.MeshPhysicalMaterial;
  private mesh: THREE.Mesh;
  private container: HTMLElement;
  private animationId: number | null = null;
  private time = 0;
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;

  // Current colors
  private currentColors = {
    primary: new THREE.Color(0x8B5CF6),
    secondary: new THREE.Color(0xEC4899),
    accent: new THREE.Color(0xF59E0B)
  };

  constructor(containerId: string) {
    const containerElement = document.getElementById(containerId);
    if (!containerElement) {
      throw new Error(`Container ${containerId} not found`);
    }
    this.container = containerElement;

    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // Create blob geometry - icosahedron for organic shape
    this.geometry = new THREE.IcosahedronGeometry(1.5, 64);
    
    // Store original positions for morphing
    const positionAttribute = this.geometry.getAttribute('position');
    const originalPositions = new Float32Array(positionAttribute.count * 3);
    for (let i = 0; i < positionAttribute.count; i++) {
      originalPositions[i * 3] = positionAttribute.getX(i);
      originalPositions[i * 3 + 1] = positionAttribute.getY(i);
      originalPositions[i * 3 + 2] = positionAttribute.getZ(i);
    }
    this.geometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));

    // Create material with beautiful glass-like effect
    this.material = new THREE.MeshPhysicalMaterial({
      color: this.currentColors.primary,
      emissive: this.currentColors.secondary,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      envMapIntensity: 1.5,
      transmission: 0.1,
      thickness: 0.5,
      ior: 1.5
    });

    // Create mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    // Add lights for beautiful reflections
    this.setupLights();

    // Setup event listeners
    this.setupEventListeners();

    // Start animation
    this.animate();
  }

  private setupLights() {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Key light from top-right
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 5, 5);
    this.scene.add(keyLight);

    // Fill light from bottom-left
    const fillLight = new THREE.DirectionalLight(this.currentColors.secondary.getHex(), 0.8);
    fillLight.position.set(-5, -3, 3);
    this.scene.add(fillLight);

    // Accent light from behind
    const accentLight = new THREE.DirectionalLight(this.currentColors.accent.getHex(), 0.6);
    accentLight.position.set(0, 0, -5);
    this.scene.add(accentLight);

    // Point light that follows the blob
    const pointLight = new THREE.PointLight(this.currentColors.primary.getHex(), 2, 10);
    pointLight.position.set(0, 2, 3);
    this.scene.add(pointLight);
  }

  private setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => this.onResize());

    // Handle mouse movement for interactive rotation
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Handle touch for mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.onMouseMove({
          clientX: touch.clientX,
          clientY: touch.clientY
        } as MouseEvent);
      }
    });
  }

  private onResize() {
    if (!this.container) return;

    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  private onMouseMove(event: MouseEvent) {
    // Normalize mouse position to -1 to 1 range
    this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private morphBlob() {
    const positionAttribute = this.geometry.getAttribute('position');
    const originalPosition = this.geometry.getAttribute('originalPosition') as THREE.BufferAttribute;
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const ox = originalPosition.getX(i);
      const oy = originalPosition.getY(i);
      const oz = originalPosition.getZ(i);

      // Create organic movement with multiple sine waves
      const morphFactor = 0.3;
      const freq1 = 0.8;
      const freq2 = 1.3;
      const freq3 = 0.5;

      const noise = 
        Math.sin(this.time * freq1 + ox * 2) * morphFactor +
        Math.sin(this.time * freq2 + oy * 3) * morphFactor * 0.7 +
        Math.sin(this.time * freq3 + oz * 1.5) * morphFactor * 0.5 +
        Math.sin(this.time * 0.6 + (ox + oy + oz)) * morphFactor * 0.3;

      // Apply noise to vertex position
      const scale = 1 + noise;
      positionAttribute.setXYZ(i, ox * scale, oy * scale, oz * scale);
    }

    positionAttribute.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    this.time += 0.005;

    // Smooth mouse following with lerp
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Rotate blob based on mouse position
    this.mesh.rotation.x = this.mouseY * 0.3 + Math.sin(this.time * 0.3) * 0.1;
    this.mesh.rotation.y = this.mouseX * 0.3 + this.time * 0.1;
    this.mesh.rotation.z = Math.sin(this.time * 0.2) * 0.05;

    // Apply blob morphing
    this.morphBlob();

    // Subtle floating animation
    this.mesh.position.y = Math.sin(this.time * 0.5) * 0.2;
    this.mesh.position.x = Math.cos(this.time * 0.3) * 0.1;

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  public updateColors(palette: { primary: string; secondary: string; accent: string }) {
    // Convert hex colors to THREE.Color
    this.currentColors.primary.setStyle(palette.primary);
    this.currentColors.secondary.setStyle(palette.secondary);
    this.currentColors.accent.setStyle(palette.accent);

    // Smoothly update material colors
    this.material.color.lerp(this.currentColors.primary, 0.1);
    this.material.emissive.lerp(this.currentColors.secondary, 0.1);

    // Update lights
    const lights = this.scene.children.filter((child): child is THREE.Light => child instanceof THREE.Light);
    if (lights.length >= 3) {
      const fillLight = lights[2] as THREE.DirectionalLight;
      const accentLight = lights[3] as THREE.DirectionalLight;
      const pointLight = lights[4] as THREE.PointLight;
      
      if (fillLight) fillLight.color.lerp(this.currentColors.secondary, 0.1);
      if (accentLight) accentLight.color.lerp(this.currentColors.accent, 0.1);
      if (pointLight) pointLight.color.lerp(this.currentColors.primary, 0.1);
    }
  }

  public destroy() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    // Dispose of Three.js resources
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();

    // Remove canvas from DOM
    if (this.container && this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}


