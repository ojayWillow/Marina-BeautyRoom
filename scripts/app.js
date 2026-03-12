// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ===== SET MIN DATE TO TODAY =====
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// ===== FORM VALIDATION =====
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
  if (!fullName || fullName.length < 2) { setError('fullName', 'Please enter your full name.'); valid = false; }
  if (!email || !validateEmail(email)) { setError('email', 'Please enter a valid email address.'); valid = false; }
  if (!phone || !validatePhone(phone)) { setError('phone', 'Please enter a valid phone number.'); valid = false; }
  if (!service) { setError('service', 'Please select a service.'); valid = false; }
  if (!date) { setError('date', 'Please choose a date.'); valid = false; }
  if (!time) { setError('time', 'Please choose a time slot.'); valid = false; }
  if (!consent) { setError('consent', 'You must agree to our privacy policy.'); valid = false; }
  return valid;
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

// ===== FORM SUBMIT =====
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateForm()) return;
  const btn = this.querySelector('.btn-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    showToast('🌸 Thank you! We\'ll confirm your booking within 24 hours.');
    this.reset();
    btn.textContent = '🌸 Book My Appointment';
    btn.disabled = false;
  }, 1000);
});

// ===== SMOOTH ACTIVE NAV HIGHLIGHT =====
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
