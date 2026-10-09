/**
 * UZAIR FAROOQ NAIKOO — AI & EMBEDDED SYSTEMS PORTFOLIO
 * High-Performance 4K Video Scrubbing & Real 3D Three.js Companion
 * 
 * Direct Email: naikoouzair2@gmail.com
 */

import { CyberBuddy3D } from './kira3d.js';

// ============================================================================
// 1. CONSTANTS & DOM REFERENCES
// ============================================================================
const TOTAL_FRAMES = 198;
const FRAME_PREFIX = '/frames/ezgif-frame-';
const FRAME_EXTENSION = '.jpg';

// Sequence Canvas & Hero Track
const heroTrack = document.getElementById('hero-sequence-container');
const canvas = document.getElementById('sequence-canvas');
const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
const preloader = document.getElementById('preloader');
const loaderBar = document.getElementById('loader-bar');
const loaderPercent = document.getElementById('loader-percent');
const frameCounter = document.getElementById('frame-counter');

// Hero Content & Typography
const heroLeftCol = document.querySelector('.hero-left-column');
const headlineBlock1 = document.getElementById('headline-block-1');
const headlineBlock2 = document.getElementById('headline-block-2');

// Footer & Navigation
const btnCopyFooterEmail = document.getElementById('btn-copy-footer-email');
const btnCopyModalEmail = document.getElementById('btn-copy-modal-email');
const btnScrollTop = document.getElementById('btn-scroll-top');
const footerContactTrigger = document.getElementById('footer-contact-trigger');

// 3D Companion (KIRA-01)
const cyberBuddy = document.getElementById('cyber-buddy-companion');
const buddySpeechBubble = document.getElementById('buddy-speech-bubble');
const buddySpeechText = document.getElementById('buddy-speech-text');
const btnBubbleMinimize = document.getElementById('btn-bubble-minimize');
const buddyAvatar = document.getElementById('buddy-avatar');
let buddy3d = null;

// Modals
const inspectModal = document.getElementById('modal-card-inspect');
const inspectImg = document.getElementById('inspect-img');
const inspectTag = document.getElementById('inspect-tag');
const inspectTitle = document.getElementById('inspect-title');
const inspectDesc = document.getElementById('inspect-desc');
const inspectSpecsList = document.getElementById('inspect-specs-list');

