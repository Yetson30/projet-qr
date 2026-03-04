/* ============================================
   QR Poster Studio — Main JS
   Interactions, nav active scroll, animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR SCROLL ACTIVE ---- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], div[id]');
  const navbar = document.getElementById('navbar');

  function updateActiveNav() {
    const scrollY = window.scrollY;
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    if (scrollY > 10) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
    } else {
      navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---- SMOOTH SCROLL FOR NAV LINKS ---- */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---- INTERSECTION OBSERVER — FADE IN ---- */
  const fadeElements = document.querySelectorAll(
    '.module-card, .kpi-card, .sprint-card, .tech-item, .data-card, .v2-feature, .context-item'
  );

  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on element index in parent
        const siblings = Array.from(entry.target.parentElement.children);
        const index = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeElements.forEach(el => observer.observe(el));

  /* ---- TREE ITEM HOVER TOOLTIP ---- */
  const treeItems = document.querySelectorAll('.tree-item[data-tooltip]');
  treeItems.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip-popup';
      tooltip.textContent = item.dataset.tooltip;
      tooltip.style.cssText = `
        position: fixed;
        background: #1E293B;
        color: white;
        padding: 0.3rem 0.75rem;
        border-radius: 6px;
        font-size: 0.72rem;
        font-family: var(--font-sans);
        z-index: 9999;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(tooltip);

      const rect = item.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 8}px`;
      tooltip.style.top = `${rect.top + rect.height / 2 - tooltip.offsetHeight / 2}px`;

      item._tooltip = tooltip;
    });
    item.addEventListener('mouseleave', () => {
      if (item._tooltip) {
        item._tooltip.remove();
        item._tooltip = null;
      }
    });
  });

  /* ---- ANIMATED COUNTERS (KPIs) ---- */
  const kpiValues = document.querySelectorAll('.kpi-value');
  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        // Simple pulse animation for kpis
        el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = 'scale(1.15)';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 400);
        kpiObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  kpiValues.forEach(el => kpiObserver.observe(el));

  /* ---- PROGRESS RINGS ANIMATION ---- */
  // Animate when they come into view (currently showing 0% as not started)
  const progressRings = document.querySelectorAll('.progress-fill');
  const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Currently set to 0% pending start - just add a subtle pulse
        el.style.animation = 'ringPulse 2s ease-in-out infinite';
        ringObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  progressRings.forEach(el => ringObserver.observe(el));

  /* ---- FILE TREE EXPAND/COLLAPSE ---- */
  const treeFolders = document.querySelectorAll('.tree-item.tree-folder');
  treeFolders.forEach(folder => {
    const nextSibling = folder.nextElementSibling;
    if (nextSibling && (nextSibling.classList.contains('tree-sub') || nextSibling.classList.contains('tree-sub-2') || nextSibling.classList.contains('tree-sub-3'))) {
      folder.style.cursor = 'pointer';
      folder.addEventListener('click', () => {
        const isHidden = nextSibling.style.display === 'none';
        nextSibling.style.display = isHidden ? 'flex' : 'none';
        const icon = folder.querySelector('i.fa-folder, i.fa-folder-open');
        if (icon) {
          icon.classList.toggle('fa-folder', !isHidden);
          icon.classList.toggle('fa-folder-open', isHidden);
        }
      });
    }
  });

  /* ---- PHASE BLOCKS ENTRANCE ---- */
  const phaseBlocks = document.querySelectorAll('.phase-block');
  phaseBlocks.forEach(block => {
    block.style.opacity = '0';
    block.style.transform = 'translateX(-20px)';
    block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const phaseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        phaseObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  phaseBlocks.forEach(el => phaseObserver.observe(el));

  /* ---- HERO ORBS PARALLAX ---- */
  const orbs = document.querySelectorAll('.hero-orb');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.4;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });

  /* ---- COPY CODE BLOCK ---- */
  const codeBlock = document.querySelector('.code-block');
  if (codeBlock) {
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copier';
    copyBtn.style.cssText = `
      position: absolute;
      top: 0.75rem;
      right: 1rem;
      background: rgba(255,255,255,0.1);
      color: #94A3B8;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 0.3rem 0.75rem;
      font-size: 0.72rem;
      cursor: pointer;
      font-family: var(--font-sans);
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    `;
    const codePreview = document.querySelector('.code-preview');
    if (codePreview) {
      codePreview.style.position = 'relative';
      codePreview.appendChild(copyBtn);
    }

    copyBtn.addEventListener('click', () => {
      const text = codeBlock.innerText;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copié!';
        copyBtn.style.color = '#86EFAC';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copier';
          copyBtn.style.color = '#94A3B8';
        }, 2000);
      });
    });
  }

  /* ---- KEYBOARD SHORTCUTS HINT ---- */
  document.addEventListener('keydown', (e) => {
    // Press '1'-'6' to navigate sections
    const sections = ['overview', 'architecture', 'modules', 'roadmap', 'data', 'tech'];
    const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5 };
    if (keyMap[e.key] !== undefined && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const target = document.getElementById(sections[keyMap[e.key]]);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* ---- MODULE CARDS CLICK EXPAND (mock detail) ---- */
  const moduleCards = document.querySelectorAll('.module-card');
  moduleCards.forEach(card => {
    card.addEventListener('click', () => {
      // Visual feedback — brief highlight
      card.style.boxShadow = '0 0 0 3px rgba(244,130,31,0.4)';
      setTimeout(() => { card.style.boxShadow = ''; }, 600);
    });
  });

  console.log('%cQR Poster Studio — Architecture & Roadmap', 'color: #F4821F; font-size: 1.2rem; font-weight: bold;');
  console.log('%cMoov Money Gabon · v1.1 · Mars 2026', 'color: #6B7280; font-size: 0.85rem;');
  console.log('%cRaccourcis: touches 1-6 pour naviguer entre sections', 'color: #3B82F6; font-size: 0.8rem;');
});

/* ---- CSS ANIMATION KEYFRAMES (injected) ---- */
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes ringPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes floatOrb {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  .hero-orb-1 { animation: floatOrb 8s ease-in-out infinite; }
  .hero-orb-2 { animation: floatOrb 6s ease-in-out infinite reverse; }
  .hero-orb-3 { animation: floatOrb 10s ease-in-out infinite 2s; }
`;
document.head.appendChild(styleTag);
