/**
 * KIRA-01 — REALISTIC 3D CYBERNETIC WEBGL COMPANION
 * Built with Three.js for Uzair Farooq Naikoo
 * 
 * High-End Features:
 * - Photorealistic PBR metallic clearcoat chassis & smoked glass visor
 * - Internal dual cybernetic optical camera eyes with aperture dilation & natural blink
 * - Rotating dual-gyro Arc Reactor & Ion Repulsor engine with dynamic plasma lighting
 * - Articulated mechanical arms & pointing kinematics
 * - Real-time 3D cursor gaze tracking & anti-gravity hover physics
 * - Full interactive right-side corner adjustability (drag-to-position + persistent localStorage)
 * - Click-to-spin acrobatic backflip
 */

import * as THREE from 'three';

export class CyberBuddy3D {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Robot Parts Hierarchy
    this.robotGroup = null;
    this.headGroup = null;
    this.visorGroup = null;
    this.eyeGroupLeft = null;
    this.eyeGroupRight = null;
    this.irisLeft = null;
    this.irisRight = null;
    this.pupilLeft = null;
    this.pupilRight = null;
    this.leftArm = null;
    this.leftForearm = null;
    this.rightArm = null;
    this.rightForearm = null;
    this.reactorCore = null;
    this.reactorRingOuter = null;
    this.reactorRingInner = null;
    this.thrusterNozzle = null;
    this.thrusterRing1 = null;
    this.thrusterRing2 = null;
    this.thrusterPlume = null;
    this.thrusterLight = null;
    this.coreLight = null;

    // DOM Elements for screen positioning
    this.companionEl = document.getElementById('cyber-buddy-companion');
    this.bubbleEl = document.getElementById('buddy-speech-bubble');

    // Tracking & Animation State
    this.targetMouse = { x: 0, y: 0 };
    this.currentMouse = { x: 0, y: 0 };
    this.isBlinking = false;
    this.blinkTimer = 0;
    this.nextBlinkTime = 3000;
    this.spinAngle = 0;
    this.isSpinning = false;
    this.isPointing = false;
    this.startTime = performance.now();
    this.lastTime = performance.now();

    // Corner Adjustability State
    this.isDragging = false;
    this.dragStartY = 0;
    this.dragStartX = 0;
    this.initialBottom = 25;
    this.initialRight = 25;