// ============================================================================
// 2. FLAGSHIP PROJECTS TELEMETRY SPECIFICATIONS
// ============================================================================
const FLAGSHIP_PROJECT_DETAILS = {
  'omni-chassis-4wd': {
    title: 'O.M.N.I 1.0 — Autonomous Robotic Companion',
    tag: 'ROBOTICS // 4WD',
    desc: '4WD differential drive robot platform powered by dual L298N H-Bridge PWM and HC-SR04 ultrasonic radar obstacle avoidance, combined with real-time Gemini Live full-duplex voice streaming.',
    img: '/gallery/omni-pi-face.png',
    specs: [
      { label: 'Voice Streaming', val: 'Gemini Live WebSocket (24kHz PCM)' },
      { label: 'Audio Latency', val: '0.69 seconds average roundtrip' },
      { label: 'Visor Display', val: '3.5" 480x320 SPI0 RGB TFT (ILI9486)' },
      { label: 'Motor Driver', val: 'L298N Dual H-Bridge PWM (GPIO 18/13)' },
      { label: 'Obstacle Radar', val: 'HC-SR04 Ultrasonic (GPIO 4/26)' },
      { label: 'Vision Pipeline', val: 'OV5647 5MP MIPI-CSI Camera' },
      { label: 'Power Bus', val: '12V 3S Li-ion + Dual LM2596 Regulators' },
      { label: 'Lead Architect', val: 'Uzair Farooq Naikoo' }
    ]
  },
  'esp-sensor-grid': {
    title: 'Distributed IoT Sensor Mesh Grid',
    tag: 'ESP32 // IOT',
    desc: 'Low-power wireless telemetry nodes transmitting environmental telemetry, distance sensing, and hardware diagnostics across an ESP-NOW / WiFi network directly to the central robot brain.',
    img: '/frames/ezgif-frame-095.jpg',
    specs: [
      { label: 'Protocol', val: 'ESP-NOW Peer-to-Peer Protocol' },
      { label: 'Node Hardware', val: 'ESP8266 NodeMCU & ESP32 Dual-Core' },
      { label: 'Sensor Bus', val: 'I2C (BMP280) & SPI Diagnostics' },
      { label: 'Transmission Delay', val: '< 5ms Packet Delivery' },
      { label: 'Failover Mode', val: 'Automatic WiFi AP Telemetry Bridge' },
      { label: 'Security', val: 'AES-128 Encrypted Payloads' }
    ]
  },
  'gemini-live-engine': {
    title: 'Multimodal Neural Tool Orchestrator',
    tag: 'AI // MULTIMODAL',
    desc: 'Autonomous function-calling orchestrator translating live spoken natural language into immediate robotic motor actuation, camera frame captures, and emotional visor state changes.',
    img: '/gallery/omni-pi-voice.png',
    specs: [
      { label: 'AI Model', val: 'Gemini 2.0 Flash Multimodal Live' },
      { label: 'Audio Stack', val: 'Linux PipeWire + ALSA Low-Latency' },
      { label: 'VAD Processing', val: 'Server-Side Voice Activity Detection' },
      { label: 'Function RPC', val: 'Declarative JSON Schema Tool Calls' },
      { label: 'Echo Suppression', val: 'Hardware AEC & Linear DSP' }
    ]
  },
  'omni-hardware-lab': {
    title: 'Robotics Bench & Dual-Rail Power Distribution',
    tag: 'HARDWARE LAB',
    desc: 'High-current dual rail 5.1V/12V power supply with flyback diode suppression, optical signal isolation, and reverse polarity protection, feeding MIPI-CSI camera streaming and high-torque motors.',
    img: '/frames/ezgif-frame-065.jpg',
    specs: [
      { label: 'Bus Voltage', val: 'Dual Rail 5.1V (Pi Core) & 12V (Motors)' },
      { label: 'Peak Current', val: '6A Surge Capacity' },
      { label: 'Isolation', val: 'Optocoupler Gated Logic Channels' },
      { label: 'Filtering', val: '1000uF Low-ESR High-Frequency Caps' },
      { label: 'Camera Link', val: '2-Lane MIPI-CSI Ribbon' }
    ]
  },
  'ocusafe-app': {
    title: 'OcuSafe — Smart Eye & App Protection Guardian',
    tag: 'APP // ANDROID & WINDOWS',
    desc: 'A cross-platform digital wellness suite engineered by Uzair Farooq Naikoo. Features real-time on-device computer vision distance detection alerting users when screens are closer than 30cm, 20-20-20 break enforcement, strict parental app usage limits, and Device Administrator tamper protection against unauthorized uninstallation.',
    img: '/gallery/ocusafe-preview.png',
    liveUrl: 'https://ocusafeapp.netlify.app/',
    specs: [
      { label: 'Target Platforms', val: 'Android APK & Windows System Tray EXE' },
      { label: 'Safety Engine', val: 'On-Device Computer Vision Distance Detection' },
      { label: 'Safety Threshold', val: 'Immediate Alert if screen distance < 30cm' },
      { label: 'Eye Strain Rest', val: 'Automated 20-20-20 Rule Notification Protocol' },
      { label: 'App Usage Controls', val: 'Daily Time Limits & Instant App Lockdown' },
      { label: 'Tamper Protection', val: 'Device Administrator Lockout Permission' },
      { label: 'Supported By', val: 'Army Goodwill School Wuzur & Bharti Airtel Foundation' },
      { label: 'Lead Architect', val: 'Uzair Farooq Naikoo (naikoouzair2@gmail.com)' }
    ]
  },
  'novachat-app': {
    title: 'Nova Chat — Real-Time WebSocket Cyber Messenger',
    tag: 'APP // REAL-TIME MESSAGING',
    desc: 'Next-generation lightning-fast messaging platform built with a high-performance cyber-glassmorphism interface. Delivers real-time bidirectional WebSocket message routing, low-latency voice note recording and playback, media attachment pipeline, and seamless responsive client synchronization.',
    img: '/gallery/novachat-mockup.png',
    liveUrl: 'https://novachatapp.netlify.app/',
    specs: [
      { label: 'Architecture', val: 'React Single Page Application (SPA)' },
      { label: 'Sync Protocol', val: 'Full-Duplex Real-Time WebSockets' },
      { label: 'Voice Engine', val: 'In-Browser High-Fidelity Audio Streaming' },
      { label: 'Latency', val: 'Sub-50ms Instant Packet Synchronization' },
      { label: 'Media Handling', val: 'Encrypted Image & File Transmission Cache' },
      { label: 'Visual Design', val: 'Cyber-Glassmorphism & Matrix Micro-Animations' },
      { label: 'Cloud Host', val: 'Global Low-Latency Netlify Edge CDN' },
      { label: 'Lead Developer', val: 'Uzair Farooq Naikoo (naikoouzair2@gmail.com)' }
    ]
  },
  'home-iot-system': {
    title: 'Home Automated IoT System — Smart Energy & Appliance Telemetry',
    tag: 'HARDWARE // IOT',
    desc: 'High-efficiency microcontroller automation prototype engineered by Uzair Farooq Naikoo under the Bharti Airtel Foundation QSP initiative at Army Goodwill School Wuzur. Features dynamic energy consumption regulation, opto-isolated relay switching, and automatic fire-prevention thermal safety cutoffs for high-wattage water geysers and AC units.',
    img: '/achievements/photo_2026-10-05_16-50-39.jpg',
    specs: [
      { label: 'Microcontroller Core', val: 'ESP8266 NodeMCU & Atmel AVR' },
      { label: 'Relay Matrix', val: '10A/250VAC Opto-Isolated Channels (<10ms)' },
      { label: 'Safety Cutoff', val: 'Automatic Overheat Thermal Disconnect' },
      { label: 'Target Loads', val: 'Residential Geysers, HVAC, Room Circuits' },
      { label: 'Telemetry Link', val: 'WiFi WebSockets & Local ESP-NOW Mesh' },
      { label: 'Initiative & Venue', val: 'Bharti Airtel Foundation QSP · AGS Wuzur' },
      { label: 'Lead Developer', val: 'Uzair Farooq Naikoo (naikoouzair2@gmail.com)' }
    ]
  }
};

// ============================================================================
// 3. FRAME LOADING & IMAGE CACHE
// ============================================================================
const frameImages = new Array(TOTAL_FRAMES);
let loadedCount = 0;
let isLoaded = false;
let currentFrameIndex = 0;
let targetFrameIndex = 0;

function formatFrameNumber(index) {
  return String(index + 1).padStart(3, '0');
}

