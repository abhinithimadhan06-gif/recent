(() => {
  const initializeAnimations = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const targets = document.querySelectorAll([
      '#main > section',
      '.hero-copy',
      '.hero-portrait',
      '.hero-portfolio-rail'
    ].join(','));

    if (!targets.length || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((target, index) => {
      target.classList.add('motion-reveal');
      observer.observe(target);
    });

    document.documentElement.classList.add('motion-enabled');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations, { once: true });
  } else {
    initializeAnimations();
  }
})();
