// ═══════════════════════════════════════════════════════════════════════════════
// AUTH — connexion par e-mail + mot de passe, inscription avec code d'invitation (cahier §4).
// Le statut « validé » est contrôlé par les RLS ; cette page ne fait qu'orienter l'utilisateur.
// ═══════════════════════════════════════════════════════════════════════════════
let currentProfile = null;

const REFUSAL_MESSAGES = {
  en_attente: 'Compte en attente de validation par un administrateur.',
  refuse: 'Demande d\'accès refusée.',
  desactive: 'Compte désactivé.'
};

// Un code d'invitation faux fait échouer le trigger de la base : le client ne reçoit que `unexpected_failure`.
const SIGNUP_ERROR_MESSAGES = {
  unexpected_failure: 'Code d\'invitation invalide.',
  user_already_exists: 'Cet e-mail est déjà inscrit.',
  weak_password: 'Mot de passe trop court (8 caractères minimum).',
  email_address_invalid: 'Adresse e-mail invalide.'
};

// Ouvre l'accueil si le compte est validé ; sinon déconnecte et renvoie le message à afficher.
async function enterWith(profile) {
  let refusal = '';
  if (profile.status === 'valide') {
    currentProfile = profile;
    showView('home');
  } else {
    await signOut();
    refusal = REFUSAL_MESSAGES[profile.status];
  }
  return refusal;
}

async function restoreSession() {
  const profile = await loadOwnProfile();
  if (profile) showMessage('login-error', await enterWith(profile));
}

async function logout() {
  await signOut();
  currentProfile = null;
  showView('login');
}

async function onLoginSubmit(event) {
  event.preventDefault();
  showMessage('login-info', '');
  showMessage('login-error', '');
  try {
    await signIn(
      document.getElementById('login-email').value.trim(),
      document.getElementById('login-password').value
    );
    showMessage('login-error', await enterWith(await loadOwnProfile()));
  } catch (e) {
    showMessage('login-error', 'Connexion impossible : e-mail ou mot de passe incorrect.');
  }
}

async function onSignupSubmit(event) {
  event.preventDefault();
  showMessage('signup-error', '');
  try {
    await signUp(
      document.getElementById('signup-firstname').value.trim(),
      document.getElementById('signup-email').value.trim(),
      document.getElementById('signup-password').value,
      document.getElementById('signup-code').value.trim()
    );
    await signOut(); // l'inscription ouvre une session, mais le compte reste en attente
    event.target.reset();
    showView('login');
    showMessage('login-info', 'Demande envoyée. Tu pourras te connecter dès qu\'un administrateur aura validé ton compte.');
  } catch (e) {
    showMessage('signup-error', SIGNUP_ERROR_MESSAGES[e.code] || 'Inscription impossible, réessaie plus tard.');
  }
}
