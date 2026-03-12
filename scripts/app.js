// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const menuOverlay = document.getElementById('menu-overlay');

function openMenu() {
  navLinks.classList.add('open');
  hamburger.classList.add('open');
  menuOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  menuOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});
menuOverlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// Close button inside menu
const navCloseBtn = document.getElementById('nav-close');
if (navCloseBtn) navCloseBtn.addEventListener('click', closeMenu);

// ===== MIN DATE =====
const dateInput = document.getElementById('date');
if (dateInput) {
  dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
}

// ===== VALIDATION =====
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^[+]?[\d\s\-()]{7,}$/.test(phone);
}
function setError(fieldId, msg) {
  const el = document.getElementById(fieldId);
  const errEl = document.getElementById(fieldId + 'Error');
  if (el) el.classList.toggle('error', !!msg);
  if (errEl) errEl.textContent = msg || '';
}
function clearErrors() {
  ['fullName','email','phone','service','date','time','consent'].forEach(f => setError(f, ''));
}
function validateForm() {
  clearErrors();
  let valid = true;
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const consent = document.getElementById('consent').checked;
  if (!fullName || fullName.length < 2) { setError('fullName', 'Lūdzu, ievadiet savu vārdu un uzvārdu.'); valid = false; }
  if (!email || !validateEmail(email)) { setError('email', 'Lūdzu, ievadiet derīgu e-pasta adresi.'); valid = false; }
  if (!phone || !validatePhone(phone)) { setError('phone', 'Lūdzu, ievadiet derīgu tālruņa numuru.'); valid = false; }
  if (!service) { setError('service', 'Lūdzu, izvēlieties procedūru.'); valid = false; }
  if (!date) { setError('date', 'Lūdzu, izvēlieties datumu.'); valid = false; }
  if (!time) { setError('time', 'Lūdzu, izvēlieties laiku.'); valid = false; }
  if (!consent) { setError('consent', 'Jums jāpiekrīt privātuma politikai.'); valid = false; }
  return valid;
}

// ===== FORM SUBMIT =====
const bookingForm = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');

bookingForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateForm()) return;
  const btn = this.querySelector('.btn-submit');
  btn.textContent = 'Sūta...';
  btn.disabled = true;
  setTimeout(() => {
    bookingForm.style.display = 'none';
    formSuccess.style.display = 'block';
  }, 800);
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navItems.forEach(a => {
    a.style.fontWeight = a.getAttribute('href') === '#' + current ? '700' : '500';
  });
});
