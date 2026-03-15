/* ── Restore opacity on back/forward navigation ── */
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    document.body.style.opacity = '';
    document.body.style.transition = '';
    document.body.classList.remove('fade-out');
  }
});

/* ── Page transitions ── */
document.querySelectorAll('.card-case[href]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    e.preventDefault();
    document.body.classList.add('fade-out');

    setTimeout(() => {
      window.location.href = href;
    }, 300);
  });
});

/* ── Sticky header ── */
const stickyHeader = document.getElementById('stickyHeader');
const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

/* Desktop: IntersectionObserver on card-name */
const cardName = document.querySelector('.card-name');
const nameObserver = new IntersectionObserver(([entry]) => {
  if (!isMobile()) {
    stickyHeader.classList.toggle('visible', !entry.isIntersecting);
  }
}, { threshold: 0 });
nameObserver.observe(cardName);

/* Mobile: scroll listener on contact-grid */
const contactGrid = document.querySelector('.contact-grid');
window.addEventListener('scroll', () => {
  if (isMobile() && contactGrid) {
    const rect = contactGrid.getBoundingClientRect();
    stickyHeader.classList.toggle('visible', rect.bottom < 0);
  }
}, { passive: true });

/* Enable transitions only after first observer tick, to prevent flash on page load */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    stickyHeader.classList.add('ready');
  });
});

stickyHeader.querySelector('.sticky-contact-btn').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Resume accordions ── */
function updateAccordions() {
  const mobile = isMobile();
  document.querySelectorAll('.resume-accordion').forEach(d => {
    if (!mobile) {
      d.setAttribute('open', '');
    }
  });
}
updateAccordions();
if (isMobile()) {
  document.querySelectorAll('.resume-accordion').forEach(d => d.removeAttribute('open'));
}
window.addEventListener('resize', updateAccordions);

/* ── Preview hover ── */
const hoverCards = document.querySelectorAll('[data-cover]');
const previewPhoto = document.getElementById('previewPhoto');
const previewCover = document.getElementById('previewCover');
const previewImage = document.getElementById('previewImage');
const phoneFrame = document.querySelector('.phone-frame');

let currentCover = null;
let leaveTimer = null;

function showPhone(cover) {
  // Animate out
  phoneFrame.classList.remove('active');

  setTimeout(() => {
    // Swap image while hidden
    previewImage.src = cover;
    currentCover = cover;
    // Animate in
    phoneFrame.classList.add('active');
  }, 300);
}

hoverCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    clearTimeout(leaveTimer);
    const cover = card.dataset.cover;

    if (card.classList.contains('hero')) {
      phoneFrame.classList.remove('active');
      previewPhoto.classList.remove('hidden');
      previewCover.classList.remove('visible');
      currentCover = null;
      return;
    }

    previewPhoto.classList.add('hidden');
    previewCover.classList.add('visible');

    if (cover && cover !== currentCover) {
      if (currentCover) {
        // Switching between cases
        showPhone(cover);
      } else {
        // First case — set image, reset position instantly, then animate in
        previewImage.src = cover;
        currentCover = cover;
        phoneFrame.classList.add('no-transition');
        phoneFrame.classList.remove('active');
        void phoneFrame.offsetWidth;
        phoneFrame.classList.remove('no-transition');
        phoneFrame.classList.add('active');
      }
    }
  });

  card.addEventListener('mouseleave', () => {
    leaveTimer = setTimeout(() => {
      phoneFrame.classList.remove('active');
      previewPhoto.classList.remove('hidden');
      previewCover.classList.remove('visible');
      currentCover = null;
    }, 50);
  });
});
