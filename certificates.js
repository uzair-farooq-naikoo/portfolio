/**
 * CERTIFICATES ARCHIVE MODULE — UZAIR FAROOQ NAIKOO
 * Dedicated high-resolution holographic credentials matrix with master scans
 */

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
    thumbImg: '/certificates/cert_page_1_1.jpg',
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
    thumbImg: '/certificates/cert_page_8_1.jpg',
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
    thumbImg: '/certificates/cert_page_2_1.jpg',
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
    thumbImg: '/certificates/cert_page_5_1.jpg',
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
    thumbImg: '/certificates/cert_page_6_1.jpg',
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
    thumbImg: '/certificates/cert_page_3_1.jpg',
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
    thumbImg: '/certificates/cert_page_4_1.jpg',
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
    thumbImg: '/certificates/cert_page_7_1.jpg',
    badge: 'ACADEMIC EXCELLENCE // SRINAGAR',
    desc: 'Recognized for outstanding academic distinction and continuous excellence in science and engineering studies by the MANF Foundation in Srinagar.'
  }
];

let currentCertIndex = 0;

function renderCertificates(filter = 'all') {
  const grid = document.getElementById('certificates-page-grid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? CERTIFICATES_DATA
    : CERTIFICATES_DATA.filter(c => c.category === filter);

  grid.innerHTML = filtered.map((c) => {
    const originalIndex = CERTIFICATES_DATA.indexOf(c);
    const isGold = c.badge.includes('1ST POSITION') || c.badge.includes('GOLD');

    return `
      <article class="cert-card glass-cut ${isGold ? 'featured-gold' : ''}" data-cert-index="${originalIndex}">
        <div class="holo-rainbow-bar"></div>
        <div class="holo-scanlines"></div>
        <div class="holo-glare"></div>
        <div class="holo-security-seal">AUTH<br/>VERIFIED</div>

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
              <span class="cert-status-badge">✦ 100% VERIFIED</span>
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

  setupHolographicTilt(grid);
}

function setupHolographicTilt(container) {
  container.querySelectorAll('.cert-card').forEach(cardEl => {
    const glare = cardEl.querySelector('.holo-glare');

    cardEl.addEventListener('mousemove', (e) => {
      const rect = cardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -10;
      const rotY = ((x - centerX) / centerX) * 10;

      cardEl.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.9) 0%, rgba(0, 240, 255, 0.75) 20%, rgba(255, 230, 0, 0.55) 40%, rgba(255, 0, 128, 0.5) 60%, rgba(189, 0, 255, 0.45) 80%, transparent 100%)`;
        glare.style.opacity = '0.95';
      }
    });

    cardEl.addEventListener('mouseleave', () => {
      cardEl.style.transform = '';
      if (glare) {
        glare.style.opacity = '0.28';
        glare.style.background = '';
      }
    });
  });
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

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
window._openCertModal = openCertModal;

function closeModals() {
  document.querySelectorAll('.cyber-modal-overlay').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  renderCertificates('all');

  // Filter tabs
  const filterBar = document.getElementById('cert-page-filter-bar');
  if (filterBar) {
    filterBar.querySelectorAll('.cert-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        filterBar.querySelectorAll('.cert-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderCertificates(pill.getAttribute('data-filter') || 'all');
      });
    });
  }

  // Modal close button
  const closeBtn = document.getElementById('btn-close-cert-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeModals);

  // Overlay click to close
  document.querySelectorAll('.cyber-modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModals();
    });
  });

  // Prev / Next buttons
  const prevBtn = document.getElementById('btn-cert-prev');
  const nextBtn = document.getElementById('btn-cert-next');
  if (prevBtn) prevBtn.addEventListener('click', () => openCertModal(currentCertIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => openCertModal(currentCertIndex + 1));

  // Keybindings (Esc, ArrowLeft, ArrowRight)
  window.addEventListener('keydown', (e) => {
    const certModal = document.getElementById('modal-cert-inspect');
    if (certModal && certModal.classList.contains('active')) {
      if (e.key === 'Escape') closeModals();
      else if (e.key === 'ArrowLeft') openCertModal(currentCertIndex - 1);
      else if (e.key === 'ArrowRight') openCertModal(currentCertIndex + 1);
    }
  });

  // Hardware lab and contact triggers
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const target = document.getElementById(`modal-${modalId}`);
      if (target) {
        target.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });
});