function preloadFrames() {
  const PRIORITY_COUNT = 30;

  function loadSingleFrame(index) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = `${FRAME_PREFIX}${formatFrameNumber(index)}${FRAME_EXTENSION}`;
      img.onload = () => {
        frameImages[index] = img;
        loadedCount++;
        updateLoaderProgress();
        resolve();
      };
      img.onerror = () => {
        console.warn(`Frame ${index} failed to load, creating fallback.`);
        loadedCount++;
        updateLoaderProgress();
        resolve();
      };
    });
  }

  // Load first batch of frames for rapid interactive start
  const initialPromises = [];
  for (let i = 0; i < PRIORITY_COUNT; i++) {
    initialPromises.push(loadSingleFrame(i));
  }

  Promise.all(initialPromises).then(() => {
    isLoaded = true;
    hidePreloader();
    renderCurrentFrame();

    // Load remaining frames in background
    for (let i = PRIORITY_COUNT; i < TOTAL_FRAMES; i++) {
      loadSingleFrame(i);
    }
  });

  // Failsafe: never lock user on preloader longer than 2.5s
  setTimeout(() => {
    if (!isLoaded) {
      isLoaded = true;
      hidePreloader();
      renderCurrentFrame();
    }
  }, 2500);
}

function updateLoaderProgress() {
  const percent = Math.min(100, Math.round((loadedCount / 30) * 100));
  if (loaderBar) loaderBar.style.width = `${percent}%`;
  if (loaderPercent) loaderPercent.textContent = `${percent}%`;
}

function hidePreloader() {
  if (preloader) {
    preloader.classList.add('loaded');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 700);
  }
}

// ============================================================================
// 4. CANVAS RENDERING & POST-PROCESSING
// ============================================================================
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

function resizeCanvas() {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = viewportWidth * dpr;
  canvas.height = viewportHeight * dpr;
  canvas.style.width = `${viewportWidth}px`;
  canvas.style.height = `${viewportHeight}px`;

  ctx.scale(dpr, dpr);
  renderCurrentFrame();
}

function renderCurrentFrame() {
  const index = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameIndex)));
  const img = frameImages[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const screenRatio = w / h;

  let drawW, drawH, drawX, drawY;

  // "Cover" scaling: maintain crisp aspect ratio filling canvas
  if (screenRatio > imgRatio) {
    drawW = w;
    drawH = w / imgRatio;
    drawX = 0;
    drawY = (h - drawH) / 2;
  } else {
    drawH = h;
    drawW = h * imgRatio;
    drawX = (w - drawW) / 2;
    drawY = 0;
  }

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  // Update HUD frame counter
  if (frameCounter) {
    frameCounter.textContent = `${formatFrameNumber(index)} / ${TOTAL_FRAMES}`;
  }
}

// ============================================================================
// 5. SCROLL SCRUBBING & SECTION PROGRESS
// ============================================================================
let scrollProgress = 0;
let lastScrollY = 0;
let scrollVelocity = 0;
let lastCompanionPhase = -1;

function onScroll() {
  const scrollY = window.scrollY;
  scrollVelocity = scrollY - lastScrollY;
  lastScrollY = scrollY;

  // Calculate smooth frame scrub progress across the ENTIRE website from hero top to footer
  const totalDocHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  scrollProgress = Math.min(1, Math.max(0, scrollY / totalDocHeight));
  targetFrameIndex = scrollProgress * (TOTAL_FRAMES - 1);

  // Tilt KIRA companion dynamically with scroll speed
  if (cyberBuddy) {
    cyberBuddy._isScrolling = true;
    const tilt = Math.max(-10, Math.min(10, scrollVelocity * 0.4));
    cyberBuddy.style.transform = `translateY(${Math.min(12, Math.abs(scrollVelocity) * 0.2)}px) rotate(${tilt}deg)`;
    clearTimeout(cyberBuddy._tiltTimer);
    cyberBuddy._tiltTimer = setTimeout(() => {
      cyberBuddy._isScrolling = false;
      cyberBuddy.style.transform = '';
    }, 200);
  }

  // Update contextual companion messages at milestones
  updateCompanionContext(scrollY, totalDocHeight);
}

function updateCompanionContext(scrollY, totalDocHeight) {
  if (!buddySpeechText) return;

  const docProgress = totalDocHeight > 0 ? scrollY / totalDocHeight : 0;

  let phase = 0;
  if (docProgress > 0.82) {
    phase = 4; // Footer / Contact
  } else if (docProgress > 0.58) {
    phase = 3; // Home Automated IoT System
  } else if (docProgress > 0.32) {
    phase = 2; // O.M.N.I 1.0 Showcase & Video
  } else if (docProgress > 0.10) {
    phase = 1; // Flagship Projects & Apps
  } else {
    phase = 0; // Hero Top
  }

  if (phase !== lastCompanionPhase) {
    lastCompanionPhase = phase;
    const messages = {
      0: "KIRA-01 Active // Multimodal AI & Embedded Robotics telemetry online.",
      1: "Flagship creations: O.M.N.I 1.0, OcuSafe, and Nova Chat. Tap any project to inspect live telemetry!",
      2: "O.M.N.I 1.0 Autonomous Robot in action! Tap 'UNMUTE SOUND' on the video player to hear physical audio.",
      3: "Home Automated IoT System with real-time thermal safety and smart energy optimization.",
      4: "Ready to build? Send a transmission to contact@uzairnaikoo.cyou or connect on GitHub @uzair-farooq-naikoo!"
    };
    buddySpeechText.textContent = messages[phase];
    buddySpeechBubble?.classList.remove('minimized');
  }
}

// ============================================================================
// 6. RENDER LOOP (SMOOTH INTERPOLATION)
// ============================================================================
let mouseX = 0;
let mouseY = 0;
let smoothMouseX = 0;
let smoothMouseY = 0;

