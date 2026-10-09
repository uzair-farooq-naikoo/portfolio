/**
 * 3D HOLOGRAPHIC ARCHIVE & CYBER MATRIX — UZAIR FAROOQ NAIKOO
 * Dedicated Standalone Experience with Inward Concave 3D Cylinder
 * 
 * Direct Email: naikoouzair2@gmail.com
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { CyberBuddy3D } from './kira3d.js';

// ============================================================================
// 1. FIREBASE CONFIGURATION (READ-ONLY TELEMETRY SYNC)
// ============================================================================
const firebaseConfig = {
  projectId: "studio-340418815-201d6",
  appId: "1:443805720073:web:35fa84ea679cda0509a2d8",
  storageBucket: "studio-340418815-201d6.firebasestorage.app",
  apiKey: "AIzaSyDfOH1YPGNrgcWd0Io-D6Fp7WNJwQDZHq8",
  authDomain: "studio-340418815-201d6.firebaseapp.com",
  messagingSenderId: "443805720073"
};

let firebaseApp = null;
let db = null;
let isFirebaseOnline = false;

try {
  firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp);
  isFirebaseOnline = true;
  console.log('⚡ [3D Archive] Firebase Cluster Uplink Established');
} catch (err) {
  console.warn('⚠️ [3D Archive] Firebase local mode standby:', err);
}

// ============================================================================
// 2. DOM REFERENCES
// ============================================================================
const holoStage = document.getElementById('holo-stage-container');
const holoTrack = document.getElementById('holo-cylinder-track');
const holoCounter = document.getElementById('holo-counter');
const holoPrevBtn = document.getElementById('holo-prev-btn');
const holoNextBtn = document.getElementById('holo-next-btn');
const firebaseStatusLabel = document.getElementById('firebase-sync-status');
const categoryTabs = document.getElementById('gallery-category-tabs');

const inspectModal = document.getElementById('modal-card-inspect');
const inspectImg = document.getElementById('inspect-img');
const inspectTag = document.getElementById('inspect-tag');
const inspectTitle = document.getElementById('inspect-title');
const inspectDesc = document.getElementById('inspect-desc');
const inspectSpecsList = document.getElementById('inspect-specs-list');
const inspectActionsRow = document.getElementById('inspect-actions-row');
const inspectLiveLink = document.getElementById('inspect-live-link');
const inspectRawLink = document.getElementById('inspect-raw-link');

const btnCopyGalleryEmail = document.getElementById('btn-copy-gallery-email');

// ============================================================================
// 3. SHOWCASE CARDS DATA
// ============================================================================
const DEFAULT_CARDS = [
  // --- HARDWARE PROJECTS ---
  {
    id: 'omni-chassis-4wd',
    category: 'hardware',
    title: 'O.M.N.I 1.0 4WD CHASSIS',
    tag: 'ROBOTICS // 4WD',
    desc: '4WD differential drive robot platform powered by dual L298N H-Bridge PWM and HC-SR04 ultrasonic radar obstacle avoidance.',
    img: '/frames/ezgif-frame-025.jpg',
    chip: 'L298N // 4WD PWM',
    specs: [
      { label: 'Motor Driver', val: 'L298N Dual H-Bridge' },
      { label: 'Motor Channels', val: '4x TT Geared DC Motors' },
      { label: 'Obstacle Radar', val: 'HC-SR04 Ultrasonic (GPIO 4/26)' },
      { label: 'Power Supply', val: '12V 3S Li-ion 2600mAh' },
      { label: 'Chassis Type', val: 'Laser-Cut Acrylic Dual-Deck' }
    ]
  },
  {
    id: 'omni-tft-visor',
    category: 'hardware',
    title: '3.5" TFT VISOR EYES',
    tag: 'VISOR // 3.5" TFT',
    desc: 'Kinematic cybernetic eye visor rendering real-time emotional states, pupil tracking, and alertness levels.',
    img: '/gallery/omni-pi-face.png',
    chip: 'SPI0 // ILI9486',
    specs: [
      { label: 'Display Panel', val: '3.5" 480x320 RGB TFT LCD' },
      { label: 'Controller', val: 'ILI9486 over SPI0 Bus' },
      { label: 'Touch Controller', val: 'XPT2046 Resistive IRQ' },
      { label: 'Eye Kinematics', val: 'Bézier Vector Blinking' },
      { label: 'Render Rate', val: '60 FPS Direct Framebuffer' }
    ]
  },
  {
    id: 'omni-hardware-lab',
    category: 'hardware',
    title: 'ROBOTICS BENCH & POWER BUS',
    tag: 'HARDWARE LAB',
    desc: 'High-current dual rail 5V/12V distribution with flyback diode suppression and optocoupler signal isolation.',
    img: '/frames/ezgif-frame-065.jpg',
    chip: 'LM2596 // BUCK REG',
    specs: [
      { label: 'Bus Voltage', val: 'Dual Rail 5.1V (Pi) & 12V (Motors)' },
      { label: 'Max Current', val: '6A Peak Surge Capacity' },
      { label: 'Noise Filtering', val: '1000uF Low-ESR Filter Caps' },
      { label: 'Logic Shifting', val: 'Bidirectional 3.3V <-> 5V I2C/SPI' },
      { label: 'Protection', val: 'Schottky Diode Reverse Polarity' }
    ]
  },
  {
    id: 'omni-pi-brain',
    category: 'hardware',
    title: 'RASPBERRY PI 4 NEURAL CORE',
    tag: 'EDGE // COMPUTE',
    desc: 'Quad-core ARM Cortex-A72 system running real-time Linux, WebSocket voice streaming, and OpenCV vision pipelines.',
    img: '/frames/ezgif-frame-110.jpg',
    chip: 'BCM2711 // 1.8GHz',
    specs: [
      { label: 'Processor', val: 'Broadcom BCM2711 Quad-Core A72' },
      { label: 'Memory', val: '4GB LPDDR4-3200 SDRAM' },
      { label: 'OS Runtime', val: 'Raspberry Pi OS 64-bit Lite' },
      { label: 'Audio Engine', val: 'PipeWire + ALSA Low-Latency' },
      { label: 'Camera Link', val: '2-Lane MIPI-CSI (OV5647 5MP)' }
    ]
  },
  {
    id: 'esp-sensor-grid',
    category: 'hardware',
    title: 'ESP32 / ESP8266 SENSOR MESH',
    tag: 'ESP32 // IOT',
    desc: 'Multi-node telemetry grid transmitting environmental diagnostics, obstacle distance, and system health via ESP-NOW.',
    img: '/frames/ezgif-frame-095.jpg',
    chip: 'ESP32 // ESP-NOW',
    specs: [
      { label: 'Node Protocol', val: 'ESP-NOW Low-Latency Mesh' },
      { label: 'Frequency', val: '2.4 GHz Direct MAC Addressing' },
      { label: 'Packet Latency', val: '< 5ms Transmission Delay' },
      { label: 'Sensors Linked', val: 'BMP280, DHT22, HC-SR04' },
      { label: 'Failover', val: 'Auto WiFi AP Telemetry Bridge' }
    ]
  },

  // --- SOFTWARE & AI ---
  {
    id: 'ocusafe-app',
    category: 'software',
    title: 'OCU SAFE — EYE & APP GUARDIAN',
    tag: 'APP // ANDROID & WINDOWS',
    desc: 'Smart digital wellness and eye safety suite with on-device computer vision 30cm proximity warning, 20-20-20 breaks, parental limits, and anti-uninstall security.',
    img: '/gallery/ocusafe-preview.png',
    chip: 'ON-DEVICE CV // LIVE APP',
    liveUrl: 'https://ocusafeapp.netlify.app/',
    specs: [
      { label: 'Platform Targets', val: 'Android APK & Windows System Tray EXE' },
      { label: 'Safety Engine', val: 'On-Device Computer Vision Distance Detection' },
      { label: 'Screen Distance Gate', val: 'Real-Time Alert if < 30cm (12 inches)' },
      { label: 'Strain Protection', val: 'Automated 20-20-20 Rest Enforcement' },
      { label: 'Usage Limits', val: 'Custom Daily Limits & Scheduled Lockout' },
      { label: 'Tamper Protection', val: 'Device Administrator Lockout' },
      { label: 'Academic Backing', val: 'AGS Wuzur & Bharti Airtel Foundation' },
      { label: 'Lead Developer', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'novachat-app',
    category: 'software',
    title: 'NOVA CHAT — REAL-TIME MESSENGER',
    tag: 'APP // REAL-TIME MESSAGING',
    desc: 'High-speed messaging platform featuring instant WebSocket sync, voice note streaming, rich media delivery, and cyber glassmorphism responsive UI.',
    img: '/gallery/novachat-mockup.png',
    chip: 'REACT + WEBSOCKET // LIVE APP',
    liveUrl: 'https://novachatapp.netlify.app/',
    specs: [
      { label: 'Frontend Stack', val: 'React SPA + Cyber Glassmorphic UI' },
      { label: 'Messaging Protocol', val: 'Full-Duplex Real-Time WebSockets' },
      { label: 'Voice Notes', val: 'In-Browser High-Fidelity Audio Recording' },
      { label: 'Transmission Latency', val: 'Sub-50ms Instant Synchronization' },
      { label: 'Media Handling', val: 'Encrypted Image & File Transmission' },
      { label: 'Interface Design', val: 'Dark Matrix Aesthetics & Micro-Animations' },
      { label: 'Deployment', val: 'Global CDN on Netlify Edge' },
      { label: 'Lead Developer', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'quickconvert-app',
    category: 'software',
    title: 'QUICKCONVERT — PRIVATE SUITE',
    tag: 'WEB APP // ZERO-SERVER PRIVACY',
    desc: '100% private browser file converter suite with 19+ tools. Converts images, PDFs, audio, and video on-device with zero server uploads.',
    img: '/gallery/quickconvert-preview.png',
    chip: 'NEXT.JS + WASM // LIVE APP',
    liveUrl: 'https://www.quickconvert.bond/',
    specs: [
      { label: 'Privacy Guarantee', val: '100% On-Device In-Browser Processing' },
      { label: 'Tools Available', val: '19+ In-Browser Converters & Manipulators' },
      { label: 'Image Engine', val: 'Client-Side WASM HEIC / PNG / WebP / JPG' },
      { label: 'Document Stack', val: 'In-Memory PDF Merge, Split, Word & Text' },
      { label: 'Media Stack', val: 'Web Audio API Trimmer & Video Frame Extractor' },
      { label: 'Cloud Host', val: 'High-Performance Edge CDN on Vercel' },
      { label: 'Lead Developer', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'gemini-live-engine',
    category: 'software',
    title: 'GEMINI LIVE 24kHz DUPLEX',
    tag: 'AI // MULTIMODAL',
    desc: 'Full-duplex bidirectional audio streaming with sub-second response latency and automatic speech interruption handling.',
    img: '/gallery/omni-pi-voice.png',
    chip: 'GEMINI 2.0 // WS STREAM',
    specs: [
      { label: 'Audio Sample Rate', val: '24kHz 16-bit Mono PCM' },
      { label: 'Network Protocol', val: 'Secure WebSocket (WSS)' },
      { label: 'Roundtrip Latency', val: '0.69 seconds Average' },
      { label: 'Voice Interrupt', val: 'Real-time Server VAD Detection' },
      { label: 'Echo Suppression', val: 'Hardware AEC & Linear DSP' }
    ]
  },
  {
    id: 'tool-calling-orchestrator',
    category: 'software',
    title: 'AUTONOMOUS TOOL CALLING',
    tag: 'SOFTWARE // FUNCTION CALL',
    desc: 'Function calling pipeline mapping spoken natural language intent into discrete motor actions, camera captures, and state shifts.',
    img: '/gallery/omni-pi-face-mouth.png',
    chip: 'JSON SCHEMA // RPC',
    specs: [
      { label: 'Execution Engine', val: 'Declarative JSON Tool Call RPC' },
      { label: 'Tools Supported', val: 'drive(), rotate(), capture(), say()' },
      { label: 'Safety Interlocks', val: 'Ultrasonic Distance Gating (<15cm)' },
      { label: 'Telemetry Log', val: 'Asynchronous Event Emitter' },
      { label: 'Language Core', val: 'Python 3.11 AsyncIO' }
    ]
  },

  // --- CERTIFICATES (ALL 8 OFFICIAL CREDENTIALS) ---
  {
    id: 'cert-ysi-2025',
    category: 'certificates',
    title: 'SPACE KIDZ INDIA — YSI 2025 FINALIST',
    tag: 'HONOR // NATIONAL FINALIST',
    desc: 'National Grand Finale Finalist at Young Scientist India 11th Edition, supported by Office of Principal Scientific Adviser to GoI & Hexaware.',
    img: '/certificates/cert_page_1_1.jpg',
    chip: 'SPACE KIDZ // YSI 2025',
    specs: [
      { label: 'Competition', val: 'Young Scientist India 11th Edition (YSI)' },
      { label: 'Organizers', val: 'Space Kidz India & Hexaware Technologies' },
      { label: 'Endorsement', val: 'Office of the Principal Scientific Adviser, Govt of India' },
      { label: 'Distinction', val: 'National Grand Finale Finalist (Aug 2025)' },
      { label: 'Credential ID', val: 'YSI-11-FIN-2025-UFN' },
      { label: 'Lead Innovator', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'cert-plaksha-yts',
    category: 'certificates',
    title: 'PLAKSHA UNIVERSITY — YOUNG TECH SCHOLAR',
    tag: 'FELLOWSHIP // ROBOTICS',
    desc: 'Fellowship completion certificate for Young Technology Scholars (YTS) & Young Creators League (YCL) on-site summit at Plaksha University Mohali.',
    img: '/certificates/cert_page_8_1.jpg',
    chip: 'PLAKSHA // MOHALI 2024',
    specs: [
      { label: 'Institution', val: 'Plaksha University, Mohali, Punjab' },
      { label: 'Programme', val: 'Young Technology Scholars & Young Creators League' },
      { label: 'Distinction', val: 'National Finalist & Prototype Exhibition' },
      { label: 'Issue Date', val: '26th January 2024' },
      { label: 'Credential Ref', val: 'YCL-2024-PLAKSHA-089' },
      { label: 'Recipient', val: 'Uzair Farooq Naikoo (AGS Wuzur)' }
    ]
  },
  {
    id: 'cert-ethical-hacking',
    category: 'certificates',
    title: 'ETHICAL HACKING & CYBER DEFENSE',
    tag: 'SECURITY // VERIFIED COURSE',
    desc: 'Verified professional course certification covering penetration testing, network reconnaissance, and threat mitigation methodologies.',
    img: '/certificates/cert_page_2_1.jpg',
    chip: 'GREAT LEARNING // CYBER',
    liveUrl: 'https://verify.mygreatlearning.com',
    specs: [
      { label: 'Academy', val: 'Great Learning Academy' },
      { label: 'Distinction', val: 'Verified Course Certification of Completion' },
      { label: 'Credential Ref', val: 'HOXVOPL' },
      { label: 'Verification Portal', val: 'verify.mygreatlearning.com' },
      { label: 'Issue Date', val: 'August 2024' },
      { label: 'Key Domains', val: 'Network Recon, Exploit Mitigation, Linux Hardening' }
    ]
  },
  {
    id: 'cert-google-cyberpeace',
    category: 'certificates',
    title: 'CYBERPEACE CORPS & GOOGLE.ORG',
    tag: 'CYBER DEFENSE // GOOGLE.ORG',
    desc: 'Official First Responders & Mythbusters cybersecurity credential jointly certified by CyberPeace Foundation and Google.org.',
    img: '/certificates/cert_page_5_1.jpg',
    chip: 'CYBERPEACE // FIRST RESPONDER',
    specs: [
      { label: 'Initiative', val: 'CyberPeace Corps & Google.org' },
      { label: 'Distinction', val: 'Certified Cyber First Responder & Mythbuster' },
      { label: 'Credential ID', val: 'CP-USI-GOOG-2025-0526' },
      { label: 'Issue Date', val: 'May 2025' },
      { label: 'Core Skills', val: 'OSINT, Threat Intel, Digital Safety, Social Engineering Defense' },
      { label: 'Candidate', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'cert-ags-gold-2022',
    category: 'certificates',
    title: 'AGS WUZUR 1ST POSITION GOLD MEDAL',
    tag: '1ST POSITION // GOLD MEDAL',
    desc: '1st Position Gold Medal honor in the Science & Robotics Project Competition at Shaheed Lance Naik Nazir Ahmad Wani Memorial.',
    img: '/certificates/cert_page_6_1.jpg',
    chip: 'AGS WUZUR // 1ST POSITION',
    specs: [
      { label: 'Institution', val: 'Army Goodwill School Wuzur' },
      { label: 'Distinction', val: '1st Position (Gold Medal Winner)' },
      { label: 'Event', val: 'Shaheed Lance Naik Nazir Ahmad Wani (AC, SM) Memorial' },
      { label: 'Credential ID', val: 'WCIC-2022-1ST-GOLD-01' },
      { label: 'Issue Date', val: '2022' },
      { label: 'Awardee', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'cert-innofest-2025',
    category: 'certificates',
    title: 'BHARTI AIRTEL FOUNDATION INNOFEST',
    tag: 'STEM FAIR // AIRTEL FOUNDATION',
    desc: 'Certificate of Active Innovation Participation presenting embedded electronics and autonomous robotics under Bharti Airtel Foundation QSP.',
    img: '/certificates/cert_page_3_1.jpg',
    chip: 'INNOFEST 2025 // STEM',
    specs: [
      { label: 'Organization', val: 'Bharti Airtel Foundation' },
      { label: 'Programme', val: 'Quality Support Program (QSP) INNOFEST 2025' },
      { label: 'Venue', val: 'Army Goodwill School Wuzur' },
      { label: 'Distinction', val: 'Active Innovation Participation' },
      { label: 'Issue Date', val: '6th October 2025' },
      { label: 'Credential Ref', val: 'INNOFEST-2025-BAF-AGS' }
    ]
  },
  {
    id: 'cert-finnlogic-workshop',
    category: 'certificates',
    title: 'FINNLOGIC IT PROGRAMMING WORKSHOP',
    tag: 'IT WORKSHOP // SOFTWARE',
    desc: 'Certificate of Training and Hands-on Development in Programming, Full-Stack Logic, and Embedded Coding.',
    img: '/certificates/cert_page_4_1.jpg',
    chip: 'FINNLOGIC TECHWORLD',
    specs: [
      { label: 'Company', val: 'Finnlogic Techworld Pvt Ltd' },
      { label: 'Distinction', val: 'Certificate of Training in Programming & Coding' },
      { label: 'Issue Date', val: 'July 2023' },
      { label: 'Credential Ref', val: 'FINNLOGIC-IT-174928' },
      { label: 'Focus Area', val: 'Software Architecture & Embedded Logic' },
      { label: 'Trainee', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'cert-manf-excellence',
    category: 'certificates',
    title: 'WOMANISTAAN MOKSH ACADEMIC EXCELLENCE',
    tag: 'ACADEMICS // EXCELLENCE',
    desc: 'Certificate of Academic Excellence in Secondary Studies and Leadership Achievement from Womanistaan & MANF.',
    img: '/certificates/cert_page_7_1.jpg',
    chip: 'MOKSH // ACADEMIC MERIT',
    specs: [
      { label: 'Organization', val: 'Womanistaan & MANF Moksh Foundation' },
      { label: 'Distinction', val: 'Certificate of Academic Excellence in Studies' },
      { label: 'Issue Date', val: '2023' },
      { label: 'Credential ID', val: 'MANF-WOMANISTAAN-2023-EXC' },
      { label: 'Honoree', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'young-scientist-india-award',
    category: 'certificates',
    title: 'YOUNG SCIENTIST INDIA & YCL AWARD',
    tag: 'NATIONAL AWARD // TOP 20',
    desc: 'National Finalist and Innovation Awardee in Young Scientist India (H2S Edition) & Young Creators League, organized by Space Kidz India, Hexaware Technologies, and the Office of the Principal Scientific Adviser to the Government of India.',
    img: '/achievements/young_scientist_india_award.png',
    chip: 'SPACE KIDZ // TOP 20',
    specs: [
      { label: 'Competition', val: 'Young Scientist India (H2S Edition) / Young Creators League' },
      { label: 'Organizers', val: 'Space Kidz India & Hexaware Technologies' },
      { label: 'Government Patronage', val: 'Office of the Principal Scientific Adviser to Govt. of India' },
      { label: 'Distinction', val: 'Top 20 All-India Finalist & Innovation Awardee' },
      { label: 'Awardee', val: 'Uzair Farooq Naikoo' },
      { label: 'Focus Area', val: 'Embodied AI, Robotics & Physical Computing' }
    ]
  },

  // --- MY GALLERY & BUILDS ---
  {
    id: 'uzair-portrait-solo',
    category: 'gallery',
    title: 'UZAIR FAROOQ NAIKOO (FOUNDER)',
    tag: 'FOUNDER // PORTRAIT',
    desc: 'Official solo portrait of Uzair Farooq Naikoo — Founder of O.M.N.I Systems, AI Systems Architect, and Embedded Robotics Engineer.',
    img: '/gallery/uzair-portrait-solo.jpg',
    chip: 'OFFICIAL PORTRAIT',
    specs: [
      { label: 'Full Name', val: 'Uzair Farooq Naikoo' },
      { label: 'Role', val: 'Founder & AI Systems Architect' },
      { label: 'Innovations', val: 'O.M.N.I 1.0 Robot, Home IoT Automation' },
      { label: 'Awards', val: 'Young Scientist India Top 20, YCL Plaksha' },
      { label: 'Website', val: 'https://www.uzairnaikoo.cyou' },
      { label: 'Direct Email', val: 'naikoouzair2@gmail.com' }
    ]
  },
  {
    id: 'omni-speech-mouth',
    category: 'gallery',
    title: 'ANIMATED VISOR PHONEMES',
    tag: 'PERSONAL // BUILD',
    desc: 'Real-time mouth and audio waveform animation rendered on 3.5" SPI display synchronized with output speaker sound waves.',
    img: '/gallery/omni-pi-face-mouth.png',
    chip: 'WAVEFORM // 60FPS',
    specs: [
      { label: 'Phoneme Sync', val: 'RMS Audio Amplitude Mapping' },
      { label: 'Display Driver', val: 'SPI Direct Framebuffer' },
      { label: 'Visual Modes', val: 'Happy, Speaking, Thinking, Radar' },
      { label: 'Frame Delay', val: '< 16ms (True 60 FPS)' },
      { label: 'Author', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'omni-bot-prototype',
    category: 'gallery',
    title: 'O.M.N.I 1.0 PHYSICAL ASSEMBLY',
    tag: 'PERSONAL // BUILD',
    desc: 'Complete physical assembly showing custom acrylic tiers, 4WD motor wiring harness, battery telemetry, and camera mount.',
    img: '/frames/ezgif-frame-145.jpg',
    chip: 'ACRYLIC // 4WD BUILD',
    specs: [
      { label: 'Chassis Material', val: '3mm Matte Black Acrylic' },
      { label: 'Tier Count', val: '3 Stacked Compute/Power Decks' },
      { label: 'Weight', val: '860g Complete with Batteries' },
      { label: 'Runtime', val: '3.5 Hours Continuous Navigation' },
      { label: 'Fabrication', val: 'Designed & Built by Uzair' }
    ]
  },
  {
    id: 'plaksha-ycl-summit',
    category: 'gallery',
    title: 'PLAKSHA UNIVERSITY YCL SUMMIT',
    tag: 'FIELD // UNIVERSITY SUMMIT',
    desc: 'Uzair Farooq Naikoo with team delegates and mentors at Plaksha University Mohali for the nationwide Young Creators League exhibition.',
    img: '/school_gallery/ycl_plaksha_1.jpg',
    chip: 'PLAKSHA // MOHALI 2024',
    specs: [
      { label: 'Venue', val: 'Plaksha University Campus, Mohali' },
      { label: 'Programme', val: 'Young Technology Scholars (YTS)' },
      { label: 'Event', val: 'YCL Grand Exhibition (Jan 2024)' },
      { label: 'Delegation', val: 'Army Goodwill School Wuzur' },
      { label: 'Lead Innovator', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'ycl-national-award',
    category: 'gallery',
    title: 'YCL NATIONAL AWARDS CEREMONY',
    tag: 'NATIONAL // YCL FINALS',
    desc: 'Uzair Farooq Naikoo standing on stage honored with the Young Creators League national finalist medal at Plaksha University.',
    img: '/achievements/photo_2026-10-05_16-50-24.jpg',
    chip: 'YCL 2024 // STAGE',
    specs: [
      { label: 'Summit', val: 'Young Creators League Grand Finale' },
      { label: 'Institution', val: 'Plaksha University Mohali' },
      { label: 'Distinction', val: 'National Medal Winner' },
      { label: 'Category', val: 'Hardware & Embedded Innovation' },
      { label: 'Honoree', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'ycl-campus-steps',
    category: 'gallery',
    title: 'YCL MEDALISTS ON CAMPUS STEPS',
    tag: 'CHAMPIONS // PLAKSHA MOHALI',
    desc: 'Uzair Farooq Naikoo holding the official YCL medal alongside fellow student innovators outside the Plaksha University auditorium.',
    img: '/achievements/photo_2026-10-05_16-50-27.jpg',
    chip: 'PLAKSHA // MEDALISTS',
    specs: [
      { label: 'Venue', val: 'Plaksha University Grand Steps' },
      { label: 'Honor', val: 'National Innovation Finalist Medals' },
      { label: 'Delegation', val: 'Jammu & Kashmir Team' },
      { label: 'Innovator', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'home-automation-booth',
    category: 'gallery',
    title: 'HOME AUTOMATION SYSTEM J&K BOOTH',
    tag: 'HARDWARE // IOT AUTOMATION',
    desc: 'Uzair Farooq Naikoo presenting the live IoT Home Automation System booth and working microcontroller circuit to exhibition jury.',
    img: '/achievements/photo_2026-10-05_16-50-34.jpg',
    chip: 'EXPO // J&K BOOTH',
    specs: [
      { label: 'Project', val: 'Home Automated IoT System' },
      { label: 'Exhibition', val: 'State Science & Innovation Expo' },
      { label: 'Support', val: 'Bharti Airtel Foundation' },
      { label: 'Features', val: 'Overheat Cutoff & Energy Regulation' },
      { label: 'Presenter', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'home-automation-testing',
    category: 'gallery',
    title: 'IOT AUTOMATION TESTING BENCH',
    tag: 'HARDWARE // SMART ENERGY',
    desc: 'Uzair Farooq Naikoo seated at the interactive testing station demonstrating dynamic energy optimization and thermal sensor cutoffs.',
    img: '/achievements/photo_2026-10-05_16-50-38.jpg',
    chip: 'HARDWARE // TESTING',
    specs: [
      { label: 'Demonstration', val: 'Live Load Switching & Sensor Telemetry' },
      { label: 'Appliance Safety', val: 'Geyser & AC Overheat Protection' },
      { label: 'System Type', val: 'Microcontroller IoT Automation' },
      { label: 'Hardware Lead', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'home-automated-iot-system',
    category: 'gallery',
    title: 'HOME AUTOMATED IOT SYSTEM',
    tag: 'HARDWARE // BHARTI FOUNDATION',
    desc: 'Home Automated IoT System prototype engineered by Uzair Farooq Naikoo under the Bharti Airtel Foundation Quality Support Program.',
    img: '/achievements/photo_2026-10-05_16-50-39.jpg',
    chip: 'BHARTI FOUNDATION // IOT',
    specs: [
      { label: 'Project Name', val: 'Home Automated IoT System' },
      { label: 'Banner Telemetry', val: 'Comfort Meets Innovation' },
      { label: 'School Lab', val: 'Army Goodwill School Wuzur' },
      { label: 'Partnership', val: 'Bharti Airtel Foundation' },
      { label: 'Designer & Builder', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'ysi-national-trophy',
    category: 'gallery',
    title: 'YSI NATIONAL FINALE TROPHY',
    tag: 'TROPHY // SPACE KIDZ INDIA',
    desc: 'Uzair Farooq Naikoo receiving the Young Scientist India 11th Edition national finalist trophy on stage from esteemed dignitaries.',
    img: '/achievements/photo_2026-10-05_16-50-36.jpg',
    chip: 'SPACE KIDZ // YSI 2025',
    specs: [
      { label: 'Championship', val: 'Young Scientist India 11th Edition' },
      { label: 'Organizers', val: 'Space Kidz India & Hexaware' },
      { label: 'Endorsement', val: 'Principal Scientific Adviser to GoI' },
      { label: 'Awardee', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'news18-broadcast-interview',
    category: 'gallery',
    title: 'NEWS 18 KASHMIR BROADCAST',
    tag: 'BROADCAST // NATIONAL MEDIA',
    desc: 'News 18 Kashmir television journalists interviewing Uzair Farooq Naikoo regarding his innovations in autonomous robotics and smart IoT.',
    img: '/achievements/photo_2026-10-05_16-50-19.jpg',
    chip: 'NEWS 18 // TELEVISION',
    specs: [
      { label: 'Network', val: 'News 18 Kashmir' },
      { label: 'Broadcast Topic', val: 'Student Robotics & Technology Innovation' },
      { label: 'Venue', val: 'AGS Wuzur Campus' },
      { label: 'Interviewee', val: 'Uzair Farooq Naikoo' }
    ]
  },
  {
    id: 'innofest-award-ceremony',
    category: 'gallery',
    title: 'BHARTI FOUNDATION INNOFEST',
    tag: 'INNOVATION // INNOFEST 2025',
    desc: 'Uzair Farooq Naikoo receiving the INNOFEST 2025 Innovation Award from the Indian Army commanding officer at AGS Wuzur.',
    img: '/school_gallery/innofest_1.jpg',
    chip: 'AIRTEL FOUNDATION // 2025',
    specs: [
      { label: 'Event', val: 'INNOFEST 2025 Quality Support Program' },
      { label: 'Presentation', val: 'Indian Army Commanding Officer' },
      { label: 'Foundation', val: 'Bharti Airtel Foundation' },
      { label: 'Recipient', val: 'Uzair Farooq Naikoo' }
    ]
  }
];

let allCards = [...DEFAULT_CARDS];
let currentCategory = 'all';
let filteredCards = [...allCards];
let activeCardIndex = 0;
let currentCylinderAngle = 0;
let targetCylinderAngle = 0;
let isDragging = false;
let startX = 0;
let startAngle = 0;
let buddy3d = null;

// ============================================================================
// 4. CYLINDER RENDERING & MATHEMATICS
// ============================================================================
function setupMobileMenu() {
  const toggleBtn = document.getElementById('hud-mobile-toggle');
  const drawer = document.getElementById('hud-mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
    });
  }

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  const links = drawer.querySelectorAll('.mobile-nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

function initHolographicCylinder() {
  filterGalleryCategory('all');
  setupCylinderInteractions();
  setupFirestoreLiveSync();
  setupCategoryTabs();
  setupCardInspection();
  setupCopyEmail();
  setup3DBuddy();
  setupMobileMenu();
}

function filterGalleryCategory(cat) {
  currentCategory = cat;
  if (cat === 'all') {
    filteredCards = [...allCards];
  } else {
    filteredCards = allCards.filter(c => c.category === cat);
  }

  // Update tabs active state
  if (categoryTabs) {
    categoryTabs.querySelectorAll('.cat-pill').forEach(btn => {
      if (btn.getAttribute('data-cat') === cat) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });
  }

  renderCylinderCards();
  rotateToCardIndex(0);
}

function renderCylinderCards() {
  if (!holoTrack) return;
  holoTrack.innerHTML = '';

  if (filteredCards.length === 0) {
    holoTrack.innerHTML = `
      <div class="empty-gallery-msg">
        <div class="empty-icon">📡</div>
        <div class="empty-title">NO MODULES FOUND IN THIS CATEGORY</div>
        <div class="empty-sub">Switch category filter to inspect telemetry modules</div>
      </div>
    `;
    if (holoCounter) holoCounter.textContent = '00 / 00';
    return;
  }

  filteredCards.forEach((card, index) => {
    const cardEl = document.createElement('article');
    cardEl.className = 'holo-card glass-cut';
    cardEl.setAttribute('data-index', index);
    cardEl.setAttribute('role', 'button');
    cardEl.setAttribute('tabindex', '0');
    cardEl.setAttribute('aria-label', `${card.title} - ${card.tag}`);

    const isCert = card.category === 'certificates' || (card.img && card.img.includes('/certificates/'));

    cardEl.innerHTML = `
      <!-- Dynamic Holographic Rainbow Diffraction & Sheen Layers -->
      <div class="holo-rainbow-bar" aria-hidden="true"></div>
      <div class="holo-scanlines" aria-hidden="true"></div>
      <div class="holo-glare" aria-hidden="true"></div>
      <div class="glass-cut-bevel" aria-hidden="true"></div>

      <div class="holo-card-inner">
        <div class="holo-card-media ${isCert ? 'is-cert-media' : ''}">
          <img src="${card.img}" alt="${card.title}" class="holo-card-img" loading="lazy" />
          <div class="holo-card-scanline"></div>
          <div class="holo-card-corner corner-tl">+</div>
          <div class="holo-card-corner corner-tr">+</div>
          <div class="holo-card-corner corner-bl">+</div>
          <div class="holo-card-corner corner-br">+</div>
          ${isCert ? '<div class="holo-card-cert-badge">VERIFIED CREDENTIAL ✓</div>' : ''}
        </div>
        <div class="holo-card-meta">
          <div class="holo-card-tag-row">
            <span class="holo-card-tag">${card.tag}</span>
            <span class="holo-card-chip">${card.chip || 'TELEMETRY'}</span>
          </div>
          <h3 class="holo-card-title">${card.title}</h3>
          <p class="holo-card-desc">${card.desc}</p>
          <div class="holo-card-inspect-hint">
            <span>${isCert ? 'INSPECT OFFICIAL CREDENTIAL' : 'INSPECT TELEMETRY'}</span>
            <span class="btn-arrow">↗</span>
          </div>
        </div>
      </div>
    `;

    // Click to open inspection
    cardEl.addEventListener('click', () => {
      openCardInspection(card);
    });

    // Keyboard trigger
    cardEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCardInspection(card);
      }
    });

    // Holographic 3D tilt & sheen on mousemove
    setupCardHolographicTilt(cardEl);

    // KIRA pointing interaction
    cardEl.addEventListener('mouseenter', () => {
      if (buddy3d) buddy3d.setPointing(true);
    });
    cardEl.addEventListener('mouseleave', () => {
      if (buddy3d) buddy3d.setPointing(false);
    });

    holoTrack.appendChild(cardEl);
  });

  updateInwardCylinder3D();
}

/**
 * Interactive 3D Tilt & Holographic Iridescent Sheen on Card Hover
 */
