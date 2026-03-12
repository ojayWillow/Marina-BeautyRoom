// NAVBAR SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// MOBILE MENU
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

// -------------------------------------------------------
// TIME SLOT CALENDAR
// -------------------------------------------------------

// Slots that are already TAKEN (simulate real bookings)
// Format: 'YYYY-MM-DD_HH:MM'
const TAKEN = new Set([
  `${ds(0)}_09:00`, `${ds(0)}_10:00`, `${ds(0)}_14:00`,
  `${ds(1)}_08:00`, `${ds(1)}_11:00`, `${ds(1)}_15:00`, `${ds(1)}_16:00`,
  `${ds(2)}_09:00`, `${ds(2)}_13:00`,
  `${ds(3)}_10:00`, `${ds(3)}_11:00`, `${ds(3)}_12:00`, `${ds(3)}_17:00`,
  `${ds(4)}_08:00`, `${ds(4)}_14:00`,
  `${ds(5)}_09:00`, `${ds(5)}_10:00`, `${ds(5)}_11:00`,
  `${ds(6)}_15:00`, `${ds(6)}_16:00`,
]);

// All available time slots (24/7 salon, practical hours)
const TIME_SLOTS = [
  '08:00','09:00','10:00','11:00','12:00','13:00',
  '14:00','15:00','16:00','17:00','18:00','19:00','20:00'
];

const LV_DAYS  = ['Sv','Pr','Ot','Tr','Ce','Pk','Se'];
const LV_MONTHS = ['janv.','febr.','marts','apr.','maijs','jūn.','jūl.','aug.','sept.','okt.','nov.','dec.'];

function ds(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

function fmtDate(d) {
  return `${d.getDate()}. ${LV_MONTHS[d.getMonth()]} (${LV_DAYS[d.getDay()]})`;
}

let weekOffset = 0;
let selectedSlot = null;
let selectedDate = null;

const calDays   = document.getElementById('calDays');
const slotsGrid = document.getElementById('slotsGrid');
const slotPanel = document.getElementById('slotPanel');
const spChosen  = document.getElementById('spChosen');

function getWeekDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7 + i);
    return d;
  });
}

function dateStr(d) {
  return d.toISOString().split('T')[0];
}

function renderCalendar() {
  const days = getWeekDates();
  calDays.innerHTML = '';
  days.forEach((d, i) => {
    const key = dateStr(d);
    const freeCount = TIME_SLOTS.filter(t => !TAKEN.has(`${key}_${t}`)).length;
    const btn = document.createElement('button');
    btn.className = 'cal-day' + (selectedDate === key ? ' active' : '');
    btn.innerHTML = `
      <span class="cd-day">${LV_DAYS[d.getDay()]}</span>
      <span class="cd-num">${d.getDate()}</span>
      <span class="cd-dot${freeCount === 0 ? ' none' : ''}"></span>
    `;
    btn.title = freeCount > 0 ? `${freeCount} brīvie laiki` : 'Nav brīvu laiku';
    btn.addEventListener('click', () => selectDate(key, d));
    calDays.appendChild(btn);
  });
}

function selectDate(key, dateObj) {
  selectedDate = key;
  selectedSlot = null;
  slotPanel.style.display = 'none';
  renderCalendar();
  renderSlots(key, dateObj);
}

function renderSlots(key, dateObj) {
  slotsGrid.innerHTML = '';
  TIME_SLOTS.forEach(t => {
    const taken = TAKEN.has(`${key}_${t}`);
    const div = document.createElement('div');
    div.className = `slot ${taken ? 'taken' : 'free'}`;
    div.textContent = t;
    if (!taken) {
      div.addEventListener('click', () => pickSlot(key, t, dateObj));
    }
    slotsGrid.appendChild(div);
  });
}

function pickSlot(key, time, dateObj) {
  selectedSlot = `${key}_${time}`;
  // Highlight selected
  slotsGrid.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
  const all = slotsGrid.querySelectorAll('.slot.free');
  all.forEach(s => { if (s.textContent === time) s.classList.add('selected'); });
  // Show panel
  spChosen.textContent = `${fmtDate(dateObj)}, plkst. ${time}`;
  slotPanel.style.display = 'block';
  slotPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  // Reset form if re-picking
  const fs = document.getElementById('formSuccess');
  const bf = document.getElementById('bookingForm');
  if (fs) fs.style.display = 'none';
  if (bf) bf.style.display = 'block';
}

// Week navigation
document.getElementById('calPrev').addEventListener('click', () => {
  if (weekOffset > 0) { weekOffset--; selectedDate = null; selectedSlot = null; slotPanel.style.display = 'none'; slotsGrid.innerHTML = ''; renderCalendar(); }
});
document.getElementById('calNext').addEventListener('click', () => {
  if (weekOffset < 4) { weekOffset++; selectedDate = null; selectedSlot = null; slotPanel.style.display = 'none'; slotsGrid.innerHTML = ''; renderCalendar(); }
});

// Init: select today
(function init() {
  const today = new Date();
  selectedDate = dateStr(today);
  renderCalendar();
  renderSlots(dateStr(today), today);
})();

// -------------------------------------------------------
// FORM VALIDATION & SUBMIT
// -------------------------------------------------------
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = v => /^[+]?[\d\s\-()]{7,}$/.test(v);

function setErr(id, msg) {
  const el = document.getElementById(id);
  const em = document.getElementById(id + 'Error');
  if (el) el.style.borderColor = msg ? '#c0392b' : '';
  if (em) em.textContent = msg || '';
}
function clearErrs() {
  ['fullName','email','phone','service','consent'].forEach(f => setErr(f, ''));
}
function validate() {
  clearErrs();
  let ok = true;
  const v = id => document.getElementById(id)?.value?.trim();
  if (!v('fullName') || v('fullName').length < 2) { setErr('fullName', 'Ievadiet vārdu un uzvārdu.'); ok = false; }
  if (!isEmail(v('email'))) { setErr('email', 'Derīga e-pasta adrese.'); ok = false; }
  if (!isPhone(v('phone'))) { setErr('phone', 'Derīgs tālruņa numurs.'); ok = false; }
  if (!v('service')) { setErr('service', 'Izvēlieties procedūru.'); ok = false; }
  if (!document.getElementById('consent')?.checked) { setErr('consent', 'Piekrītiet politikai.'); ok = false; }
  return ok;
}

const form    = document.getElementById('bookingForm');
const success = document.getElementById('formSuccess');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!selectedSlot) { alert('Lūdzu, izvēlieties laiku!'); return; }
  if (!validate()) return;
  const btn = this.querySelector('.btn-submit');
  btn.textContent = 'Sūta...';
  btn.disabled = true;
  setTimeout(() => {
    // Mark the slot as taken locally
    TAKEN.add(selectedSlot);
    renderCalendar();
    renderSlots(selectedDate, new Date(selectedDate));
    form.style.display = 'none';
    success.style.display = 'block';
    btn.textContent = 'Nosutīt pierakstu';
    btn.disabled = false;
  }, 800);
});

// ACTIVE NAV
const secs  = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navAs.forEach(a => { a.style.fontWeight = a.getAttribute('href') === '#'+cur ? '700' : '500'; });
}, { passive: true });
