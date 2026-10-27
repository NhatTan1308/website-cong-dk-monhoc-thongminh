(() => {
  const observedRevealElements = new WeakSet();
  const observedCounters = new WeakSet();
  const observedProgress = new WeakSet();
  let revealObserver;
  let counterObserver;
  let progressObserver;

  const revealOnScreen = () => {
    document.querySelectorAll('[data-scroll-reveal]').forEach((element) => {
      if (element.classList.contains('animate__animated') || observedRevealElements.has(element)) return;
      observedRevealElements.add(element);
      element.classList.add('scroll-reveal');
      if (revealObserver) revealObserver.observe(element);
      else element.classList.add('is-visible');
    });

    document.querySelectorAll('[data-count-to]').forEach((element) => {
      if (observedCounters.has(element)) return;
      const target = Number(element.dataset.countTo);
      if (!Number.isFinite(target)) return;
      observedCounters.add(element);
      if (counterObserver) {
        element.textContent = '0';
        counterObserver.observe(element);
      }
    });

    document.querySelectorAll('[data-progress-value]').forEach((element) => {
      if (observedProgress.has(element)) return;
      const target = Number(element.dataset.progressValue);
      const progress = element.querySelector('.fg');
      if (!progress || !Number.isFinite(target)) return;
      observedProgress.add(element);
      if (progressObserver) {
        progress.style.strokeDasharray = '0 100';
        progressObserver.observe(element);
      }
    });
  };

  const initializeUIEffects = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion && 'IntersectionObserver' in window) {
      revealObserver ||= new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

      counterObserver ||= new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target;
          const target = Number(element.dataset.countTo);
          const startTime = performance.now();
          const duration = 850;
          const update = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            element.textContent = Math.round(target * eased).toLocaleString('vi-VN');
            if (progress < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
          observer.unobserve(element);
        });
      }, { threshold: 0.5 });

      progressObserver ||= new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target;
          const progress = element.querySelector('.fg');
          progress.style.strokeDasharray = `${Number(element.dataset.progressValue)} 100`;
          observer.unobserve(element);
        });
      }, { threshold: 0.5 });
    }

    revealOnScreen();
  };

  window.initUIEffects = initializeUIEffects;
  document.addEventListener('DOMContentLoaded', initializeUIEffects, { once: true });
})();
