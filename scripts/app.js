// NAVBAR
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// MENU
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const overlay   = document.getElementById('menu-overlay');
const closeBtn  = document.getElementById('nav-close');

function openMenu()  { navLinks.classList.add('open'); hamburger.classList.add('open'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
function closeMenu() { navLinks.classList.remove('open'); hamburger.classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow = ''; }

hamburger.addEventListener('click', () => navLinks.classList.contains('open') ? closeMenu() : openMenu());
overlay.addEventListener('click', closeMenu);
closeBtn.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

// DATE MIN
const di = document.getElementById('date');
if (di) di.setAttribute('min', new Date().toISOString().split('T')[0]);

// VALIDATION
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = v => /^[+]?[\d\s\-()]{7,}$/.test(v);

function setErr(id, msg) {
  const el = document.getElementById(id);
  const em = document.getElementById(id + 'Error');
  if (el) el.style.borderColor = msg ? '#c0392b' : '';
  if (em) em.textContent = msg || '';
}
function clearErrs() {
  ['fullName','email','phone','service','date','time','consent'].forEach(f => setErr(f, ''));
}
function validate() {
  clearErrs();
  let ok = true;
  const v = id => document.getElementById(id)?.value?.trim();
  if (!v('fullName') || v('fullName').length < 2) { setErr('fullName', 'Ievadiet vārdu un uzvārdu.'); ok = false; }
  if (!isEmail(v('email'))) { setErr('email', 'Derīga e-pasta adrese.'); ok = false; }
  if (!isPhone(v('phone'))) { setErr('phone', 'Derīgs tālruņa numurs.'); ok = false; }
  if (!v('service')) { setErr('service', 'Izvēlieties procedūru.'); ok = false; }
  if (!v('date')) { setErr('date', 'Izvēlieties datumu.'); ok = false; }
  if (!document.getElementById('time')?.value) { setErr('time', 'Izvēlieties laiku.'); ok = false; }
  if (!document.getElementById('consent')?.checked) { setErr('consent', 'Piekrītiet politikai.'); ok = false; }
  return ok;
}

// FORM
const form    = document.getElementById('bookingForm');
const success = document.getElementById('formSuccess');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validate()) return;
  const btn = this.querySelector('.btn-submit');
  btn.textContent = 'Sūta...';
  btn.disabled = true;
  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
  }, 800);
});

// ACTIVE NAV
const secs = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navAs.forEach(a => { a.style.fontWeight = a.getAttribute('href') === '#'+cur ? '700' : '500'; });
}, { passive: true });