function renderLoop() {
  // Smooth frame scrub lerp
  const frameDelta = targetFrameIndex - currentFrameIndex;
  if (Math.abs(frameDelta) > 0.01) {
    currentFrameIndex += frameDelta * 0.16;
    renderCurrentFrame();
  }

  // Smooth mouse lerp for hero parallax
  smoothMouseX += (mouseX - smoothMouseX) * 0.08;
  smoothMouseY += (mouseY - smoothMouseY) * 0.08;

  // Headline transition based on video scrub progress
  if (headlineBlock1 && headlineBlock2) {
    if (scrollProgress < 0.48) {
      if (!headlineBlock1.classList.contains('active')) {
        headlineBlock1.classList.add('active');
        headlineBlock2.classList.remove('active');
      }
    } else {
      if (!headlineBlock2.classList.contains('active')) {
        headlineBlock2.classList.add('active');
        headlineBlock1.classList.remove('active');
      }
    }
  }

  // Parallax 3D tilt on hero left column
  if (heroLeftCol && scrollProgress < 0.95) {
    const tiltX = -smoothMouseY * 2.8;
    const tiltY = smoothMouseX * 2.8;
    heroLeftCol.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
  }

  requestAnimationFrame(renderLoop);
}

function onMouseMove(e) {
  mouseX = (e.clientX / viewportWidth) * 2 - 1;
  mouseY = (e.clientY / viewportHeight) * 2 - 1;
}

// ============================================================================
// 7. REAL 3D THREE.JS COMPANION (KIRA-01) INTEGRATION
// ============================================================================
function setup3DBuddy() {
  const container = document.getElementById('kira-3d-canvas-container');
  if (container) {
    buddy3d = new CyberBuddy3D('kira-3d-canvas-container');
  }

  if (btnBubbleMinimize && buddySpeechBubble) {
    btnBubbleMinimize.addEventListener('click', (e) => {
      e.stopPropagation();
      buddySpeechBubble.classList.toggle('minimized');
    });
  }

  if (buddyAvatar) {
    buddyAvatar.addEventListener('click', () => {
      if (buddy3d) buddy3d.triggerSpin();
      if (buddySpeechText) {
        const msgs = [
          "O.M.N.I Core online! Ready to build amazing hardware & AI with you!",
          "Telemetry active! Uzair's circuits are firing on all cylinders!",
          "Direct transmission open! contact@uzairnaikoo.cyou is ready for you!"
        ];
        buddySpeechText.textContent = msgs[Math.floor(Math.random() * msgs.length)];
        buddySpeechBubble?.classList.remove('minimized');
      }
    });
  }

  // Articulated Pointing Finger Gesture on Hovering Elements
  const interactiveTargets = document.querySelectorAll(
    '.btn-portfolio, .btn-secondary-hud, .btn-work, .nav-btn-glow, .flagship-card, .hero-signature-card, .btn-goto-archive'
  );

  interactiveTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (buddy3d) buddy3d.setPointing(true);
    });
    el.addEventListener('mouseleave', () => {
      if (buddy3d) buddy3d.setPointing(false);
    });
  });
}

// ============================================================================
// 8. CARD INSPECTION & PROJECT TELEMETRY
// ============================================================================
function setupCardInspection() {
  const inspectTriggers = document.querySelectorAll('.btn-inspect-trigger');
  inspectTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-project-id');
      const details = FLAGSHIP_PROJECT_DETAILS[pid];
      if (details) openCardInspection(details);
    });
  });
}

function openCardInspection(card) {
  if (!inspectModal) return;
  if (inspectImg) inspectImg.src = card.img;
  if (inspectTag) inspectTag.textContent = card.tag;
  if (inspectTitle) inspectTitle.textContent = card.title;
  if (inspectDesc) inspectDesc.textContent = card.desc;

  if (inspectSpecsList) {
    inspectSpecsList.innerHTML = '';
    const specs = card.specs || [];
    specs.forEach(s => {
      const row = document.createElement('div');
      row.className = 'inspect-spec-row';
      row.innerHTML = `
        <span class="spec-k">${s.label}</span>
        <span class="spec-v">${s.val}</span>
      `;
      inspectSpecsList.appendChild(row);
    });
  }

  // Live Application Uplink Button
  const inspectActionsRow = document.getElementById('inspect-actions-row');
  const inspectLiveLink = document.getElementById('inspect-live-link');
  if (inspectActionsRow && inspectLiveLink) {
    if (card.liveUrl) {
      inspectLiveLink.href = card.liveUrl;
      inspectActionsRow.style.display = 'block';
    } else {
      inspectActionsRow.style.display = 'none';
      inspectLiveLink.href = '#';
    }
  }

  openModal(inspectModal);
}

// ============================================================================
// 9. MODALS & EMAIL ACTIONS
// ============================================================================
function openModal(modal) {
  if (!modal) return;
  closeAllModals();
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.hud-modal.active').forEach(m => closeModal(m));
}

function setupModals() {
  // Modal triggers with data-modal attribute
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = `modal-${btn.getAttribute('data-modal')}`;
      const targetModal = document.getElementById(targetId);
      if (targetModal) openModal(targetModal);
    });
  });

  // Close triggers
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Contact trigger button in top nav
  const contactBtn = document.getElementById('btn-contact-trigger');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      const contactModal = document.getElementById('modal-contact');
      if (contactModal) openModal(contactModal);
    });
  }

  if (footerContactTrigger) {
    footerContactTrigger.addEventListener('click', () => {
      const contactModal = document.getElementById('modal-contact');
      if (contactModal) openModal(contactModal);
    });
  }

  // Escape key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function setupCopyEmail() {
  function handleCopy(btn) {
    if (!btn) return;
    navigator.clipboard.writeText('contact@uzairnaikoo.cyou').then(() => {
      const textSpan = btn.querySelector('.copy-text') || btn.querySelector('span') || btn;
      const originalText = textSpan.textContent;
      textSpan.textContent = 'COPIED TO CLIPBOARD ✓';
      setTimeout(() => {
        textSpan.textContent = originalText;
      }, 2000);
    });
  }

  if (btnCopyFooterEmail) {
    btnCopyFooterEmail.addEventListener('click', () => handleCopy(btnCopyFooterEmail));
  }
  if (btnCopyModalEmail) {
    btnCopyModalEmail.addEventListener('click', () => handleCopy(btnCopyModalEmail));
  }
}

