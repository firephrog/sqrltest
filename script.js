const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // read the CSS variable directly
      const color = getComputedStyle(entry.target).getPropertyValue('--bg').trim();
      document.body.style.backgroundColor = color;
    }
  });
}, { threshold: 0.5 });

sections.forEach(sec => observer.observe(sec));
