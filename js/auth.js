// ═══════════════════════════════════════════════════════════════════════════════
// AUTH — connexion par prénom + mot de passe (cahier §4).
// Le statut « validé » est contrôlé par les RLS, pas par cette page.
// ═══════════════════════════════════════════════════════════════════════════════
let currentProfile = null;

async function login(firstname, password) {
  const { error } = await db.auth.signInWithPassword({ email: firstnameToEmail(firstname), password });
  if (error) throw error;
}

async function logout() {
  await db.auth.signOut();
  currentProfile = null;
  showView('login');
}

async function onLoginSubmit(event) {
  event.preventDefault();
  const errorEl = document.getElementById('login-error');
  errorEl.hidden = true;
  try {
    await login(
      document.getElementById('login-firstname').value,
      document.getElementById('login-password').value
    );
    showView('home');
  } catch (e) {
    errorEl.textContent = 'Connexion impossible : prénom ou mot de passe incorrect, ou compte pas encore validé.';
    errorEl.hidden = false;
  }
}