function setupBackToTop() {
  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ============================================================================
// 10. OFFICIAL CREDENTIALS & CERTIFICATES DOSSIER
// ============================================================================
const CERTIFICATES_DATA = [
  {
    id: 'cert-ysi-2025',
    category: 'science',
    title: 'Young Scientist India (YSI) 11th Edition 2025',
    org: 'Space Kidz India & Hexaware',
    distinction: 'National Finalist — Grand Finale (August 2025)',
    authority: 'Dr. Srimathy Kesan (Founder & CEO, Space Kidz India)',
    date: 'August 2025 · Supported by Principal Scientific Adviser to GoI',
    certId: 'YSI-11-FIN-2025-UFN',
    skills: ['Autonomous Robotics', 'Space Sciences', 'Embedded IoT', 'AI Vision'],
    fullImg: '/certificates/cert_page_1_1.jpg',
    thumbImg: '/certificates/thumbs/cert_page_1_1.jpg',
    badge: 'FINALIST // NATIONAL LEVEL',
    desc: 'Selected as national finalist in the prestigious 11th Edition of Young Scientist India organized by Space Kidz India, supported by the Office of the Principal Scientific Adviser to the Government of India and Hexaware.'
  },
  {
    id: 'cert-plaksha-ycl',
    category: 'science',
    title: 'Young Creators League (YCL) Grand Exhibition 2024',
    org: 'Plaksha University & Young Technology Scholars',
    distinction: 'Grand Exhibition Finalist & Presenter',
    authority: 'Alok Mittal (Founder & Trustee, Plaksha University)',
    date: 'January 26, 2024 · Plaksha University, Mohali',
    certId: 'YCL-2024-PLAKSHA-089',
    skills: ['Hardware Prototyping', 'Robotic Systems', 'Embedded Firmware', 'Design Thinking'],
    fullImg: '/certificates/cert_page_8_1.jpg',
    thumbImg: '/certificates/thumbs/cert_page_8_1.jpg',
    badge: 'UNIVERSITY SUMMIT // MOHALI',
    desc: 'Presented advanced engineering prototype at the Grand Exhibition of Young Creators League held on January 26, 2024, at Plaksha University Mohali.'
  },
  {
    id: 'cert-ethical-hacking',
    category: 'cyber',
    title: 'Introduction to Ethical Hacking & Cyber Defense',
    org: 'Great Learning Academy',
    distinction: 'Verified Course Certification of Completion',
    authority: 'Great Learning Academic Verification Board',
    date: 'March 2024 · Verified Credential ID: HOXVOPL',
    certId: 'HOXVOPL · verify.mygreatlearning.com',
    skills: ['Ethical Hacking', 'Network Security', 'Penetration Testing', 'Vulnerability Assessment'],
    fullImg: '/certificates/cert_page_2_1.jpg',
    thumbImg: '/certificates/thumbs/cert_page_2_1.jpg',
    badge: 'CYBERSECURITY // DEFENSE',
    desc: 'Completed comprehensive rigorous curriculum covering penetration testing, network sniffing, vulnerability countermeasures, and defensive cybersecurity architectures.'
  },
  {
    id: 'cert-google-cyberpeace',
    category: 'cyber',
    title: 'AI Deepfakes, Misinformation & Cybersecurity First Responders',
    org: 'CyberPeace Corps, Google.org & USI',
    distinction: 'First Responders & Mythbusters Certification',
    authority: 'Brig (Dr.) Vivek Verma (Retd, USI) & Lt Cdr Seema Gupta (Retd, CyberPeace)',
    date: '26th May 2025 · United Service Institution of India',
    certId: 'CP-USI-GOOG-2025-0526',
    skills: ['AI Deepfake Detection', 'Cyber Harm Countermeasures', 'OSINT Analysis', 'Digital Forensics'],
    fullImg: '/certificates/cert_page_5_1.jpg',
    thumbImg: '/certificates/thumbs/cert_page_5_1.jpg',
    badge: 'GOOGLE.ORG × USI // AI SAFETY',
    desc: 'Trained in advanced skills in identifying and mitigating AI-generated deepfakes, countering digital harms, cyber forensics, and defending public information spaces.'
  },
  {
    id: 'cert-ags-gold-2022',
    category: 'academic',
    title: 'World Creative & Innovative Competition — 1st Position Gold',
    org: 'Shaheed Lance Naik Nazir Ahmad Wani, AC, SM - AGS Wuzur',
    distinction: '1st Position (Gold Winner) // Intra-School Championship',
    authority: 'Col Nawazesh N Patel (Commanding Officer, 9th Rashtriya Rifles Bn RAJ RIF)',
    date: '22nd April 2022 · Army Goodwill Higher Secondary School',
    certId: 'WCIC-2022-1ST-GOLD-01',
    skills: ['Robotics Innovation', 'Creative Problem Solving', 'Hardware Invention', 'Leadership'],
    fullImg: '/certificates/cert_page_6_1.jpg',
    thumbImg: '/certificates/thumbs/cert_page_6_1.jpg',
    badge: '1ST POSITION // GOLD MEDAL',
    desc: 'Awarded 1st Position (Gold Medal) in the World Creative & Innovative Competition organized by Army Goodwill Higher Secondary School under the aegis of 9th Rashtriya Rifles (Raj Rif).'
  },
  {
    id: 'cert-innofest-2025',
    category: 'science',
    title: 'INNOFEST 2025 Science & Innovation Exhibition',
    org: 'Bharti Airtel Foundation & AGS Wuzur',
    distinction: 'Certificate of Active Innovation Participation',
    authority: 'Binu Nair (Chief - Program & Operations, Bharti Airtel Foundation)',
    date: '6th October 2025 · Anantnag, J&K',
    certId: 'INNOFEST-2025-BAF-AGS',
    skills: ['Applied Physics', 'Microcontrollers', 'Sensor Interfacing', 'Prototype Design'],
    fullImg: '/certificates/cert_page_3_1.jpg',
    thumbImg: '/certificates/thumbs/cert_page_3_1.jpg',
    badge: 'AIRTEL FOUNDATION // STEM',
    desc: 'Actively participated in INNOFEST 2025 representing Army Goodwill School Wuzur, developing real-world embedded sensor prototypes under the Quality Support Program.'
  },
  {
    id: 'cert-finnlogic-workshop',
    category: 'science',
    title: 'IT Workshop in Programming & Applied Coding',
    org: 'Finnlogic Techworld Pvt. Ltd.',
    distinction: 'Certificate of Training in Programming & Coding',
    authority: 'Aabid Hussain Mir (Director) & Sheeba Singh.M (Technical Head)',
    date: '19th August 2023 · Reg No: 174928',
    certId: 'FINNLOGIC-IT-174928',
    skills: ['Python', 'C++ Embedded Logic', 'Object Oriented Programming', 'Firmware Design'],
    fullImg: '/certificates/cert_page_4_1.jpg',
    thumbImg: '/certificates/thumbs/cert_page_4_1.jpg',
    badge: 'IT WORKSHOP // CODE LAB',
    desc: 'Completed hands-on software development training in programming architectures, algorithmic optimization, and hardware firmware interfacing.'
  },
  {
    id: 'cert-manf-excellence',
    category: 'academic',
    title: 'Certificate of Academic Excellence in Studies',
    org: 'MANF — Womanistaan 2023',
    distinction: 'Outstanding Academic Achievement & Leadership',
    authority: 'Dr. Mehnaaz Nadiadwala (Founder & CEO, MANF)',
    date: '29th October 2023 · Srinagar, Jammu & Kashmir',
    certId: 'MANF-WOMANISTAAN-2023-EXC',
    skills: ['Academic Leadership', 'Scientific Rigor', 'Analytical Thinking', 'Mathematics'],
    fullImg: '/certificates/cert_page_7_1.jpg',
    thumbImg: '/certificates/thumbs/cert_page_7_1.jpg',
    badge: 'ACADEMIC EXCELLENCE // SRINAGAR',
    desc: 'Recognized for outstanding academic distinction and continuous excellence in science and engineering studies by the MANF Foundation in Srinagar.'
  }
];

let currentCertIndex = 0;
let currentCertFilter = 'all';

function renderCertificates(filter = 'all') {
  const grid = document.getElementById('certificates-grid');
  if (!grid) return;

  currentCertFilter = filter;
  const filtered = filter === 'all' 
    ? CERTIFICATES_DATA 
    : CERTIFICATES_DATA.filter(c => c.category === filter);

  grid.innerHTML = filtered.map((c, idx) => {
    const originalIndex = CERTIFICATES_DATA.indexOf(c);
    const isGold = c.badge.includes('1ST POSITION') || c.badge.includes('GOLD');
    return `
      <article class="cert-card ${isGold ? 'featured-gold' : ''}" data-cert-index="${originalIndex}">
        <div class="cert-thumb-wrap" onclick="window._openCertModal(${originalIndex})">
          <img src="${c.thumbImg}" alt="${c.title}" class="cert-thumb-img" loading="lazy" />
          <div class="cert-scanline"></div>
          <div class="cert-corner-bracket tl">+</div>
          <div class="cert-corner-bracket tr">+</div>
          <div class="cert-corner-bracket bl">+</div>
          <div class="cert-corner-bracket br">+</div>
          <div class="cert-org-pill">${c.badge}</div>
        </div>
        <div class="cert-card-body">
          <div>
            <div class="cert-badge-row">
              <span class="cert-date-tag">${c.date}</span>
              <span class="cert-status-badge">✦ VERIFIED</span>
            </div>
            <h3 class="cert-card-title">${c.title}</h3>
            <p class="cert-card-issuer">${c.org} · ${c.authority}</p>
            <div class="cert-skills-pills">
              ${c.skills.map(s => `<span>${s}</span>`).join('')}
            </div>
          </div>
          <div class="cert-card-actions">
            <button type="button" class="btn-inspect-cert" onclick="window._openCertModal(${originalIndex})">
              <span>🔍 INSPECT CREDENTIAL</span>
              <span class="btn-arrow">↗</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach companion pointing listeners
  grid.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mouseenter', () => buddy3d?.setPointing(true));
    card.addEventListener('mouseleave', () => buddy3d?.setPointing(false));
  });
  setupCardHolographicEffects();
}

function openCertModal(index) {
  currentCertIndex = (index + CERTIFICATES_DATA.length) % CERTIFICATES_DATA.length;
  const cert = CERTIFICATES_DATA[currentCertIndex];
  if (!cert) return;

  const modal = document.getElementById('modal-cert-inspect');
  const imgEl = document.getElementById('cert-inspect-img');
  const orgEl = document.getElementById('cert-inspect-org');
  const titleEl = document.getElementById('cert-inspect-title');
  const distEl = document.getElementById('cert-inspect-distinction');
  const authEl = document.getElementById('cert-inspect-authority');
  const dateEl = document.getElementById('cert-inspect-date');
  const idEl = document.getElementById('cert-inspect-id');
  const skillsEl = document.getElementById('cert-inspect-skills');
  const rawLink = document.getElementById('btn-cert-raw-link');

  if (imgEl) imgEl.src = cert.fullImg;
  if (orgEl) orgEl.textContent = cert.badge;
  if (titleEl) titleEl.textContent = cert.title;
  if (distEl) distEl.textContent = cert.distinction;
  if (authEl) authEl.textContent = `${cert.org} · ${cert.authority}`;
  if (dateEl) dateEl.textContent = cert.date;
  if (idEl) idEl.textContent = cert.certId;
  if (skillsEl) skillsEl.textContent = cert.skills.join(' · ');
  if (rawLink) rawLink.href = cert.fullImg;

  openModal(modal);
}
window._openCertModal = openCertModal;

function setupCertificates() {
  renderCertificates('all');

  // Delegated click listener on certificates grid
  const certGrid = document.getElementById('certificates-grid');
  if (certGrid) {
    certGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.cert-card');
      if (card) {
        const idx = parseInt(card.getAttribute('data-cert-index'), 10);
        if (!isNaN(idx)) {
          openCertModal(idx);
        }
      }
    });
  }

  // Filter tabs
  const filterBar = document.getElementById('cert-filter-bar');
  if (filterBar) {
    filterBar.querySelectorAll('.cert-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        filterBar.querySelectorAll('.cert-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderCertificates(pill.getAttribute('data-filter') || 'all');
      });
    });
  }

  // Prev / Next buttons in modal
  const btnPrev = document.getElementById('btn-cert-prev');
  const btnNext = document.getElementById('btn-cert-next');

  if (btnPrev) {
    btnPrev.addEventListener('click', () => openCertModal(currentCertIndex - 1));
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => openCertModal(currentCertIndex + 1));
  }
}

// ============================================================================
// 11. HONORS & FIELD EXPEDITIONS PHOTO GALLERY
// ============================================================================
const EXPEDITIONS_DATA = [
  {
    id: 'exp-1',
    category: 'plaksha',
    title: 'Plaksha University — Young Creators League Grand Summit',
    location: 'Mohali, Punjab · Jan 2024',
    desc: 'Uzair Farooq Naikoo with team delegates and mentors at Plaksha University for the nationwide Young Creators League exhibition.',
    img: '/school_gallery/ycl_plaksha_1.jpg',
    tag: 'PLAKSHA YCL 2024'
  },
  {
    id: 'exp-2',
    category: 'plaksha',
    title: 'Young Creators League — National Awards Ceremony',
    location: 'Plaksha Auditorium · Jan 2024',
    desc: 'Uzair Farooq Naikoo standing on stage honored with the Young Creators League national finalist medal at Plaksha University.',
    img: '/achievements/photo_2026-10-05_16-50-24.jpg',
    tag: 'PLAKSHA YCL 2024'
  },
  {
    id: 'exp-3',
    category: 'plaksha',
    title: 'Young Creators League — Gold Medalists on Campus Steps',
    location: 'Plaksha University · Jan 2024',
    desc: 'Uzair Farooq Naikoo holding the official YCL medal alongside fellow student innovators outside the Plaksha University auditorium.',
    img: '/achievements/photo_2026-10-05_16-50-27.jpg',
    tag: 'PLAKSHA YCL 2024'
  },
  {
    id: 'exp-4',
    category: 'team',
    title: 'Home Automation System — J&K State Exhibition Booth',
    location: 'Innovation Expo · 2024',
    desc: 'Uzair Farooq Naikoo presenting the live IoT Home Automation System booth and working microcontroller circuit to exhibition jury.',
    img: '/achievements/photo_2026-10-05_16-50-34.jpg',
    tag: 'IOT AUTOMATION'
  },
  {
    id: 'exp-5',
    category: 'team',
    title: 'IoT Automation Testing Bench & Sensor Telemetry',
    location: 'Innovation Expo · 2024',
    desc: 'Uzair Farooq Naikoo at the interactive hardware testing station demonstrating dynamic energy optimization and thermal cutoffs.',
    img: '/achievements/photo_2026-10-05_16-50-38.jpg',
    tag: 'IOT AUTOMATION'
  },
  {
    id: 'exp-6',
    category: 'team',
    title: 'Home Automated IoT System — Energy Optimization',
    location: 'AGS Wuzur / Bharti Foundation · 2024',
    desc: 'Home Automated IoT System prototype engineered by Uzair Farooq Naikoo under the Bharti Airtel Foundation Quality Support Program.',
    img: '/achievements/photo_2026-10-05_16-50-39.jpg',
    tag: 'IOT AUTOMATION'
  },
  {
    id: 'exp-7',
    category: 'team',
    title: 'Young Scientist India (YSI 2025) — National Trophy',
    location: 'Space Kidz India & Hexaware · Aug 2025',
    desc: 'Uzair Farooq Naikoo receiving the Young Scientist India 11th Edition national finalist trophy on stage from esteemed dignitaries.',
    img: '/achievements/photo_2026-10-05_16-50-36.jpg',
    tag: 'SPACE KIDZ // YSI 2025'
  },
  {
    id: 'exp-8',
    category: 'team',
    title: 'News 18 Kashmir — Television Broadcast Interview',
    location: 'AGS Wuzur Campus · 2024',
    desc: 'News 18 Kashmir television journalists interviewing Uzair Farooq Naikoo regarding his innovations in autonomous robotics and smart IoT.',
    img: '/achievements/photo_2026-10-05_16-50-19.jpg',
    tag: 'NEWS 18 BROADCAST'
  },
  {
    id: 'exp-9',
    category: 'innofest',
    title: 'Bharti Airtel Foundation — INNOFEST 2025 Award Ceremony',
    location: 'AGS Wuzur · 6th October 2025',
    desc: 'Uzair Farooq Naikoo receiving the INNOFEST 2025 Innovation Award from the Indian Army commanding officer at AGS Wuzur.',
    img: '/school_gallery/innofest_1.jpg',
    tag: 'INNOFEST 2025'
  }
];

function renderExpeditions(filter = 'all') {
  const grid = document.getElementById('expeditions-grid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? EXPEDITIONS_DATA
    : EXPEDITIONS_DATA.filter(e => e.category === filter);

  grid.innerHTML = filtered.map((e, idx) => {
    return `
      <article class="expedition-card" data-photo-id="${e.id}" onclick="window._openPhotoLightbox('${e.id}')">
        <div class="expedition-media-wrap">
          <img src="${e.img}" alt="${e.title}" class="expedition-img" loading="lazy" />
          <div class="expedition-tag-pill">${e.tag}</div>
        </div>
        <div class="expedition-info">
          <div>
            <div class="expedition-location-row">
              <span>${e.location}</span>
              <span>✦ ON-SITE</span>
            </div>
            <h3 class="expedition-title">${e.title}</h3>
            <p class="expedition-desc">${e.desc}</p>
          </div>
        </div>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('.expedition-card').forEach(card => {
    card.addEventListener('mouseenter', () => buddy3d?.setPointing(true));
    card.addEventListener('mouseleave', () => buddy3d?.setPointing(false));
  });
  setupCardHolographicEffects();
}

function openPhotoLightbox(photoId) {
  const item = EXPEDITIONS_DATA.find(e => e.id === photoId);
  if (!item) return;

  const modal = document.getElementById('modal-photo-inspect');
  const imgEl = document.getElementById('photo-inspect-img');
  const tagEl = document.getElementById('photo-inspect-tag');
  const titleEl = document.getElementById('photo-inspect-title');
  const descEl = document.getElementById('photo-inspect-desc');

  if (imgEl) imgEl.src = item.img;
  if (tagEl) tagEl.textContent = `${item.tag} // ${item.location}`;
  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.desc;

  openModal(modal);
}
window._openPhotoLightbox = openPhotoLightbox;

function setupExpeditions() {
  renderExpeditions('all');

  const expGrid = document.getElementById('expeditions-grid');
  if (expGrid) {
    expGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.expedition-card');
      if (card) {
        const photoId = card.getAttribute('data-photo-id');
        if (photoId) {
          openPhotoLightbox(photoId);
        }
      }
    });
  }

  const filterBar = document.getElementById('expedition-filter-bar');
  if (filterBar) {
    filterBar.querySelectorAll('.cert-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        filterBar.querySelectorAll('.cert-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderExpeditions(pill.getAttribute('data-filter') || 'all');
      });
    });
  }
}

