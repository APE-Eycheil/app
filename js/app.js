// ═══════════════════════════════════════════════════════════════════════════════
// APP — point d'entrée
// ═══════════════════════════════════════════════════════════════════════════════
document.getElementById('login-form').addEventListener('submit', onLoginSubmit);
document.getElementById('signup-form').addEventListener('submit', onSignupSubmit);
document.getElementById('btn-to-signup').addEventListener('click', () => showView('signup'));
document.getElementById('btn-to-login').addEventListener('click', () => showView('login'));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

showView('login');
if (initData()) {
  restoreSession().catch(() => {}); // hors ligne ou session expirée : on reste sur la connexion
} else {
  showMessage('login-error', 'Appli en cours de mise en place : base de données pas encore configurée.');
}