function setupCardHolographicTilt(cardEl) {
  const glare = cardEl.querySelector('.holo-glare');

  cardEl.addEventListener('mousemove', (e) => {
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;

    cardEl.style.setProperty('--tilt-x', `${rotX.toFixed(2)}deg`);
    cardEl.style.setProperty('--tilt-y', `${rotY.toFixed(2)}deg`);

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.9) 0%, rgba(0, 240, 255, 0.75) 20%, rgba(255, 230, 0, 0.55) 40%, rgba(255, 0, 128, 0.5) 60%, rgba(189, 0, 255, 0.45) 80%, transparent 100%)`;
      glare.style.opacity = '0.95';
    }
  });

  cardEl.addEventListener('mouseleave', () => {
    cardEl.style.setProperty('--tilt-x', `0deg`);
    cardEl.style.setProperty('--tilt-y', `0deg`);
    if (glare) {
      glare.style.opacity = '0.35';
      glare.style.background = '';
    }
  });
}

const CARD_ANGLE_STEP = 24;

function updateInwardCylinder3D() {
  if (!holoTrack) return;
  const cards = holoTrack.querySelectorAll('.holo-card');
  const total = cards.length;
  if (total === 0) return;

  const radius = Math.max(780, Math.min(1150, window.innerWidth * 0.68));

  let closestIndex = 0;
  let minAngleDiff = 99999;

  cards.forEach((card, index) => {
    const baseAngle = index * CARD_ANGLE_STEP;
    const computedAngle = baseAngle + currentCylinderAngle;

    const span = total * CARD_ANGLE_STEP;
    let normAngle = ((computedAngle % span) + span) % span;
    if (normAngle > span / 2) {
      normAngle -= span;
    }
    const absDiff = Math.abs(normAngle);

    if (absDiff < minAngleDiff) {
      minAngleDiff = absDiff;
      closestIndex = index;
    }

    // Cull cards curving out of view
    if (absDiff > 66) {
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
      card.style.visibility = 'hidden';
      card.style.transform = `translate3d(0, 0, -1800px)`;
      return;
    }

    card.style.visibility = 'visible';
    card.style.pointerEvents = 'auto';

    const rad = (normAngle * Math.PI) / 180;
    const x = Math.sin(rad) * radius;
    const z = (Math.cos(rad) - 1) * radius;
    const rotY = normAngle * 0.78;

    const tiltX = card.style.getPropertyValue('--tilt-x') || '0deg';
    const tiltY = card.style.getPropertyValue('--tilt-y') || '0deg';

    card.style.transform = `translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) rotateX(${tiltX}) rotateY(${tiltY})`;

    if (absDiff < 12) {
      card.classList.add('focused');
      card.style.opacity = '1';
      card.style.filter = 'drop-shadow(0 0 32px rgba(0, 240, 255, 0.55))';
      card.style.zIndex = '30';
    } else {
      card.classList.remove('focused');
      const dimFactor = Math.max(0.35, 1 - (absDiff / 80));
      card.style.opacity = dimFactor.toFixed(2);
      card.style.filter = 'none';
      card.style.zIndex = `${Math.round(20 - absDiff / 4)}`;
    }
  });

  activeCardIndex = closestIndex;
  if (holoCounter) {
    const cur = String(activeCardIndex + 1).padStart(2, '0');
    const tot = String(total).padStart(2, '0');
    holoCounter.textContent = `${cur} / ${tot}`;
  }
}

function rotateToCardIndex(index) {
  targetCylinderAngle = -index * CARD_ANGLE_STEP;
}

function setupCylinderInteractions() {
  if (!holoStage) return;

  // Pointer drag to spin horizontally
  holoStage.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startAngle = targetCylinderAngle;
    holoStage.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    targetCylinderAngle = startAngle + deltaX * 0.22;
  });

  window.addEventListener('pointerup', () => {
    if (isDragging) {
      isDragging = false;
      holoStage.style.cursor = 'grab';
    }
  });

  // Mouse wheel rotation
  holoStage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY || e.deltaX);
    targetCylinderAngle -= delta * CARD_ANGLE_STEP;
  }, { passive: false });

  // Arrow buttons
  if (holoPrevBtn) {
    holoPrevBtn.addEventListener('click', () => {
      targetCylinderAngle += CARD_ANGLE_STEP;
    });
  }

  if (holoNextBtn) {
    holoNextBtn.addEventListener('click', () => {
      targetCylinderAngle -= CARD_ANGLE_STEP;
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowLeft') {
      targetCylinderAngle += CARD_ANGLE_STEP;
    } else if (e.key === 'ArrowRight') {
      targetCylinderAngle -= CARD_ANGLE_STEP;
    } else if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Render loop for smooth cylinder inertia lerp
  function cylinderLoop() {
    const delta = targetCylinderAngle - currentCylinderAngle;
    if (Math.abs(delta) > 0.005) {
      currentCylinderAngle += delta * 0.12;
      updateInwardCylinder3D();
    }
    requestAnimationFrame(cylinderLoop);
  }
  requestAnimationFrame(cylinderLoop);
}

// ============================================================================
// 5. CATEGORY TABS
// ============================================================================
function setupCategoryTabs() {
  if (!categoryTabs) return;
  const buttons = categoryTabs.querySelectorAll('.cat-pill');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      filterGalleryCategory(cat);
    });
  });
}

// ============================================================================
// 6. CARD INSPECTION MODAL
// ============================================================================
function setupCardInspection() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
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

  const isCert = card.category === 'certificates' || (card.img && card.img.includes('/certificates/'));

  // Live Application Uplink & Master Scan Inspection Buttons
  if (inspectActionsRow) {
    let hasAction = false;

    if (inspectLiveLink) {
      if (card.liveUrl) {
        inspectLiveLink.href = card.liveUrl;
        inspectLiveLink.style.display = 'inline-flex';
        hasAction = true;
      } else {
        inspectLiveLink.style.display = 'none';
        inspectLiveLink.href = '#';
      }
    }

    if (inspectRawLink) {
      if (isCert) {
        inspectRawLink.href = card.img;
        inspectRawLink.style.display = 'inline-flex';
        hasAction = true;
      } else {
        inspectRawLink.style.display = 'none';
        inspectRawLink.href = '#';
      }
    }

    inspectActionsRow.style.display = hasAction ? 'block' : 'none';
  }

  openModal(inspectModal);
}

// ============================================================================
// 7. FIRESTORE READ-ONLY CLOUD SYNC
// ============================================================================
function setupFirestoreLiveSync() {
  if (!db || !isFirebaseOnline) {
    if (firebaseStatusLabel) {
      firebaseStatusLabel.textContent = '⚡ LOCAL MATRIX ENGINE ACTIVE';
    }
    return;
  }

  try {
    const q = query(collection(db, 'omni_gallery'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      const remoteCards = [];
      snapshot.forEach((doc) => {
        remoteCards.push({ id: doc.id, ...doc.data() });
      });

      if (remoteCards.length > 0) {
        if (firebaseStatusLabel) {
          firebaseStatusLabel.textContent = `⚡ FIREBASE CLOUD SYNC ACTIVE (${remoteCards.length} ENTRIES)`;
        }
        const cardMap = new Map();
        remoteCards.forEach((c) => cardMap.set(c.id, c));
        allCards.forEach((c) => {
          if (!cardMap.has(c.id)) cardMap.set(c.id, c);
        });
        allCards = Array.from(cardMap.values());
        filterGalleryCategory(currentCategory);
      }
    }, (err) => {
      console.warn('Firestore live sync standby:', err.message);
      if (firebaseStatusLabel) {
        firebaseStatusLabel.textContent = '⚡ SECURE CACHE ACTIVE';
      }
    });
  } catch (err) {
    console.warn('Firestore listener setup standby:', err);
  }
}

// ============================================================================
// 8. MODAL HELPERS & COPY EMAIL
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

function setupCopyEmail() {
  if (btnCopyGalleryEmail) {
    btnCopyGalleryEmail.addEventListener('click', () => {
      navigator.clipboard.writeText('naikoouzair2@gmail.com').then(() => {
        const span = btnCopyGalleryEmail.querySelector('.copy-text') || btnCopyGalleryEmail;
        const oldText = span.textContent;
        span.textContent = 'COPIED TO CLIPBOARD ✓';
        setTimeout(() => span.textContent = oldText, 2000);
      });
    });
  }

  // Modal navigation triggers
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = `modal-${btn.getAttribute('data-modal')}`;
      const targetModal = document.getElementById(targetId);
      if (targetModal) openModal(targetModal);
    });
  });
}

// ============================================================================
// 9. 3D CYBER COMPANION (KIRA-01) THREE.JS INTEGRATION
// ============================================================================
function setup3DBuddy() {
  const container = document.getElementById('kira-3d-canvas-container');
  if (container) {
    buddy3d = new CyberBuddy3D('kira-3d-canvas-container');
  }

  const speechBubble = document.getElementById('buddy-speech-bubble');
  const speechText = document.getElementById('buddy-speech-text');
  const btnMinimize = document.getElementById('btn-bubble-minimize');

  if (btnMinimize && speechBubble) {
    btnMinimize.addEventListener('click', (e) => {
      e.stopPropagation();
      speechBubble.classList.toggle('minimized');
    });
  }

  const avatar = document.getElementById('buddy-avatar');
  if (avatar) {
    avatar.addEventListener('click', () => {
      if (buddy3d) buddy3d.triggerSpin();
      if (speechText) {
        const msgs = [
          "Spinning 3D cylinder matrix! Select category above to filter modules!",
          "Click any module or certificate to inspect full resolution and telemetry!",
          "Direct transmission uplink available via Contact button!"
        ];
        speechText.textContent = msgs[Math.floor(Math.random() * msgs.length)];
        speechBubble?.classList.remove('minimized');
      }
    });
  }
}

// ============================================================================
// 10. BOOTSTRAP ON LOAD
// ============================================================================
document.addEventListener('DOMContentLoaded', initHolographicCylinder);
