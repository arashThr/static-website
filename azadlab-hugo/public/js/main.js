gsap.registerPlugin(ScrollTrigger);

/* ── Eye: open on load ─────────────────────────────── */
const LID_Y = 230;

const openTl = gsap.timeline({ delay: 0.2 });
openTl
  .to('#lidTop', { y: -LID_Y, duration: 1.8, ease: 'power2.inOut' }, 0)
  .to('#lidBot', { y:  LID_Y, duration: 1.8, ease: 'power2.inOut' }, 0)
  .from('#heroContent', { opacity: 0, y: 18, duration: 1, ease: 'power2.out' }, 1.0)
  .from('#scrollCue',   { opacity: 0, duration: 0.7 }, 1.7);

/* ── Eye: iris tracks pointer ──────────────────────── */
function trackPointer(px, py) {
  const svg = document.getElementById('heroEye');
  if (!svg) return;
  const r  = svg.getBoundingClientRect();
  const nx = Math.max(-1, Math.min(1, (px - (r.left + r.width  / 2)) / (r.width  / 2)));
  const ny = Math.max(-1, Math.min(1, (py - (r.top  + r.height / 2)) / (r.height / 2)));
  gsap.to(['#eyeIris', '#eyePupil'], {
    x: nx * 22, y: ny * 14,
    duration: 0.5, ease: 'power2.out', overwrite: true,
  });
}

window.addEventListener('mousemove', e => trackPointer(e.clientX, e.clientY));
window.addEventListener('touchmove', e => {
  trackPointer(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

/* ── Eye: blink loop ───────────────────────────────── */
function blink() {
  setTimeout(() => {
    const tl = gsap.timeline({ onComplete: blink });
    tl.to(['#lidTop', '#lidBot'], { y: 0, duration: 0.11, ease: 'power1.in' }, 0)
      .to('#lidTop', { y: -LID_Y, duration: 0.18, ease: 'power1.out' })
      .to('#lidBot', { y:  LID_Y, duration: 0.18, ease: 'power1.out' }, '<');
  }, 4500 + Math.random() * 9000);
}
openTl.eventCallback('onComplete', blink);

/* ── Generic fade-up helper ────────────────────────── */
function reveal(el, extra) {
  gsap.from(el, Object.assign({
    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    y: 34, opacity: 0, duration: 0.78, ease: 'power2.out',
  }, extra || {}));
}

/* ── Curriculum ────────────────────────────────────── */
reveal('#curriculumIntro');
gsap.from('#sessList .sess-card', {
  scrollTrigger: { trigger: '#sessList', start: 'top 78%' },
  y: 26, opacity: 0, stagger: 0.09, duration: 0.65, ease: 'power2.out',
});

/* ── Own vs Rent ───────────────────────────────────── */
gsap.from('#dataList .data-item', {
  scrollTrigger: { trigger: '#dataList', start: 'top 80%' },
  y: 28, opacity: 0, stagger: 0.13, duration: 0.65, ease: 'power2.out',
});

/* ── Preparedness ──────────────────────────────────── */
gsap.from('#incidentList .incident', {
  scrollTrigger: { trigger: '#incidentList', start: 'top 78%' },
  y: 26, opacity: 0, stagger: 0.18, duration: 0.7, ease: 'power2.out',
});
reveal('#shutdownAlert');

/* ── About ─────────────────────────────────────────── */
gsap.from('#about .about-photo-col', {
  scrollTrigger: { trigger: '#about .about-layout', start: 'top 82%' },
  x: -24, opacity: 0, duration: 0.75, ease: 'power2.out',
});
gsap.from('#about .about-body > *', {
  scrollTrigger: { trigger: '#about .about-layout', start: 'top 82%' },
  y: 22, opacity: 0, stagger: 0.1, duration: 0.65, ease: 'power2.out',
});

/* ── Join ──────────────────────────────────────────── */
['#joinHeading', '#joinCta', '#joinContacts', '#joinFoot'].forEach((sel, i) =>
  reveal(sel, { delay: i * 0.08 })
);
