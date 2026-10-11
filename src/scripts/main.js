import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const isRTL = root.dir === 'rtl';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Smooth scroll ---------- */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = id.length > 1 && document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -60 });
    else target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---------- Header state ---------- */
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Hero reveal ---------- */
const heroLines = document.querySelectorAll('.hero-title .line > span');
const heroFade = document.querySelectorAll('.hero-eyebrow, .hero-sub, .hero-ctas, .scroll-cue');
const heroImg = document.querySelector('.hero-media img');

function heroIn(delay = 0) {
  const tl = gsap.timeline({ delay });
  tl.fromTo(heroImg, { scale: 1.18 }, { scale: 1, duration: 2.6, ease: 'power3.out' }, 0)
    .fromTo(heroLines, { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.2, stagger: 0.14, ease: 'power4.out' }, 0.25)
    .fromTo(heroFade, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }, 0.55);
  return tl;
}

/* ---------- Intro ---------- */
const intro = document.getElementById('intro');
const skipIntro = root.classList.contains('no-intro') || reduced;

if (reduced) {
  root.classList.add('no-motion');
  intro?.remove();
} else if (skipIntro) {
  intro?.remove();
  heroIn(0.05);
} else if (intro) {
  if (lenis) lenis.stop();
  const light = intro.querySelector('.intro-light');
  const letters = intro.querySelectorAll('.intro-letter');
  const lightH = Math.min(window.innerHeight * 0.34, 260);

  const tl = gsap.timeline({
    onComplete: finish,
  });
  tl.to(light, { scaleX: 1, duration: 0.65, ease: 'power3.inOut' })
    .to(light, { height: lightH, duration: 0.55, ease: 'power3.inOut' }, '-=0.05')
    .fromTo(
      letters,
      { opacity: 0, y: 24, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.07, ease: 'power3.out' },
      '-=0.25'
    )
    .to({}, { duration: 0.25 })
    .add('lift')
    .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut' }, 'lift')
    .add(heroIn(), 'lift+=0.15');

  gsap.set(intro, { clipPath: 'inset(0 0 0% 0)' });

  function finish() {
    intro.remove();
    if (lenis) lenis.start();
    try { sessionStorage.setItem('cc-intro', '1'); } catch (e) {}
  }
  intro.querySelector('.intro-skip').addEventListener('click', () => tl.progress(1));
}

if (!reduced) {
  /* ---------- Reveals ---------- */
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', overwrite: true }),
  });

  /* ---------- Parallax ---------- */
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const amt = parseFloat(el.dataset.parallax) || 10;
    gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        yPercent: amt,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });

  /* ---------- Horizontal gallery (desktop) ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    const pin = document.querySelector('.space-pin');
    const track = document.querySelector('.space-track');
    const distance = () => {
      const r = track.getBoundingClientRect();
      const over = isRTL ? -r.left + parseFloat(getComputedStyle(pin).paddingLeft) : r.right - window.innerWidth + parseFloat(getComputedStyle(pin).paddingRight);
      return Math.max(0, over);
    };
    const tween = gsap.to(track, {
      x: () => (isRTL ? 1 : -1) * distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => '+=' + distance(),
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    gsap.from('.space-intro > *', {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: pin, start: 'top 70%' },
    });
    return () => tween.kill();
  });

  /* ---------- Story images clip-in ---------- */
  gsap.utils.toArray('.story-img, .menu-visual, .visit-media').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(12% 12% 12% 12%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
  });
}

/* ---------- Menu tabs ---------- */
const tabs = [...document.querySelectorAll('.tab')];
function select(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls'));
    panel.hidden = !on;
    if (on && !reduced) {
      gsap.fromTo(panel.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
    }
  });
  ScrollTrigger.refresh();
}
tabs.forEach((t, i) => {
  t.tabIndex = i === 0 ? 0 : -1;
  t.addEventListener('click', () => select(t));
  t.addEventListener('keydown', (e) => {
    const fwd = isRTL ? 'ArrowLeft' : 'ArrowRight';
    const back = isRTL ? 'ArrowRight' : 'ArrowLeft';
    let n = null;
    if (e.key === fwd) n = tabs[(i + 1) % tabs.length];
    if (e.key === back) n = tabs[(i - 1 + tabs.length) % tabs.length];
    if (n) { e.preventDefault(); n.focus(); select(n); }
  });
});

window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
