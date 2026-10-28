document.addEventListener('DOMContentLoaded', () => {
  initMainSectionOrder();
  initEditorialCursor();
  initPaletteThemeSwitcher();
  initCommissionForm();
  initPortfolioEnvelope();
  initHeaderAndScroll();
  initMobileNavigation();
  initSectionNavigation();
});

function initEditorialCursor() {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reducedMotion.matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'editorial-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="editorial-cursor-smoke-layer"></span><span class="editorial-cursor-ring"></span><span class="editorial-cursor-heart" aria-hidden="true">♥</span>';
  document.body.append(cursor);

  const smokeLayer = cursor.querySelector('.editorial-cursor-smoke-layer');
  const ring = cursor.querySelector('.editorial-cursor-ring');
  let pointerX = 0;
  let pointerY = 0;
  let ringX = 0;
  let ringY = 0;
  let frame = 0;
  let lastSmokeAt = 0;

  const moveRing = () => {
    ringX += (pointerX - ringX) * 0.22;
    ringY += (pointerY - ringY) * 0.22;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    if (Math.abs(pointerX - ringX) > 0.2 || Math.abs(pointerY - ringY) > 0.2) {
      frame = window.requestAnimationFrame(moveRing);
    } else {
      frame = 0;
    }
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;

    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor.style.setProperty('--cursor-x', `${pointerX}px`);
    cursor.style.setProperty('--cursor-y', `${pointerY}px`);
    document.body.classList.add('editorial-cursor-enabled');

    const now = performance.now();
    if (now - lastSmokeAt > 55 && smokeLayer.childElementCount < 12) {
      lastSmokeAt = now;
      const puff = document.createElement('span');
      puff.className = 'editorial-cursor-smoke';
      puff.style.left = `${pointerX + (Math.random() - 0.5) * 12}px`;
      puff.style.top = `${pointerY + (Math.random() - 0.5) * 12}px`;
      puff.style.setProperty('--smoke-size', `${18 + Math.random() * 16}px`);
      puff.style.setProperty('--smoke-drift', `${(Math.random() - 0.5) * 24}px`);
      smokeLayer.append(puff);
      puff.addEventListener('animationend', () => puff.remove(), { once: true });
    }

    if (!frame) {
      ringX = pointerX;
      ringY = pointerY;
      frame = window.requestAnimationFrame(moveRing);
    }
  }, { passive: true });

  document.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse') return;
    const target = event.target instanceof Element ? event.target : null;
    cursor.classList.toggle('is-interactive', Boolean(target?.closest('a, button, input, select, textarea, label, [role="button"]')));
  }, { passive: true });

  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') cursor.classList.add('is-pressed');
  });
  document.addEventListener('pointerup', (event) => {
    if (event.pointerType === 'mouse') cursor.classList.remove('is-pressed');
  });
  document.documentElement.addEventListener('pointerleave', () => {
    document.body.classList.remove('editorial-cursor-enabled');
  });
}

function initPortfolioEnvelope() {
  const section = document.getElementById('works');
  const envelope = document.getElementById('portfolioEnvelope');
  const hint = document.getElementById('portfolioEnvelopeHint');
  const grid = document.getElementById('archivalGrid');
  if (!section || !envelope || !hint || !grid) return;

  section.classList.add('envelope-ready');

  envelope.addEventListener('click', () => {
    if (envelope.disabled) return;

    const isOpening = !section.classList.contains('envelope-open');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const schedule = (callback, delay) => window.setTimeout(callback, reducedMotion ? 0 : delay);

    envelope.disabled = true;

    if (isOpening) {
      section.classList.add('envelope-open');
      grid.inert = false;
      grid.setAttribute('aria-hidden', 'false');
      envelope.setAttribute('aria-expanded', 'true');
      envelope.setAttribute('aria-label', 'Close portfolio envelope');
      envelope.querySelector('.portfolio-envelope-label').textContent = 'OPENING PORTFOLIO';
      hint.textContent = 'Your projects are on their way';

      schedule(() => {
        section.classList.add('cards-revealed');
        envelope.querySelector('.portfolio-envelope-label').textContent = 'CLOSE ENVELOPE';
        hint.textContent = 'Click the envelope to put the projects away';
        schedule(() => {
          envelope.disabled = false;
        }, 850);
      }, 900);
      return;
    }

    grid.inert = true;
    grid.setAttribute('aria-hidden', 'true');
    section.classList.remove('cards-revealed');
    envelope.setAttribute('aria-expanded', 'false');
    envelope.setAttribute('aria-label', 'Open portfolio envelope');
    envelope.querySelector('.portfolio-envelope-label').textContent = 'CLOSING ENVELOPE';
    hint.textContent = 'Putting the projects away';

    schedule(() => {
      section.classList.remove('envelope-open');
      envelope.querySelector('.portfolio-envelope-label').textContent = 'OPEN PORTFOLIO';
      hint.textContent = 'Click the envelope to view the four projects';
      schedule(() => {
        envelope.disabled = false;
      }, 850);
    }, 850);
  });

  grid.inert = true;
  grid.setAttribute('aria-hidden', 'true');
}

function initMainSectionOrder() {
  const main = document.getElementById('main');
  if (!main) return;

  ['hero', 'about', 'works', 'philosophy', 'contact'].forEach((id) => {
    const section = document.getElementById(id);
    if (section) main.append(section);
  });
}

