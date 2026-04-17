gsap.registerPlugin(ScrollTrigger);

/* ── Hero: orb entrance ────────────────────────────── */
gsap.from('#heroOrb',    { opacity: 0, scale: 0.88, duration: 2.0, ease: 'power2.out', delay: 0.1 });
gsap.from('#heroContent',{ opacity: 0, y: 22,       duration: 1.2, ease: 'power2.out', delay: 0.5 });
gsap.from('#scrollCue',  { opacity: 0,              duration: 0.8,                     delay: 1.6 });

/* ── Orbiting dots ─────────────────────────────────── */
const orbOrigin = '300px 300px';
gsap.to('#orbDot1', { rotation:  360, transformOrigin: orbOrigin, duration: 14, ease: 'none', repeat: -1 });
gsap.to('#orbDot2', { rotation: -360, transformOrigin: orbOrigin, duration: 9,  ease: 'none', repeat: -1 });
gsap.to('#orbDot3', { rotation:  360, transformOrigin: orbOrigin, duration: 20, ease: 'none', repeat: -1 });
gsap.to('#orbDot4', { rotation: -360, transformOrigin: orbOrigin, duration: 12, ease: 'none', repeat: -1 });

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