    this.init();
    this.initCornerAdjustability();
  }

  init() {
    const width = 140;
    const height = 160;

    try {
      // 1. Scene
      this.scene = new THREE.Scene();

      // 2. Camera with cinematic focal length
      this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      this.camera.position.set(0, 0.08, 3.5);

      // 3. High-performance WebGL Renderer with ACES ToneMapping & sRGB
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.35;
      if (THREE.SRGBColorSpace) {
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      }
      this.container.appendChild(this.renderer.domElement);

      // 4. Photorealistic Multi-Point Cinematic Lighting
      const ambientLight = new THREE.AmbientLight(0xd0e4ff, 1.2);
      this.scene.add(ambientLight);

      // Main Sun / Key Light with crisp specular
      const dirKeyLight = new THREE.DirectionalLight(0xffffff, 2.8);
      dirKeyLight.position.set(3, 5, 4);
      this.scene.add(dirKeyLight);

      // Intense Cyber Cyan Rim Light (Left flank)
      const cyanRim = new THREE.PointLight(0x00f0ff, 4.0, 10);
      cyanRim.position.set(-2.5, 1.2, -1.2);
      this.scene.add(cyanRim);

      // Fiery Crimson Accent Rim Light (Right flank)
      const crimsonRim = new THREE.PointLight(0xff1a38, 3.2, 9);
      crimsonRim.position.set(2.4, -0.8, 1.2);
      this.scene.add(crimsonRim);

      // Camera Headlight for metallic specular sheen
      const headLight = new THREE.PointLight(0x70a0ff, 1.5, 6);
      headLight.position.set(0, 0.5, 3.2);
      this.scene.add(headLight);

      // 5. Build Realistic 3D Mecha Robot Model
      this.buildRealisticRobot();

      // 6. Listeners for Interaction
      window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
      this.container.addEventListener('click', this.triggerSpin.bind(this));

      // 7. Start Animation Loop
      this.animate();
    } catch (err) {
      console.warn('WebGL initialization standby, rendering fallback:', err);
      this.renderFallback();
    }
  }

  buildRealisticRobot() {
    this.robotGroup = new THREE.Group();

    // ==========================================
    // 1. ADVANCED PBR MATERIALS
    // ==========================================
    // Deep Metallic Titanium Shell with automotive clearcoat
    const titaniumMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0f1522,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      reflectivity: 0.95
    });

    // Contrast Aerospace Ceramic Accent (Midnight Blue-Slate)
    const ceramicMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x182438,
      metalness: 0.65,
      roughness: 0.3,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2
    });

    // Dark Chrome Gunmetal Joints & Bearings
    const chromeJointMat = new THREE.MeshStandardMaterial({
      color: 0x3a4556,
      metalness: 0.95,
      roughness: 0.25
    });

    // Smoked Curved Glass Visor (Transparent, refractive)
    const glassVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0x020814,
      metalness: 0.12,
      roughness: 0.05,
      transmission: 0.6,
      ior: 1.48,
      transparent: true,
      opacity: 0.88
    });

    // Luminous Cyber Cyan (Glow Emissive)
    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.4,
      roughness: 0.2
    });

    // Luminous Crimson Core (Glow Emissive)
    const crimsonCoreMat = new THREE.MeshStandardMaterial({
      color: 0xff1a38,
      emissive: 0xff1a38,
      emissiveIntensity: 2.8,
      roughness: 0.15
    });

    // Dark Carbon Pupil
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x010308 });

    // ==========================================
    // 2. HEAD & HELMET ASSEMBLY
    // ==========================================
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.44, 0);

    // Aerodynamic Sculpted Helmet Dome
    const helmetGeo = new THREE.SphereGeometry(0.46, 32, 24);
    helmetGeo.scale(1.04, 0.96, 0.98);
    const helmetMesh = new THREE.Mesh(helmetGeo, titaniumMaterial);
    this.headGroup.add(helmetMesh);

    // Chiseled Helmet Crest / Ridge on Crown
    const crestGeo = new THREE.BoxGeometry(0.1, 0.14, 0.62);
    const crestMesh = new THREE.Mesh(crestGeo, ceramicMaterial);
    crestMesh.position.set(0, 0.38, 0.04);
    crestMesh.rotation.x = -0.15;
    this.headGroup.add(crestMesh);

    // Crest Cyan Status Light Strip
    const crestStripGeo = new THREE.BoxGeometry(0.02, 0.02, 0.4);
    const crestStrip = new THREE.Mesh(crestStripGeo, cyanGlowMat);
    crestStrip.position.set(0, 0.44, 0.04);
    crestStrip.rotation.x = -0.15;
    this.headGroup.add(crestStrip);

    // Forehead Micro LIDAR Sensor Gem
    const lidarGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.03, 16);
    lidarGeo.rotateX(Math.PI / 2);
    const lidarMesh = new THREE.Mesh(lidarGeo, cyanGlowMat);
    lidarMesh.position.set(0, 0.24, 0.45);
    this.headGroup.add(lidarMesh);

    // Recessed Visor Housing Socket
    const visorBezelGeo = new THREE.TorusGeometry(0.38, 0.03, 16, 32, Math.PI * 1.15);
    visorBezelGeo.rotateZ(Math.PI * 0.92);
    const visorBezel = new THREE.Mesh(visorBezelGeo, chromeJointMat);
    visorBezel.position.set(0, -0.01, 0.28);
    this.headGroup.add(visorBezel);

    // Curved Smoked Visor Glass Shield
    const visorGeo = new THREE.SphereGeometry(0.42, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.52);
    visorGeo.scale(0.97, 0.82, 0.96);
    visorGeo.rotateX(Math.PI * 0.30);
    const visorMesh = new THREE.Mesh(visorGeo, glassVisorMat);
    visorMesh.position.set(0, -0.01, 0.08);
    this.headGroup.add(visorMesh);

    // --- CYBERNETIC OPTIC CAMERA EYES (INSIDE VISOR) ---
    // Left Optical Assembly
    this.eyeGroupLeft = new THREE.Group();
    this.eyeGroupLeft.position.set(-0.165, 0.035, 0.38);

    const lensBezelGeo = new THREE.RingGeometry(0.05, 0.075, 24);
    const lensBezelL = new THREE.Mesh(lensBezelGeo, chromeJointMat);
    this.eyeGroupLeft.add(lensBezelL);

    const irisGeo = new THREE.CircleGeometry(0.055, 24);
    this.irisLeft = new THREE.Mesh(irisGeo, cyanGlowMat);
    this.eyeGroupLeft.add(this.irisLeft);

    const pupilGeo = new THREE.CircleGeometry(0.022, 16);
    this.pupilLeft = new THREE.Mesh(pupilGeo, pupilMat);
    this.pupilLeft.position.z = 0.005;
    this.eyeGroupLeft.add(this.pupilLeft);

    this.headGroup.add(this.eyeGroupLeft);

    // Right Optical Assembly
    this.eyeGroupRight = new THREE.Group();
    this.eyeGroupRight.position.set(0.165, 0.035, 0.38);

    const lensBezelR = new THREE.Mesh(lensBezelGeo, chromeJointMat);
    this.eyeGroupRight.add(lensBezelR);

    this.irisRight = new THREE.Mesh(irisGeo, cyanGlowMat);
    this.eyeGroupRight.add(this.irisRight);

    this.pupilRight = new THREE.Mesh(pupilGeo, pupilMat);
    this.pupilRight.position.z = 0.005;
    this.eyeGroupRight.add(this.pupilRight);

    this.headGroup.add(this.eyeGroupRight);

    // High-Tech Aerodynamic Antenna / Ear Sensor Fins
    const earFinGeo = new THREE.ConeGeometry(0.09, 0.32, 16);
    earFinGeo.scale(1, 1, 0.45); // Sleek flattened aerofoil blade

    const leftEar = new THREE.Mesh(earFinGeo, titaniumMaterial);
    leftEar.position.set(-0.43, 0.36, -0.04);
    leftEar.rotation.z = 0.38;
    leftEar.rotation.x = -0.12;

    const leftEarGlow = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.22, 0.02), cyanGlowMat);
    leftEarGlow.position.set(-0.02, 0.02, 0.02);
    leftEar.add(leftEarGlow);
    this.headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earFinGeo, titaniumMaterial);
    rightEar.position.set(0.43, 0.36, -0.04);
    rightEar.rotation.z = -0.38;
    rightEar.rotation.x = -0.12;

    const rightEarGlow = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.22, 0.02), cyanGlowMat);
    rightEarGlow.position.set(0.02, 0.02, 0.02);
    rightEar.add(rightEarGlow);
    this.headGroup.add(rightEar);

    // Segmented Cervical Neck Vertebrae
    const neckGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.16, 20);
    const neckMesh = new THREE.Mesh(neckGeo, chromeJointMat);
    neckMesh.position.set(0, -0.42, 0);
    this.headGroup.add(neckMesh);

    this.robotGroup.add(this.headGroup);

    // ==========================================
    // 3. TORSO CHASSIS & REACTOR CORE
    // ==========================================
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.22, 0);

    // Upper Chest Armored Chassis
    const chestGeo = new THREE.CapsuleGeometry(0.36, 0.32, 16, 24);
    chestGeo.scale(1.08, 1, 0.88);
    const chestMesh = new THREE.Mesh(chestGeo, titaniumMaterial);
    torsoGroup.add(chestMesh);

    // Vented Heat Exchanger Louvers on upper chest
    for (let i = 0; i < 3; i++) {
      const ventGeo = new THREE.BoxGeometry(0.24 - i * 0.04, 0.018, 0.02);
      const ventMesh = new THREE.Mesh(ventGeo, ceramicMaterial);
      ventMesh.position.set(0, 0.16 - i * 0.045, 0.31);
      torsoGroup.add(ventMesh);
    }

    // --- PULSING ARC REACTOR CORE ---
    const reactorHousingGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.04, 28);
    reactorHousingGeo.rotateX(Math.PI / 2);
    const reactorHousing = new THREE.Mesh(reactorHousingGeo, chromeJointMat);
    reactorHousing.position.set(0, -0.08, 0.33);
    torsoGroup.add(reactorHousing);

    // Rotating Outer Energy Gyro Ring
    const ringOuterGeo = new THREE.TorusGeometry(0.095, 0.012, 12, 24);
    this.reactorRingOuter = new THREE.Mesh(ringOuterGeo, cyanGlowMat);
    this.reactorRingOuter.position.set(0, -0.08, 0.35);
    torsoGroup.add(this.reactorRingOuter);

    // Counter-Rotating Inner Energy Ring
    const ringInnerGeo = new THREE.TorusGeometry(0.06, 0.009, 12, 20);
    this.reactorRingInner = new THREE.Mesh(ringInnerGeo, cyanGlowMat);
    this.reactorRingInner.position.set(0, -0.08, 0.355);
    torsoGroup.add(this.reactorRingInner);

    // Central Crimson Reactor Heart
    const coreHeartGeo = new THREE.SphereGeometry(0.045, 20, 20);
    this.reactorCore = new THREE.Mesh(coreHeartGeo, crimsonCoreMat);
    this.reactorCore.position.set(0, -0.08, 0.36);
    torsoGroup.add(this.reactorCore);

    // Dynamic Point Light emitted by reactor
    this.coreLight = new THREE.PointLight(0xff1a38, 1.8, 2.5);
    this.coreLight.position.set(0, -0.08, 0.42);
    torsoGroup.add(this.coreLight);

    // ==========================================
    // 4. ARTICULATED CYBERNETIC ARMS
    // ==========================================
    // --- LEFT ARM (POINTING GESTURE CAPABLE) ---
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.44, 0.08, 0);

    // Shoulder Pauldron Guard
    const shoulderGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const lShoulder = new THREE.Mesh(shoulderGeo, ceramicMaterial);
    this.leftArm.add(lShoulder);

    // Upper Bicep Actuator
    const upperArmGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.26, 16);
    const upperArm = new THREE.Mesh(upperArmGeo, titaniumMaterial);
    upperArm.position.set(-0.06, -0.14, 0);
    upperArm.rotation.z = 0.32;
    this.leftArm.add(upperArm);

    // Elbow Hinge Servo
    const elbowGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.09, 16);
    elbowGeo.rotateX(Math.PI / 2);
    const elbow = new THREE.Mesh(elbowGeo, chromeJointMat);
    elbow.position.set(-0.12, -0.26, 0);
    this.leftArm.add(elbow);

    // Forearm & Articulated Hand
    this.leftForearm = new THREE.Group();
    this.leftForearm.position.set(-0.12, -0.26, 0);

    const forearmGeo = new THREE.CylinderGeometry(0.052, 0.046, 0.22, 16);
    const forearm = new THREE.Mesh(forearmGeo, titaniumMaterial);
    forearm.position.set(0, -0.1, 0);
    this.leftForearm.add(forearm);

    // Forearm Cyan Telemetry Conduit Line
    const conduitGeo = new THREE.BoxGeometry(0.015, 0.16, 0.015);
    const conduit = new THREE.Mesh(conduitGeo, cyanGlowMat);
    conduit.position.set(-0.04, -0.1, 0.035);
    this.leftForearm.add(conduit);

    // Hand Metacarpal Palm
    const palmGeo = new THREE.BoxGeometry(0.08, 0.07, 0.04);
    const palm = new THREE.Mesh(palmGeo, chromeJointMat);
    palm.position.set(0, -0.23, 0);
    this.leftForearm.add(palm);

    // Articulated Index Pointing Finger
    const fingerGeo = new THREE.CylinderGeometry(0.016, 0.012, 0.15, 10);
    fingerGeo.rotateZ(Math.PI / 2);
    const finger = new THREE.Mesh(fingerGeo, cyanGlowMat);
    finger.position.set(-0.09, -0.23, 0.04);
    this.leftForearm.add(finger);

    this.leftArm.add(this.leftForearm);
    torsoGroup.add(this.leftArm);

    // --- RIGHT ARM ---
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.44, 0.08, 0);

    const rShoulder = new THREE.Mesh(shoulderGeo, ceramicMaterial);
    this.rightArm.add(rShoulder);

    const rUpperArm = new THREE.Mesh(upperArmGeo, titaniumMaterial);
    rUpperArm.position.set(0.06, -0.14, 0);
    rUpperArm.rotation.z = -0.32;
    this.rightArm.add(rUpperArm);

    const rElbow = new THREE.Mesh(elbowGeo, chromeJointMat);
    rElbow.position.set(0.12, -0.26, 0);
    this.rightArm.add(rElbow);

    this.rightForearm = new THREE.Group();
    this.rightForearm.position.set(0.12, -0.26, 0);

    const rForearm = new THREE.Mesh(forearmGeo, titaniumMaterial);
    rForearm.position.set(0, -0.1, 0);
    this.rightForearm.add(rForearm);

    const rPalm = new THREE.Mesh(palmGeo, chromeJointMat);
    rPalm.position.set(0, -0.23, 0);
    this.rightForearm.add(rPalm);

    this.rightArm.add(this.rightForearm);
    torsoGroup.add(this.rightArm);

    // ==========================================
    // 5. ION REPULSOR THRUSTER ENGINE (BASE)
    // ==========================================
    const thrusterGroup = new THREE.Group();
    thrusterGroup.position.set(0, -0.38, 0);

    // Conical Nozzle Bell Housing
    const nozzleGeo = new THREE.ConeGeometry(0.24, 0.16, 24, 1, true);
    nozzleGeo.rotateX(Math.PI);
    this.thrusterNozzle = new THREE.Mesh(nozzleGeo, titaniumMaterial);
    thrusterGroup.add(this.thrusterNozzle);

    // Outer Ion Accelerator Ring
    const ionRingGeo1 = new THREE.TorusGeometry(0.25, 0.024, 16, 32);
    ionRingGeo1.rotateX(Math.PI / 2);
    this.thrusterRing1 = new THREE.Mesh(ionRingGeo1, cyanGlowMat);
    this.thrusterRing1.position.set(0, -0.1, 0);
    thrusterGroup.add(this.thrusterRing1);

    // Inner Counter-Rotating Repulsor Ring
    const ionRingGeo2 = new THREE.TorusGeometry(0.16, 0.018, 14, 28);
    ionRingGeo2.rotateX(Math.PI / 2);
    this.thrusterRing2 = new THREE.Mesh(ionRingGeo2, cyanGlowMat);
    this.thrusterRing2.position.set(0, -0.14, 0);
    thrusterGroup.add(this.thrusterRing2);

    // Glowing Plasma Exhaust Plume Cone
    const plumeGeo = new THREE.ConeGeometry(0.14, 0.26, 20);
    plumeGeo.rotateX(Math.PI);
    const plumeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.65
    });
    this.thrusterPlume = new THREE.Mesh(plumeGeo, plumeMat);
    this.thrusterPlume.position.set(0, -0.22, 0);
    thrusterGroup.add(this.thrusterPlume);

    // Ion Engine Point Light
    this.thrusterLight = new THREE.PointLight(0x00f0ff, 2.5, 3.2);
    this.thrusterLight.position.set(0, -0.25, 0);
    thrusterGroup.add(this.thrusterLight);

    torsoGroup.add(thrusterGroup);
    this.robotGroup.add(torsoGroup);

    this.scene.add(this.robotGroup);
  }

  // ==========================================
  // CORNER ADJUSTABILITY & DRAGGING LOGIC
  // ==========================================
  initCornerAdjustability() {
    if (!this.companionEl) return;

    // Load saved position from localStorage if exists
    const savedBottom = localStorage.getItem('kira_companion_bottom');
    const savedRight = localStorage.getItem('kira_companion_right');

    if (savedBottom !== null && savedRight !== null) {
      this.companionEl.style.bottom = `${savedBottom}px`;
      this.companionEl.style.right = `${savedRight}px`;
    }

    // Create / inject drag adjustment handle and park button if not present
    let adjustGrip = document.getElementById('buddy-adjust-grip');
    if (!adjustGrip) {
      adjustGrip = document.createElement('div');
      adjustGrip.id = 'buddy-adjust-grip';
      adjustGrip.className = 'buddy-adjust-grip';
      adjustGrip.title = 'Drag to adjust position in corner';
      adjustGrip.setAttribute('aria-label', 'Drag to adjust companion position');
      adjustGrip.innerHTML = `
        <span class="grip-dots">⋮⋮</span>
        <span class="grip-text">ADJUST</span>
        <button type="button" class="btn-dock-corner" id="btn-dock-corner" title="Reset / Dock in corner">⤓</button>
      `;
      this.companionEl.prepend(adjustGrip);
    }

    // Attach Drag Listeners (Mouse & Touch)
    const onDragStart = (e) => {
      // Don't drag if clicking buttons
      if (e.target.closest('#btn-dock-corner') || e.target.closest('#btn-bubble-minimize')) return;

      this.isDragging = true;
      this.companionEl.classList.add('is-dragging');

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const rect = this.companionEl.getBoundingClientRect();
      this.dragStartX = clientX;
      this.dragStartY = clientY;
      this.initialBottom = window.innerHeight - rect.bottom;
      this.initialRight = window.innerWidth - rect.right;

      document.addEventListener('mousemove', onDragMove, { passive: false });
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('touchmove', onDragMove, { passive: false });
      document.addEventListener('touchend', onDragEnd);
    };

    const onDragMove = (e) => {
      if (!this.isDragging) return;
      if (e.cancelable) e.preventDefault();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = this.dragStartX - clientX;
      const deltaY = this.dragStartY - clientY;

      // Safe bounds: stay along the right half, avoid overflowing top/bottom
      const maxBottom = window.innerHeight - 190;
      const minBottom = 15;
      const maxRight = Math.min(window.innerWidth - 150, 320);
      const minRight = 10;

      const newBottom = Math.max(minBottom, Math.min(maxBottom, this.initialBottom + deltaY));
      const newRight = Math.max(minRight, Math.min(maxRight, this.initialRight + deltaX));

      this.companionEl.style.bottom = `${newBottom.toFixed(0)}px`;
      this.companionEl.style.right = `${newRight.toFixed(0)}px`;
    };

    const onDragEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.companionEl.classList.remove('is-dragging');

      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchmove', onDragMove);
      document.removeEventListener('touchend', onDragEnd);

      // Persist user adjusted coordinates
      const rect = this.companionEl.getBoundingClientRect();
      const currentBottom = Math.round(window.innerHeight - rect.bottom);
      const currentRight = Math.round(window.innerWidth - rect.right);

      localStorage.setItem('kira_companion_bottom', currentBottom);
      localStorage.setItem('kira_companion_right', currentRight);
    };

    adjustGrip.addEventListener('mousedown', onDragStart);
    adjustGrip.addEventListener('touchstart', onDragStart, { passive: true });

    // Dock button resets to bottom-right corner
    const dockBtn = document.getElementById('btn-dock-corner');
    if (dockBtn) {
      dockBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.companionEl.style.bottom = '25px';
        this.companionEl.style.right = '25px';
        localStorage.setItem('kira_companion_bottom', 25);
        localStorage.setItem('kira_companion_right', 25);
      });
    }
  }

  onMouseMove(e) {
    this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  setPointing(active) {
    this.isPointing = active;
  }

  triggerSpin() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.spinAngle = 0;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const now = performance.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    const time = (now - this.startTime) / 1000;

    // 1. Smooth Spring Cursor Physics
    this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.08;
    this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.08;

    // 2. Realistic Anti-Gravity Hover (Lissajous curve bobbing)
    const hoverY = Math.sin(time * 2.4) * 0.065;
    const hoverTilt = Math.cos(time * 1.8) * 0.03;
    if (this.robotGroup) {
      this.robotGroup.position.y = hoverY;
      this.robotGroup.rotation.z = hoverTilt;
    }

    // 3. 3D Head & Torso LookAt Cursor Tracking
    const lookLimitX = 0.52;
    const lookLimitY = 0.38;
    const targetRotY = this.currentMouse.x * lookLimitX;
    const targetRotX = -this.currentMouse.y * lookLimitY;

    if (this.headGroup) {
      this.headGroup.rotation.y = THREE.MathUtils.lerp(this.headGroup.rotation.y, targetRotY * 1.35, 0.12);
      this.headGroup.rotation.x = THREE.MathUtils.lerp(this.headGroup.rotation.x, targetRotX * 1.15, 0.12);
      this.headGroup.rotation.z = -this.currentMouse.x * 0.14; // Organic head tilt!
    }

    // Pupils micro-track cursor inside lenses
    if (this.pupilLeft && this.pupilRight) {
      const pupilShiftX = this.currentMouse.x * 0.012;
      const pupilShiftY = this.currentMouse.y * 0.010;
      this.pupilLeft.position.x = pupilShiftX;
      this.pupilLeft.position.y = pupilShiftY;
      this.pupilRight.position.x = pupilShiftX;
      this.pupilRight.position.y = pupilShiftY;
    }

    // Subtle Torso tracking
    if (this.robotGroup) {
      this.robotGroup.rotation.y = THREE.MathUtils.lerp(this.robotGroup.rotation.y, targetRotY * 0.5, 0.08);
      this.robotGroup.rotation.x = THREE.MathUtils.lerp(this.robotGroup.rotation.x, targetRotX * 0.35, 0.08);
    }

    // 4. Subtle Companion micro-glide without drifting into page content
    if (this.companionEl && !this.isDragging && !this.companionEl._isScrolling) {
      const subtleGlideX = Math.max(-14, Math.min(10, (this.currentMouse.x - 0.4) * 18));
      const subtleGlideY = Math.max(-10, Math.min(10, (-this.currentMouse.y - 0.4) * 14));
      const bankTilt = Math.max(-5, Math.min(5, (this.targetMouse.x - this.currentMouse.x) * 8));

      this.companionOffsetX += (subtleGlideX - this.companionOffsetX) * 0.08;
      this.companionOffsetY += (subtleGlideY - this.companionOffsetY) * 0.08;

      this.companionEl.style.transform = `translate3d(${this.companionOffsetX.toFixed(1)}px, ${this.companionOffsetY.toFixed(1)}px, 0px) rotate(${bankTilt.toFixed(1)}deg)`;
    }

    // 5. Spin Acrobatics (360° backflip on click)
    if (this.isSpinning) {
      this.spinAngle += delta * 12;
      this.robotGroup.rotation.y += this.spinAngle;
      if (this.spinAngle >= Math.PI * 2) {
        this.isSpinning = false;
        this.spinAngle = 0;
      }
    }

    // 6. Pointing Arm Articulation
    if (this.leftArm) {
      const targetArmAngle = this.isPointing ? -0.85 : 0;
      this.leftArm.rotation.z = THREE.MathUtils.lerp(this.leftArm.rotation.z, targetArmAngle, 0.12);
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, this.isPointing ? 0.75 : 0, 0.12);
    }

    // 7. Natural Eye Blinking & Aperture Kinematics
    this.blinkTimer += delta * 1000;
    if (this.blinkTimer > this.nextBlinkTime) {
      this.isBlinking = true;
      if (this.irisLeft && this.irisRight) {
        this.irisLeft.scale.y = 0.08;
        this.irisRight.scale.y = 0.08;
      }

      if (this.blinkTimer > this.nextBlinkTime + 130) {
        if (this.irisLeft && this.irisRight) {
          this.irisLeft.scale.y = 1;
          this.irisRight.scale.y = 1;
        }
        this.isBlinking = false;
        this.blinkTimer = 0;
        this.nextBlinkTime = 2400 + Math.random() * 3200;
      }
    }

    // 8. Arc Reactor Gyro Dynamics & Core Pulsing
    if (this.reactorRingOuter) {
      this.reactorRingOuter.rotation.z = time * 2.2;
    }
    if (this.reactorRingInner) {
      this.reactorRingInner.rotation.z = -time * 3.4;
    }
    if (this.reactorCore) {
      const pulse = 0.85 + Math.sin(time * 5.5) * 0.22;
      this.reactorCore.scale.set(pulse, pulse, pulse);
      if (this.coreLight) {
        this.coreLight.intensity = 1.6 + Math.sin(time * 5.5) * 0.8;
      }
    }

    // 9. Ion Repulsor Thruster Dynamics
    if (this.thrusterRing1) {
      this.thrusterRing1.rotation.z = time * 3.5;
    }
    if (this.thrusterRing2) {
      this.thrusterRing2.rotation.z = -time * 4.8;
    }
    if (this.thrusterPlume) {
      const plumeScale = 0.8 + Math.sin(time * 12) * 0.25;
      this.thrusterPlume.scale.set(1, plumeScale, 1);
      if (this.thrusterLight) {
        this.thrusterLight.intensity = 2.2 + Math.sin(time * 12) * 0.7;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  renderFallback() {
    this.container.innerHTML = `
      <div class="fallback-buddy-droid">
        <div class="fallback-head">
          <div class="fallback-visor">
            <span class="fallback-eye eye-l"></span>
            <span class="fallback-eye eye-r"></span>
          </div>
        </div>
      </div>
    `;
  }
}
