const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = [...document.querySelectorAll('.nav-menu a')];
const themeToggle = document.querySelector('.theme-toggle');
const sections = [...document.querySelectorAll('section[id]')];
const copyEmailButton = document.querySelector('.copy-email');
const backToTopLink = document.querySelector('.back-to-top');
const currentYear = document.querySelector('#year');

body.classList.add('reveal-ready');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
  themeToggle.textContent = 'L';
}

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navMenu.classList.toggle('open', !isOpen);
  body.classList.toggle('menu-open', !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    body.classList.remove('menu-open');
  });
});

themeToggle?.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('portfolio-theme', 'dark');
    themeToggle.textContent = 'D';
    return;
  }

  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('portfolio-theme', 'light');
  themeToggle.textContent = 'L';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const id = entry.target.getAttribute('id');
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-30% 0px -55% 0px' });

sections.forEach((section) => activeObserver.observe(section));

backToTopLink?.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
});

copyEmailButton?.addEventListener('click', async () => {
  const email = copyEmailButton.dataset.email;

  try {
    await navigator.clipboard.writeText(email);
    const original = copyEmailButton.textContent;
    copyEmailButton.textContent = 'Email Copied';
    setTimeout(() => {
      copyEmailButton.textContent = original;
    }, 1800);
  } catch (error) {
    window.location.href = `mailto:${email}`;
  }
});