function initPaletteThemeSwitcher() {
  const swatches = document.querySelectorAll('.swatch-item');
  const colorThemes = {
    '#8E1426': { crimson: '#8E1426', crimsonLight: '#A82036', stamp: '#8E1426', name: 'Carmine Crimson' },
    '#C9A46A': { crimson: '#A27B42', crimsonLight: '#C9A46A', stamp: '#A27B42', name: 'Atelier Gold' },
    '#1E1E1E': { crimson: '#1E1E1E', crimsonLight: '#444444', stamp: '#1E1E1E', name: 'Soft Charcoal' },
    '#B7B1A7': { crimson: '#756F65', crimsonLight: '#958F85', stamp: '#756F65', name: 'Warm Stone' },
    '#F7F4EC': { crimson: '#706957', crimsonLight: '#918A76', stamp: '#706957', name: 'Soft Ivory' }
  };

  swatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      swatches.forEach((item) => item.classList.remove('active'));
      swatch.classList.add('active');

      const theme = colorThemes[swatch.getAttribute('data-color')];
      if (!theme) return;

      document.documentElement.style.setProperty('--crimson-accent', theme.crimson);
      document.documentElement.style.setProperty('--crimson-light', theme.crimsonLight);
      document.documentElement.style.setProperty('--stamp-red', theme.stamp);
      showAtelierToast(`Atelier Accent Shifted: ${theme.name}`);
    });
  });
}

function showAtelierToast(message) {
  let toast = document.getElementById('atelierToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'atelierToast';
    toast.setAttribute('role', 'status');
    toast.style.cssText = `
      position: fixed;
      bottom: 25px;
      right: 25px;
      background: #141314;
      color: #F8F5EE;
      font-family: var(--font-mono, --aston-script);
      font-size: 0.72rem;
      padding: 0.65rem 1.25rem;
      border-left: 3px solid var(--crimson-accent);
      z-index: 10000;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      pointer-events: none;
    `;
    document.body.append(toast);
  }

  toast.textContent = `✦ ${message}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  window.clearTimeout(toast.hideTimeout);
  toast.hideTimeout = window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
  }, 2400);
}

function initCommissionForm() {
  const form = document.getElementById('commissionForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let isValid = true;
    const validateField = (id, isFieldValid) => {
      const input = document.getElementById(id);
      const group = input.closest('.form-group');
      group.classList.toggle('has-error', !isFieldValid);
      isValid = isFieldValid && isValid;
      return input;
    };

    const nameInput = validateField('clientName', Boolean(document.getElementById('clientName').value.trim()));
    const emailInput = validateField('clientEmail', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('clientEmail').value.trim()));
    const serviceInput = validateField('serviceType', Boolean(document.getElementById('serviceType').value));
    const messageInput = validateField('projectDetails', document.getElementById('projectDetails').value.trim().length >= 8);

    if (!isValid) return;

    const subject = `Fashion commission inquiry from ${nameInput.value.trim()}`;
    const body = [
      `Name: ${nameInput.value.trim()}`,
      `Email: ${emailInput.value.trim()}`,
      `Service: ${serviceInput.options[serviceInput.selectedIndex].text}`,
      '',
      'Project brief:',
      messageInput.value.trim()
    ].join('\n');

    window.location.href = `mailto:abhinithimadhan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

function initHeaderAndScroll() {
  const header = document.getElementById('topNavBar');
  const backToTop = document.getElementById('backToTopBtn');
  if (!header) return;

  const updateSectionScrollOffset = () => {
    const offset = Math.ceil(header.getBoundingClientRect().height + 12);
    document.documentElement.style.setProperty('--section-scroll-offset', `${offset}px`);
  };

  updateSectionScrollOffset();
  window.addEventListener('resize', updateSectionScrollOffset, { passive: true });
  if ('ResizeObserver' in window) {
    new ResizeObserver(updateSectionScrollOffset).observe(header);
  }

  let scrollUpdatePending = false;

  window.addEventListener('scroll', () => {
    if (scrollUpdatePending) return;
    scrollUpdatePending = true;

    window.requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 50);
      scrollUpdatePending = false;
    });
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function initSectionNavigation() {
  const header = document.getElementById('topNavBar');
  if (!header) return;

  const getSectionFromHash = (hash) => {
    if (!hash || hash === '#') return null;
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  };

  const scrollToSection = (section, behavior = 'smooth') => {
    const top = section.id === 'hero'
      ? 0
      : section.getBoundingClientRect().top + window.scrollY - header.getBoundingClientRect().height - 12;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : behavior
    });
  };

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest('a[href]');
    if (!(link instanceof HTMLAnchorElement) || link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;

    const section = getSectionFromHash(url.hash);
    if (!section) return;

    event.preventDefault();
    if (window.location.hash !== url.hash) {
      window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
    scrollToSection(section);
  });

  window.addEventListener('popstate', () => {
    const section = getSectionFromHash(window.location.hash);
    if (section) scrollToSection(section, 'auto');
  });

  const initialSection = getSectionFromHash(window.location.hash);
  if (initialSection) {
    window.requestAnimationFrame(() => scrollToSection(initialSection, 'auto'));
  }
}

function initMobileNavigation() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.querySelector('.center-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('mobile-active');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav-item').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}
