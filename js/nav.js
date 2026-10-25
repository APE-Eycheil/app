// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION — une vue = <section id="view-xxx" class="view">
// ═══════════════════════════════════════════════════════════════════════════════
const NAV_BUTTONS = { home: 'nav-home' };

function showView(name) {
  document.querySelectorAll('.view').forEach(el => { el.hidden = true; });
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  document.getElementById('view-' + name).hidden = false;
  document.getElementById('topbar').hidden = name === 'login' || name === 'signup';

  const navId = NAV_BUTTONS[name];
  if (navId) document.getElementById(navId).classList.add('active');
}

document.getElementById('nav-home').addEventListener('click', () => showView('home'));
document.getElementById('btn-logout').addEventListener('click', () => logout());
