/**
 * KIRA-01 — REAL 3D CYBERNETIC WEBGL COMPANION
 * Built with Three.js for Uzair Farooq Naikoo
 * 
 * Features:
 * - Real-time 3D cursor following (head & torso lookAt physics)
 * - Visor display with animated blinking cyan eyes
 * - Articulated arms with pointing finger gesture
 * - Anti-gravity hover kinematics & pulsing reactor core
 * - Interactive 360° spin on click
 */

import * as THREE from 'three';

export class CyberBuddy3D {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Robot Parts
    this.robotGroup = null;
    this.headGroup = null;
    this.eyeLeft = null;
    this.eyeRight = null;
    this.leftArm = null;
    this.leftForearm = null;
    this.rightArm = null;
    this.reactorCore = null;
    this.thrusterRing = null;

    // DOM Companion Wrapper for screen gliding
    this.companionEl = document.getElementById('cyber-buddy-companion');
    this.companionOffsetX = 0;
    this.companionOffsetY = 0;

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

    this.init();
  }

  init() {
    const width = 130;
    const height = 150;

    try {
      // 1. Scene
      this.scene = new THREE.Scene();

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      this.camera.position.set(0, 0.05, 3.4);

      // 3. Renderer with transparency and anti-aliasing
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'default' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.2;
      this.container.appendChild(this.renderer.domElement);

      // 4. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      this.scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
      dirLight.position.set(3, 5, 4);
      this.scene.add(dirLight);

      const cyanRim = new THREE.PointLight(0x00f0ff, 3.5, 8);
      cyanRim.position.set(-2, 1, -1);
      this.scene.add(cyanRim);

      const redRim = new THREE.PointLight(0xff1a38, 2.8, 8);
      redRim.position.set(2, -1, 1);
      this.scene.add(redRim);

      // 5. Build 3D Robot Model
      this.buildRobot();

      // 6. Listeners
      window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
      this.container.addEventListener('click', this.triggerSpin.bind(this));

      // 7. Start render loop
      this.animate();
    } catch (err) {
      console.warn('WebGL initialization standby, rendering cute cyber fallback:', err);
      this.renderFallback();
    }
  }

  renderFallback() {
    this.container.innerHTML = `
      <div class="fallback-buddy-droid">
        <div class="fallback-head">
          <div class="fallback-visor">
            <span class="fallback-eye eye-l"></span>
            <span class="fallback-eye eye-r"></span>
          </div>
          <div class="fallback-ear ear-l"></div>
          <div class="fallback-ear ear-r"></div>
        </div>
        <div class="fallback-torso">
          <div class="fallback-core"></div>
        </div>
        <div class="fallback-thruster"></div>
      </div>
    `;
  }

  buildRobot() {
    this.robotGroup = new THREE.Group();

    // --- MATERIALS ---
    const armorMaterial = new THREE.MeshStandardMaterial({
      color: 0x181e2b,
      roughness: 0.25,
      metalness: 0.85
    });

    const visorMaterial = new THREE.MeshStandardMaterial({
      color: 0x020406,
      roughness: 0.08,
      metalness: 0.95
    });

    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff
    });

    const crimsonMaterial = new THREE.MeshStandardMaterial({
      color: 0xff1a38,
      emissive: 0xff1a38,
      emissiveIntensity: 0.9,
      roughness: 0.3
    });

    const jointMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d3748,
      roughness: 0.5,
      metalness: 0.6
    });

    // --- HEAD GROUP ---
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.45, 0);

    // Cute rounded cyber head
    const headGeo = new THREE.SphereGeometry(0.48, 32, 24);
    headGeo.scale(1.05, 0.95, 0.95);
    const headMesh = new THREE.Mesh(headGeo, armorMaterial);
    this.headGroup.add(headMesh);

    // Inset Curved Visor
    const visorGeo = new THREE.SphereGeometry(0.43, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.52);
    visorGeo.scale(0.98, 0.82, 0.98);
    visorGeo.rotateX(Math.PI * 0.28);
    const visorMesh = new THREE.Mesh(visorGeo, visorMaterial);
    visorMesh.position.set(0, -0.02, 0.07);
    this.headGroup.add(visorMesh);

    // Cute glowing cyan eyes (arcs)
    const eyeGeo = new THREE.CapsuleGeometry(0.065, 0.07, 12, 16);
    this.eyeLeft = new THREE.Mesh(eyeGeo, eyeMaterial);
    this.eyeLeft.position.set(-0.16, 0.04, 0.44);
    this.eyeLeft.rotation.z = 0.08;
    this.headGroup.add(this.eyeLeft);

    this.eyeRight = new THREE.Mesh(eyeGeo, eyeMaterial);
    this.eyeRight.position.set(0.16, 0.04, 0.44);
    this.eyeRight.rotation.z = -0.08;
    this.headGroup.add(this.eyeRight);

    // Cute Cyber Cat / Antenna Ears
    const earGeo = new THREE.ConeGeometry(0.12, 0.28, 16);
    const earMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.6 });

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.42, 0.38, -0.05);
    leftEar.rotation.z = 0.35;
    this.headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.42, 0.38, -0.05);
    rightEar.rotation.z = -0.35;
    this.headGroup.add(rightEar);

    this.robotGroup.add(this.headGroup);

    // --- TORSO ---
    const torsoGeo = new THREE.CapsuleGeometry(0.38, 0.35, 16, 24);
    const torsoMesh = new THREE.Mesh(torsoGeo, armorMaterial);
    torsoMesh.position.set(0, -0.22, 0);
    this.robotGroup.add(torsoMesh);

    // Pulsing Crimson Reactor Core on Chest
    const coreGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 24);
    coreGeo.rotateX(Math.PI / 2);
    this.reactorCore = new THREE.Mesh(coreGeo, crimsonMaterial);
    this.reactorCore.position.set(0, -0.16, 0.38);
    this.robotGroup.add(this.reactorCore);

    // --- ARTICULATED LEFT ARM (POINTING GESTURE) ---
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.46, -0.12, 0);

    const shoulderMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), jointMaterial);
    this.leftArm.add(shoulderMesh);

    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.28, 12), armorMaterial);
    upperArm.position.set(-0.06, -0.14, 0);
    upperArm.rotation.z = 0.35;
    this.leftArm.add(upperArm);

    // Forearm & Hand with Pointing Finger
    this.leftForearm = new THREE.Group();
    this.leftForearm.position.set(-0.12, -0.28, 0);

    const forearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 12), armorMaterial);
    forearmMesh.position.set(0, -0.1, 0);
    this.leftForearm.add(forearmMesh);

    // Hand & Pointing Finger
    const handMesh = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), jointMaterial);
    handMesh.position.set(0, -0.22, 0);
    this.leftForearm.add(handMesh);

    // Pointing finger pointing forward/left
    const fingerGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.14, 8);
    fingerGeo.rotateZ(Math.PI / 2);
    const finger = new THREE.Mesh(fingerGeo, earMat);
    finger.position.set(-0.1, -0.22, 0.04);
    this.leftForearm.add(finger);

    this.leftArm.add(this.leftForearm);
    this.robotGroup.add(this.leftArm);

    // --- RIGHT ARM ---
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.46, -0.12, 0);

    const rShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), jointMaterial);
    this.rightArm.add(rShoulder);

    const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.28, 12), armorMaterial);
    rUpperArm.position.set(0.06, -0.14, 0);
    rUpperArm.rotation.z = -0.35;
    this.rightArm.add(rUpperArm);

    const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), jointMaterial);
    rHand.position.set(0.12, -0.28, 0);
    this.rightArm.add(rHand);

    this.robotGroup.add(this.rightArm);

    // --- THRUSTER HOVER RING ---
    const ringGeo = new THREE.TorusGeometry(0.24, 0.04, 16, 32);
    ringGeo.rotateX(Math.PI / 2);
    this.thrusterRing = new THREE.Mesh(ringGeo, earMat);
    this.thrusterRing.position.set(0, -0.65, 0);
    this.robotGroup.add(this.thrusterRing);

    this.scene.add(this.robotGroup);
  }

  onMouseMove(e) {
    // Normalize coordinates [-1, 1]
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

    // 1. Smoothly interpolate mouse tracking (spring physics)
    this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.08;
    this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.08;

    // 2. Anti-gravity hover bobbing
    const hoverY = Math.sin(time * 2.8) * 0.08;
    this.robotGroup.position.y = hoverY;

    // 3. 3D Head & Torso LookAt Cursor
    const lookLimitX = 0.55;
    const lookLimitY = 0.4;
    const targetRotY = this.currentMouse.x * lookLimitX;
    const targetRotX = -this.currentMouse.y * lookLimitY;

    if (this.headGroup) {
      this.headGroup.rotation.y = THREE.MathUtils.lerp(this.headGroup.rotation.y, targetRotY * 1.3, 0.12);
      this.headGroup.rotation.x = THREE.MathUtils.lerp(this.headGroup.rotation.x, targetRotX * 1.1, 0.12);
      this.headGroup.rotation.z = -this.currentMouse.x * 0.12; // Cute head tilt!
    }

    if (this.robotGroup) {
      this.robotGroup.rotation.y = THREE.MathUtils.lerp(this.robotGroup.rotation.y, targetRotY * 0.6, 0.08);
      this.robotGroup.rotation.x = THREE.MathUtils.lerp(this.robotGroup.rotation.x, targetRotX * 0.4, 0.08);
    }

    // Dynamic companion flight glide toward cursor quadrant
    if (this.companionEl && !this.companionEl._isScrolling) {
      const targetGlideX = Math.max(-90, Math.min(25, (this.currentMouse.x - 0.35) * 75));
      const targetGlideY = Math.max(-50, Math.min(30, (-this.currentMouse.y - 0.35) * 50));
      const bankTilt = Math.max(-8, Math.min(8, (this.targetMouse.x - this.currentMouse.x) * 16));

      this.companionOffsetX += (targetGlideX - this.companionOffsetX) * 0.06;
      this.companionOffsetY += (targetGlideY - this.companionOffsetY) * 0.06;

      this.companionEl.style.transform = `translate3d(${this.companionOffsetX.toFixed(1)}px, ${this.companionOffsetY.toFixed(1)}px, 0px) rotate(${bankTilt.toFixed(1)}deg)`;
    }

    // 4. Spin interaction (360° backflip on click)
    if (this.isSpinning) {
      this.spinAngle += delta * 12;
      this.robotGroup.rotation.y += this.spinAngle;
      if (this.spinAngle >= Math.PI * 2) {
        this.isSpinning = false;
        this.spinAngle = 0;
      }
    }

    // 5. Pointing Arm Articulation
    if (this.leftArm) {
      const targetArmAngle = this.isPointing ? -0.85 : 0;
      this.leftArm.rotation.z = THREE.MathUtils.lerp(this.leftArm.rotation.z, targetArmAngle, 0.1);
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, this.isPointing ? 0.7 : 0, 0.1);
    }

    // 6. Natural Eye Blinking
    this.blinkTimer += delta * 1000;
    if (this.blinkTimer > this.nextBlinkTime) {
      this.isBlinking = true;
      this.eyeLeft.scale.y = 0.08;
      this.eyeRight.scale.y = 0.08;

      if (this.blinkTimer > this.nextBlinkTime + 140) {
        this.eyeLeft.scale.y = 1;
        this.eyeRight.scale.y = 1;
        this.isBlinking = false;
        this.blinkTimer = 0;
        this.nextBlinkTime = 2500 + Math.random() * 3500;
      }
    }

    // 7. Core Pulsing
    if (this.reactorCore) {
      const pulse = 0.8 + Math.sin(time * 5) * 0.25;
      this.reactorCore.scale.set(pulse, pulse, pulse);
    }

    if (this.thrusterRing) {
      this.thrusterRing.rotation.z = time * 2;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
