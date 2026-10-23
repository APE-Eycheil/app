// ═══════════════════════════════════════════════════════════════════════════════
// APP — point d'entrée
// ═══════════════════════════════════════════════════════════════════════════════
document.getElementById('login-form').addEventListener('submit', onLoginSubmit);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

showView('login');
if (!initData()) {
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = 'Appli en cours de mise en place : base de données pas encore configurée.';
  errorEl.hidden = false;
}
