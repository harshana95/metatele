'use strict';

/* ===== Image Compare Slider ===== */
function initImageCompare() {
  document.querySelectorAll('.image-compare').forEach(container => {
    const overlay = container.querySelector('.compare-overlay');
    const divider = container.querySelector('.compare-divider');

    function setPosition(clientX) {
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const pct = (x / rect.width) * 100;
      overlay.style.width = pct + '%';
      divider.style.left = pct + '%';
    }

    function syncImageWidth() {
      overlay.querySelector('img').style.width = container.offsetWidth + 'px';
    }
    syncImageWidth();
    window.addEventListener('resize', syncImageWidth);

    container.addEventListener('mousemove', e => setPosition(e.clientX));
    container.addEventListener('touchstart', e => setPosition(e.touches[0].clientX), { passive: true });
    container.addEventListener('touchmove', e => {
      e.preventDefault();
      setPosition(e.touches[0].clientX);
    }, { passive: false });
  });
}

/* ===== Hero scene switcher ===== */
const heroSceneIds = [1, 2, 3, 6, 9, 12, 14, 16];

function initHeroScenes() {
  const controls = document.getElementById('hero-scene-controls');
  const container = document.getElementById('hero-compare');
  if (!controls || !container) return;

  const baseImg    = container.querySelector('.base-img');
  const overlayImg = container.querySelector('.compare-overlay img');
  const overlay    = container.querySelector('.compare-overlay');
  const divider    = container.querySelector('.compare-divider');

  // Build buttons dynamically
  controls.innerHTML = '';
  heroSceneIds.forEach((id, idx) => {
    const btn = document.createElement('button');
    btn.className = 'scene-btn' + (idx === 0 ? ' active' : '');
    btn.textContent = 'Scene ' + (idx + 1);
    btn.dataset.sceneId = id;
    btn.addEventListener('click', () => {
      controls.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      overlay.style.width = '50%';
      divider.style.left  = '50%';
      baseImg.src    = `images/ours_algo_${id}.png`;
      overlayImg.src = `images/blurc_${id}.png`;
      overlayImg.style.width = container.offsetWidth + 'px';
    });
    controls.appendChild(btn);
  });
}

/* ===== System Comparison ===== */
const sysScenes = ['12', '16', '21', '24'];
const sysMethods = ['Yang', 'Tseng', 'Pinilla', 'Ours', 'GT'];
const sysMethodLabels = ['Yang et al.', 'Tseng et al.', 'Pinilla et al.', 'Ours', 'Ground Truth'];

function initSysComparison() {
  const container = document.getElementById('sys-comparison');
  if (!container) return;

  const controls = container.querySelector('.comparison-controls');
  const grid = container.querySelector('.sys-grid-wrap .sys-grid');

  // Build scene buttons
  sysScenes.forEach((scene, i) => {
    const btn = document.createElement('button');
    btn.className = 'scene-btn' + (i === 0 ? ' active' : '');
    btn.textContent = 'Scene ' + (i + 1);
    btn.dataset.scene = scene;
    btn.addEventListener('click', () => {
      controls.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSysGrid(scene, grid);
    });
    controls.appendChild(btn);
  });

  renderSysGrid(sysScenes[0], grid);
}

function renderSysGrid(scene, grid) {
  grid.innerHTML = '';
  sysMethods.forEach((method, i) => {
    const item = document.createElement('div');
    item.className = 'sys-grid-item';
    const img = document.createElement('img');
    img.src = 'images/' + method + '_' + scene + '.png';
    img.alt = sysMethodLabels[i];
    img.loading = 'lazy';
    const label = document.createElement('p');
    label.className = 'comparison-label';
    label.textContent = sysMethodLabels[i];
    item.appendChild(img);
    item.appendChild(label);
    grid.appendChild(item);
  });
}

/* ===== BibTeX copy ===== */
function initBibtex() {
  const btn = document.querySelector('.copy-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const code = document.querySelector('.bibtex-block code');
    navigator.clipboard.writeText(code.textContent.trim()).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
}

/* ===== Smooth nav highlighting ===== */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + entry.target.id
            ? 'var(--accent)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
  initImageCompare();
  initHeroScenes();
  initSysComparison();
  initBibtex();
  initNavHighlight();
});