/**
 * Interactive 3D Tilt & Specular Holographic Glare across Flagship, Certificate & Expedition cards
 */
function setupCardHolographicEffects() {
  const cards = document.querySelectorAll('.flagship-card, .cert-card, .expedition-card');
  cards.forEach(card => {
    if (card._hasHoloTilt) return;
    card._hasHoloTilt = true;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotX = ((y - cy) / cy) * -6.5;
      const rotY = ((x - cx) / cx) * 6.5;

      card.style.transform = `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-5px) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * O.M.N.I 1.0 Video Player with Interactive Mute/Unmute & Playback Controls
 */
function setupOmniVideoAndAudio() {
  const video = document.getElementById('omni-video');
  const audioToggle = document.getElementById('omni-audio-toggle');
  const audioToggleLabel = document.getElementById('audio-toggle-label');
  const soundWaveIcon = document.getElementById('sound-wave-icon');
  const playbackToggle = document.getElementById('omni-playback-toggle');
  const playbackIcon = document.getElementById('playback-icon');
  const playbackLabel = document.getElementById('playback-label');

  if (!video) return;

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        audioToggle.classList.remove('sound-active');
        if (audioToggleLabel) audioToggleLabel.textContent = 'UNMUTE SOUND';
        if (soundWaveIcon) soundWaveIcon.classList.remove('active');
      } else {
        audioToggle.classList.add('sound-active');
        if (audioToggleLabel) audioToggleLabel.textContent = '🔊 AUDIO ON';
        if (soundWaveIcon) soundWaveIcon.classList.add('active');
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    });
  }

  if (playbackToggle) {
    playbackToggle.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(() => {});
        if (playbackLabel) playbackLabel.textContent = 'PAUSE';
        if (playbackIcon) playbackIcon.textContent = '❚❚';
      } else {
        video.pause();
        if (playbackLabel) playbackLabel.textContent = 'PLAY';
        if (playbackIcon) playbackIcon.textContent = '▶';
      }
    });
  }

  video.addEventListener('ended', () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });
}

/**
 * Glass Cut Project Category Filter Dock
 */
function setupProjectFilters() {
  const dock = document.getElementById('projects-filter-dock');
  if (!dock) return;

  const buttons = dock.querySelectorAll('.dock-btn[data-filter]');
  const cards = document.querySelectorAll('.flagship-grid .flagship-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ============================================================================
// 12. INITIALIZATION
// ============================================================================
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', resizeCanvas, { passive: true });
window.addEventListener('mousemove', onMouseMove, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  preloadFrames();
  setup3DBuddy();
  setupCardInspection();
  setupOmniVideoAndAudio();
  setupProjectFilters();
  setupCardHolographicEffects();
  setupModals();
  setupCopyEmail();
  setupBackToTop();
  requestAnimationFrame(renderLoop);
});

